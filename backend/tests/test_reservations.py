"""
Tests for reservations endpoints
"""
import pytest
from fastapi import status
from datetime import date, time, timedelta


class TestCreateReservation:
    """Tests for creating a reservation"""
    
    def test_create_reservation_success(self, client, auth_headers, test_court):
        """Test creating a reservation with valid data"""
        from datetime import datetime
        future_date = date.today() + timedelta(days=7)
        
        reservation_data = {
            "court_id": test_court.id,
            "date": future_date.strftime("%Y-%m-%dT00:00:00"),
            "start_time": f"{future_date.strftime('%Y-%m-%d')}T15:00:00",
            "end_time": f"{future_date.strftime('%Y-%m-%d')}T16:00:00",
            "notes": "Test reservation"
        }
        
        response = client.post(
            "/api/reservations",
            json=reservation_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["court_id"] == test_court.id
        assert future_date.strftime("%Y-%m-%d") in data["date"]
        assert data["status"] == "CONFIRMED"
        assert "id" in data
        assert "total_price" in data
    
    def test_create_reservation_without_auth(self, client, test_court):
        """Test creating a reservation without authentication"""
        future_date = date.today() + timedelta(days=7)
        
        reservation_data = {
            "court_id": test_court.id,
            "date": future_date.strftime("%Y-%m-%dT00:00:00"),
            "start_time": f"{future_date.strftime('%Y-%m-%d')}T15:00:00",
            "end_time": f"{future_date.strftime('%Y-%m-%d')}T16:00:00"
        }
        
        response = client.post("/api/reservations", json=reservation_data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_create_reservation_court_not_found(self, client, auth_headers):
        """Test creating a reservation with non-existent court"""
        future_date = date.today() + timedelta(days=7)
        
        reservation_data = {
            "court_id": "nonexistent-court-id",
            "date": future_date.strftime("%Y-%m-%dT00:00:00"),
            "start_time": f"{future_date.strftime('%Y-%m-%d')}T15:00:00",
            "end_time": f"{future_date.strftime('%Y-%m-%d')}T16:00:00"
        }
        
        response = client.post(
            "/api/reservations",
            json=reservation_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "court not found" in response.json()["detail"].lower()
    
    def test_create_reservation_overlapping_time(self, client, auth_headers, test_reservation, test_court):
        """Test creating a reservation that overlaps with existing one"""
        # test_reservation is for "2025-12-01" at 14:00-15:00
        reservation_data = {
            "court_id": test_court.id,
            "date": "2025-12-01T00:00:00",
            "start_time": "2025-12-01T14:30:00",  # Overlaps with existing
            "end_time": "2025-12-01T15:30:00"
        }
        
        response = client.post(
            "/api/reservations",
            json=reservation_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "already reserved" in response.json()["detail"].lower()
    
    def test_create_reservation_trailing_slash(self, client, auth_headers, test_court):
        """Test that trailing slash works"""
        future_date = date.today() + timedelta(days=7)
        
        reservation_data = {
            "court_id": test_court.id,
            "date": future_date.strftime("%Y-%m-%dT00:00:00"),
            "start_time": f"{future_date.strftime('%Y-%m-%d')}T15:00:00",
            "end_time": f"{future_date.strftime('%Y-%m-%d')}T16:00:00"
        }
        
        response = client.post(
            "/api/reservations/",
            json=reservation_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_201_CREATED


class TestGetMyReservations:
    """Tests for getting current user's reservations"""
    
    def test_get_my_reservations_success(self, client, auth_headers, test_reservation):
        """Test getting own reservations"""
        response = client.get(
            "/api/reservations/my-reservations",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]["id"] == test_reservation.id
        # Should include court and user details
        assert "court" in data[0]
        assert "user" in data[0]
    
    def test_get_my_reservations_empty(self, client, auth_headers):
        """Test getting reservations when user has none"""
        response = client.get(
            "/api/reservations/my-reservations",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == []
    
    def test_get_my_reservations_without_auth(self, client):
        """Test getting reservations without authentication"""
        response = client.get("/api/reservations/my-reservations")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestGetAllReservations:
    """Tests for getting all reservations (admin only)"""
    
    def test_get_all_reservations_as_admin(self, client, admin_headers, test_reservation):
        """Test getting all reservations as admin"""
        response = client.get(
            "/api/reservations/all",
            headers=admin_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
    
    def test_get_all_reservations_as_regular_user(self, client, auth_headers):
        """Test getting all reservations as non-admin (should fail)"""
        response = client.get(
            "/api/reservations/all",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_get_all_reservations_without_auth(self, client):
        """Test getting all reservations without authentication"""
        response = client.get("/api/reservations/all")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestGetReservationById:
    """Tests for getting a specific reservation"""
    
    def test_get_reservation_success_as_owner(self, client, auth_headers, test_reservation):
        """Test getting own reservation by ID"""
        response = client.get(
            f"/api/reservations/{test_reservation.id}",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == test_reservation.id
        assert data["court_id"] == test_reservation.court_id
        assert "court" in data
        assert "user" in data
    
    def test_get_reservation_as_admin(self, client, admin_headers, test_reservation):
        """Test getting any reservation as admin"""
        response = client.get(
            f"/api/reservations/{test_reservation.id}",
            headers=admin_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["id"] == test_reservation.id
    
    def test_get_reservation_not_found(self, client, auth_headers):
        """Test getting a non-existent reservation"""
        response = client.get(
            "/api/reservations/nonexistent-id",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_get_reservation_unauthorized_user(self, client, db_session, test_reservation):
        """Test getting another user's reservation (should fail)"""
        from app import models
        from app.auth import get_password_hash, create_access_token
        
        # Create a different user
        other_user = models.User(
            id="other-user-123",
            email="other@example.com",
            hashed_password=get_password_hash("password"),
            first_name="Other",
            last_name="User",
            phone="+9999999999",
            role=models.UserRole.USER
        )
        db_session.add(other_user)
        db_session.commit()
        
        # Create token for the other user
        other_token = create_access_token(data={"sub": other_user.id})
        other_headers = {"Authorization": f"Bearer {other_token}"}
        
        response = client.get(
            f"/api/reservations/{test_reservation.id}",
            headers=other_headers
        )
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_get_reservation_without_auth(self, client, test_reservation):
        """Test getting a reservation without authentication"""
        response = client.get(f"/api/reservations/{test_reservation.id}")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestCancelReservation:
    """Tests for cancelling a reservation"""
    
    def test_cancel_reservation_success_as_owner(self, client, auth_headers, test_reservation, db_session):
        """Test cancelling own reservation"""
        response = client.delete(
            f"/api/reservations/{test_reservation.id}",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert "cancelled" in response.json()["message"].lower()
        
        # Verify status changed to CANCELLED
        db_session.refresh(test_reservation)
        assert test_reservation.status == "CANCELLED"
    
    def test_cancel_reservation_as_admin(self, client, admin_headers, test_reservation, db_session):
        """Test cancelling any reservation as admin"""
        response = client.delete(
            f"/api/reservations/{test_reservation.id}",
            headers=admin_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        db_session.refresh(test_reservation)
        assert test_reservation.status == "CANCELLED"
    
    def test_cancel_reservation_not_found(self, client, auth_headers):
        """Test cancelling a non-existent reservation"""
        response = client.delete(
            "/api/reservations/nonexistent-id",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_cancel_reservation_unauthorized_user(self, client, db_session, test_reservation):
        """Test cancelling another user's reservation (should fail)"""
        from app import models
        from app.auth import get_password_hash, create_access_token
        
        # Create a different user
        other_user = models.User(
            id="other-user-456",
            email="another@example.com",
            hashed_password=get_password_hash("password"),
            first_name="Another",
            last_name="User",
            phone="+8888888888",
            role=models.UserRole.USER
        )
        db_session.add(other_user)
        db_session.commit()
        
        # Create token for the other user
        other_token = create_access_token(data={"sub": other_user.id})
        other_headers = {"Authorization": f"Bearer {other_token}"}
        
        response = client.delete(
            f"/api/reservations/{test_reservation.id}",
            headers=other_headers
        )
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_cancel_reservation_without_auth(self, client, test_reservation):
        """Test cancelling a reservation without authentication"""
        response = client.delete(f"/api/reservations/{test_reservation.id}")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
