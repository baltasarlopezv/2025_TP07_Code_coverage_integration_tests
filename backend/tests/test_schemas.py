"""
Unit tests for models and schemas
Tests model creation and validation with mocks, NO database
"""
import pytest
from datetime import datetime
from pydantic import ValidationError
from app import schemas


class TestUserSchemas:
    """Test user schema validation"""
    
    def test_user_create_valid(self):
        """Test creating user with valid data"""
        user_data = {
            "email": "test@example.com",
            "password": "password123",
            "first_name": "Test",
            "last_name": "User",
            "phone": "+1234567890"
        }
        
        user = schemas.UserCreate(**user_data)
        
        assert user.email == "test@example.com"
        assert user.password == "password123"
        assert user.first_name == "Test"
    
    def test_user_create_invalid_email(self):
        """Test user creation fails with invalid email"""
        with pytest.raises(ValidationError):
            schemas.UserCreate(
                email="invalid-email",
                password="password123",
                first_name="Test",
                last_name="User"
            )


class TestCourtSchemas:
    """Test court schema validation"""
    
    def test_court_create_valid(self):
        """Test creating court with valid data"""
        court_data = {
            "name": "Test Court",
            "sport_id": "sport-123",
            "location": "Test Location",
            "price_per_hour": 100.0,
            "capacity": 10
        }
        
        court = schemas.CourtCreate(**court_data)
        
        assert court.name == "Test Court"
        assert court.price_per_hour == 100.0
        assert court.capacity == 10
    
    def test_court_create_negative_price(self):
        """Test court creation fails with negative price"""
        with pytest.raises(ValidationError):
            schemas.CourtCreate(
                name="Test Court",
                sport_id="sport-123",
                location="Test Location",
                price_per_hour=-50.0,
                capacity=10
            )


class TestReservationSchemas:
    """Test reservation schema validation"""
    
    def test_reservation_create_valid(self):
        """Test creating reservation with valid data"""
        reservation_data = {
            "court_id": "court-123",
            "date": datetime(2025, 12, 1),
            "start_time": datetime(2025, 12, 1, 14, 0),
            "end_time": datetime(2025, 12, 1, 15, 0),
            "notes": "Test reservation"
        }
        
        reservation = schemas.ReservationCreate(**reservation_data)
        
        assert reservation.court_id == "court-123"
        assert reservation.notes == "Test reservation"
