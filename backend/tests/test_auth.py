"""
Unit tests for authentication functions
Tests isolated functions with mocks, NO database
"""
import pytest
from unittest.mock import Mock, patch
from app.auth import get_password_hash, verify_password, create_access_token


class TestPasswordFunctions:
    """Test password hashing and verification"""
    
    def test_hash_password(self):
        """Test password hashing creates valid hash"""
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        assert hashed != password
        assert len(hashed) > 0
        assert hashed.startswith("$2b$")
    
    def test_verify_password_success(self):
        """Test password verification with correct password"""
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        assert verify_password(password, hashed) is True
    
    def test_verify_password_failure(self):
        """Test password verification with wrong password"""
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        assert verify_password("wrongpassword", hashed) is False


class TestTokenCreation:
    """Test JWT token creation"""
    
    def test_create_access_token(self):
        """Test JWT token creation with user ID"""
        user_id = "test-user-123"
        token = create_access_token(data={"sub": user_id})
        
        assert isinstance(token, str)
        assert len(token) > 0
        # JWT tokens have 3 parts separated by dots
        assert token.count('.') == 2


class TestUserAuthentication:
    """Test user authentication functions with mocks"""
    
    def test_get_current_user_valid_token(self):
        """Test getting current user with valid token"""
        from app.auth import get_current_user
        from app.models import User
        
        # Create valid token
        user_id = "test-user-123"
        token = create_access_token({"sub": user_id})
        
        # Mock database and user
        mock_db = Mock()
        mock_user = Mock(spec=User)
        mock_user.id = user_id
        mock_db.query.return_value.filter.return_value.first.return_value = mock_user
        
        result = get_current_user(token=token, db=mock_db)
        assert result == mock_user
    
    def test_get_current_user_invalid_token(self):
        """Test invalid token raises 401"""
        from app.auth import get_current_user
        from fastapi import HTTPException
        
        mock_db = Mock()
        
        with pytest.raises(HTTPException) as exc:
            get_current_user(token="invalid_token", db=mock_db)
        
        assert exc.value.status_code == 401
    
    def test_get_current_admin_user_success(self):
        """Test admin verification succeeds for admin user"""
        from app.auth import get_current_admin_user
        from app.models import UserRole
        
        mock_user = Mock()
        mock_user.role = UserRole.ADMIN
        
        result = get_current_admin_user(current_user=mock_user)
        assert result == mock_user
    
    def test_get_current_admin_user_forbidden(self):
        """Test non-admin user is rejected with 403"""
        from app.auth import get_current_admin_user
        from app.models import UserRole
        from fastapi import HTTPException
        
        mock_user = Mock()
        mock_user.role = UserRole.USER
        
        with pytest.raises(HTTPException) as exc:
            get_current_admin_user(current_user=mock_user)
        
        assert exc.value.status_code == 403
