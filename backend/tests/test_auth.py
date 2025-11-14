"""
Tests for authentication endpoints
"""
import pytest
from fastapi import status


class TestUserRegistration:
    """Tests for user registration"""
    
    def test_register_new_user_success(self, client):
        """Test successful user registration"""
        user_data = {
            "email": "newuser@example.com",
            "password": "securepassword123",
            "first_name": "New",
            "last_name": "User",
            "phone": "+1234567890"
        }
        
        response = client.post("/api/auth/register", json=user_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["email"] == user_data["email"]
        assert data["first_name"] == user_data["first_name"]
        assert data["last_name"] == user_data["last_name"]
        assert data["phone"] == user_data["phone"]
        assert data["role"] == "USER"
        assert "id" in data
        assert "hashed_password" not in data  # Password should not be exposed
    
    def test_register_duplicate_email(self, client, test_user):
        """Test registration with existing email fails"""
        user_data = {
            "email": test_user.email,  # Email already exists
            "password": "password123",
            "first_name": "Duplicate",
            "last_name": "User",
            "phone": "+9999999999"
        }
        
        response = client.post("/api/auth/register", json=user_data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "already registered" in response.json()["detail"].lower()
    
    def test_register_invalid_email_format(self, client):
        """Test registration with invalid email format"""
        user_data = {
            "email": "invalid-email",
            "password": "password123",
            "first_name": "Test",
            "last_name": "User",
            "phone": "+1234567890"
        }
        
        response = client.post("/api/auth/register", json=user_data)
        
        # Pydantic validation should fail
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_register_missing_required_fields(self, client):
        """Test registration with missing required fields"""
        user_data = {
            "email": "test@example.com",
            # Missing password, first_name, last_name
        }
        
        response = client.post("/api/auth/register", json=user_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestUserLogin:
    """Tests for user login"""
    
    def test_login_success(self, client, test_user):
        """Test successful login with valid credentials"""
        login_data = {
            "username": test_user.email,  # OAuth2 uses 'username' field
            "password": "testpassword"
        }
        
        response = client.post("/api/auth/login", data=login_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert isinstance(data["access_token"], str)
        assert len(data["access_token"]) > 0
    
    def test_login_wrong_password(self, client, test_user):
        """Test login with incorrect password"""
        login_data = {
            "username": test_user.email,
            "password": "wrongpassword"
        }
        
        response = client.post("/api/auth/login", data=login_data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "incorrect" in response.json()["detail"].lower()
    
    def test_login_nonexistent_user(self, client):
        """Test login with non-existent email"""
        login_data = {
            "username": "nonexistent@example.com",
            "password": "somepassword"
        }
        
        response = client.post("/api/auth/login", data=login_data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_login_missing_credentials(self, client):
        """Test login with missing credentials"""
        response = client.post("/api/auth/login", data={})
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestCurrentUser:
    """Tests for getting current user profile"""
    
    def test_get_current_user_success(self, client, test_user, auth_headers):
        """Test getting current user profile with valid token"""
        response = client.get("/api/auth/me", headers=auth_headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == test_user.id
        assert data["email"] == test_user.email
        assert data["first_name"] == test_user.first_name
        assert data["last_name"] == test_user.last_name
        assert data["role"] == test_user.role.value
    
    def test_get_current_user_no_token(self, client):
        """Test getting current user without authentication token"""
        response = client.get("/api/auth/me")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_get_current_user_invalid_token(self, client):
        """Test getting current user with invalid token"""
        headers = {"Authorization": "Bearer invalid_token_here"}
        response = client.get("/api/auth/me", headers=headers)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_get_current_user_malformed_header(self, client):
        """Test getting current user with malformed authorization header"""
        headers = {"Authorization": "InvalidFormat token123"}
        response = client.get("/api/auth/me", headers=headers)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
