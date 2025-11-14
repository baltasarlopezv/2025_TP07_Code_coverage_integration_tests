"""
Tests for courts endpoints
"""
import pytest
from fastapi import status
from datetime import date, timedelta


class TestGetAllCourts:
    """Tests for getting all courts"""
    
    def test_get_all_courts_empty(self, client):
        """Test getting all courts when none exist"""
        response = client.get("/api/courts")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == []
    
    def test_get_all_courts_with_data(self, client, test_court):
        """Test getting all courts when courts exist"""
        response = client.get("/api/courts")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["id"] == test_court.id
        assert data[0]["name"] == test_court.name
        assert data[0]["location"] == test_court.location
    
    def test_get_all_courts_trailing_slash(self, client, test_court):
        """Test that trailing slash works"""
        response = client.get("/api/courts/")
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.json()) == 1


class TestGetCourtById:
    """Tests for getting a specific court"""
    
    def test_get_court_success(self, client, test_court):
        """Test getting a court by valid ID"""
        response = client.get(f"/api/courts/{test_court.id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == test_court.id
        assert data["name"] == test_court.name
        assert data["location"] == test_court.location
        assert data["price_per_hour"] == test_court.price_per_hour
        assert data["is_active"] == test_court.is_active
    
    def test_get_court_not_found(self, client):
        """Test getting a court with non-existent ID"""
        response = client.get("/api/courts/nonexistent-id")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "not found" in response.json()["detail"].lower()


class TestGetAvailableSlots:
    """Tests for getting available time slots"""
    
    def test_get_available_slots_all_free(self, client, test_court):
        """Test getting available slots when no reservations exist"""
        future_date = (date.today() + timedelta(days=7)).strftime("%Y-%m-%d")
        
        response = client.get(
            f"/api/courts/{test_court.id}/available-slots",
            params={"date": future_date}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["court_id"] == test_court.id
        assert data["date"] == future_date
        assert len(data["available_slots"]) == 8  # All 8 slots (12:00-20:00)
        assert data["reserved_count"] == 0
    
    def test_get_available_slots_with_reservations(self, client, test_court, test_reservation):
        """Test getting available slots when some are reserved"""
        # test_reservation is for date "2025-12-01" at 14:00-15:00
        response = client.get(
            f"/api/courts/{test_court.id}/available-slots",
            params={"date": "2025-12-01"}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["reserved_count"] == 1
        assert len(data["available_slots"]) == 7  # 8 - 1 reserved
        
        # Verify the reserved slot is not in available slots
        slot_labels = [slot["label"] for slot in data["available_slots"]]
        assert "14:00 - 15:00" not in slot_labels
    
    def test_get_available_slots_invalid_date_format(self, client, test_court):
        """Test getting available slots with invalid date format"""
        response = client.get(
            f"/api/courts/{test_court.id}/available-slots",
            params={"date": "invalid-date"}
        )
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "invalid date format" in response.json()["detail"].lower()
    
    def test_get_available_slots_court_not_found(self, client):
        """Test getting available slots for non-existent court"""
        future_date = (date.today() + timedelta(days=7)).strftime("%Y-%m-%d")
        
        response = client.get(
            "/api/courts/nonexistent-id/available-slots",
            params={"date": future_date}
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "court not found" in response.json()["detail"].lower()


class TestCreateCourt:
    """Tests for creating a new court"""
    
    def test_create_court_success(self, client, admin_headers, test_sport):
        """Test creating a court as admin"""
        court_data = {
            "name": "New Court",
            "sport_id": test_sport.id,
            "location": "New Location",
            "price_per_hour": 150.0,
            "capacity": 10,
            "is_active": True
        }
        
        response = client.post(
            "/api/courts",
            json=court_data,
            headers=admin_headers
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == court_data["name"]
        assert data["location"] == court_data["location"]
        assert data["price_per_hour"] == court_data["price_per_hour"]
        assert "id" in data
    
    def test_create_court_without_auth(self, client, test_sport):
        """Test creating a court without authentication"""
        court_data = {
            "name": "New Court",
            "sport_id": test_sport.id,
            "location": "New Location",
            "price_per_hour": 150.0,
            "capacity": 10
        }
        
        response = client.post("/api/courts", json=court_data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_create_court_as_regular_user(self, client, auth_headers, test_sport):
        """Test creating a court as non-admin user (should fail)"""
        court_data = {
            "name": "New Court",
            "sport_id": test_sport.id,
            "location": "New Location",
            "price_per_hour": 150.0,
            "capacity": 10
        }
        
        response = client.post(
            "/api/courts",
            json=court_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_create_court_invalid_sport(self, client, admin_headers):
        """Test creating a court with non-existent sport"""
        court_data = {
            "name": "New Court",
            "sport_id": "nonexistent-sport-id",
            "location": "New Location",
            "price_per_hour": 150.0,
            "capacity": 10
        }
        
        response = client.post(
            "/api/courts",
            json=court_data,
            headers=admin_headers
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "sport not found" in response.json()["detail"].lower()


class TestUpdateCourt:
    """Tests for updating a court"""
    
    def test_update_court_success(self, client, admin_headers, test_court):
        """Test updating a court as admin"""
        update_data = {
            "name": "Updated Court Name",
            "price_per_hour": 200.0
        }
        
        response = client.put(
            f"/api/courts/{test_court.id}",
            json=update_data,
            headers=admin_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == update_data["name"]
        assert data["price_per_hour"] == update_data["price_per_hour"]
        # Location should remain unchanged
        assert data["location"] == test_court.location
    
    def test_update_court_not_found(self, client, admin_headers):
        """Test updating a non-existent court"""
        update_data = {"name": "Updated Name"}
        
        response = client.put(
            "/api/courts/nonexistent-id",
            json=update_data,
            headers=admin_headers
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_update_court_without_auth(self, client, test_court):
        """Test updating a court without authentication"""
        update_data = {"name": "Updated Name"}
        
        response = client.put(
            f"/api/courts/{test_court.id}",
            json=update_data
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_update_court_as_regular_user(self, client, auth_headers, test_court):
        """Test updating a court as non-admin user"""
        update_data = {"name": "Updated Name"}
        
        response = client.put(
            f"/api/courts/{test_court.id}",
            json=update_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestDeleteCourt:
    """Tests for deleting a court"""
    
    def test_delete_court_success(self, client, admin_headers, test_court):
        """Test deleting a court as admin"""
        response = client.delete(
            f"/api/courts/{test_court.id}",
            headers=admin_headers
        )
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify court is deleted
        get_response = client.get(f"/api/courts/{test_court.id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_court_not_found(self, client, admin_headers):
        """Test deleting a non-existent court"""
        response = client.delete(
            "/api/courts/nonexistent-id",
            headers=admin_headers
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_court_without_auth(self, client, test_court):
        """Test deleting a court without authentication"""
        response = client.delete(f"/api/courts/{test_court.id}")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_delete_court_as_regular_user(self, client, auth_headers, test_court):
        """Test deleting a court as non-admin user"""
        response = client.delete(
            f"/api/courts/{test_court.id}",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
