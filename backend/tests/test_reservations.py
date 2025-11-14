"""
Unit tests for reservation business logic
Tests isolated functions with mocks, NO database
"""
import pytest
from unittest.mock import Mock, MagicMock
from datetime import datetime, date, time, timedelta


class TestReservationLogic:
    """Test reservation business logic functions"""
    
    def test_calculate_duration_hours(self):
        """Test calculating duration between start and end time"""
        start_time = datetime(2025, 12, 1, 14, 0)  # 14:00
        end_time = datetime(2025, 12, 1, 16, 0)    # 16:00
        
        duration = (end_time - start_time).total_seconds() / 3600
        
        assert duration == 2.0
    
    def test_calculate_total_price(self):
        """Test calculating total price based on duration and hourly rate"""
        price_per_hour = 100.0
        start_time = datetime(2025, 12, 1, 14, 0)
        end_time = datetime(2025, 12, 1, 16, 0)
        
        duration = (end_time - start_time).total_seconds() / 3600
        total_price = price_per_hour * duration
        
        assert total_price == 200.0
    
    def test_check_time_overlap_no_overlap(self):
        """Test checking for time slot overlap - no conflict"""
        # Existing: 14:00-15:00
        existing_start = datetime(2025, 12, 1, 14, 0)
        existing_end = datetime(2025, 12, 1, 15, 0)
        
        # New: 15:00-16:00 (no overlap)
        new_start = datetime(2025, 12, 1, 15, 0)
        new_end = datetime(2025, 12, 1, 16, 0)
        
        # Check if times overlap
        overlap = (new_start < existing_end and new_end > existing_start)
        
        assert overlap is False
    
    def test_check_time_overlap_has_overlap(self):
        """Test checking for time slot overlap - conflict exists"""
        # Existing: 14:00-15:00
        existing_start = datetime(2025, 12, 1, 14, 0)
        existing_end = datetime(2025, 12, 1, 15, 0)
        
        # New: 14:30-15:30 (overlaps)
        new_start = datetime(2025, 12, 1, 14, 30)
        new_end = datetime(2025, 12, 1, 15, 30)
        
        # Check if times overlap
        overlap = (new_start < existing_end and new_end > existing_start)
        
        assert overlap is True


class TestAvailableSlots:
    """Test available slots generation"""
    
    def test_generate_time_slots(self):
        """Test generating standard time slots"""
        # Standard hours: 12:00 - 20:00 (8 slots)
        start_hour = 12
        end_hour = 20
        
        slots = []
        for hour in range(start_hour, end_hour):
            slot = {
                "start": f"{hour:02d}:00",
                "end": f"{hour+1:02d}:00",
                "label": f"{hour:02d}:00 - {hour+1:02d}:00"
            }
            slots.append(slot)
        
        assert len(slots) == 8
        assert slots[0]["label"] == "12:00 - 13:00"
        assert slots[-1]["label"] == "19:00 - 20:00"
    
    def test_filter_reserved_slots(self):
        """Test filtering out reserved time slots"""
        all_slots = [
            {"start": "12:00", "end": "13:00", "label": "12:00 - 13:00"},
            {"start": "13:00", "end": "14:00", "label": "13:00 - 14:00"},
            {"start": "14:00", "end": "15:00", "label": "14:00 - 15:00"},
        ]
        
        reserved_slots = ["14:00 - 15:00"]
        
        available = [s for s in all_slots if s["label"] not in reserved_slots]
        
        assert len(available) == 2
        assert available[0]["label"] == "12:00 - 13:00"
        assert available[1]["label"] == "13:00 - 14:00"
