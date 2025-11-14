"""
Unit tests for database utilities
Tests isolated functions with mocks, NO real database connections
"""
import pytest
from unittest.mock import Mock, patch
from app.database import get_db


class TestDatabaseSession:
    """Test database session management"""
    
    def test_get_db_yields_session(self):
        """Test that get_db yields a database session"""
        with patch('app.database.SessionLocal') as mock_session_class:
            mock_session = Mock()
            mock_session_class.return_value = mock_session
            
            # Use the generator
            db_gen = get_db()
            db = next(db_gen)
            
            # Should yield the mocked session object
            assert db == mock_session
            
            # Clean up
            try:
                next(db_gen)
            except StopIteration:
                pass  # Expected behavior
    
    def test_get_db_closes_session(self):
        """Test that get_db closes session after use"""
        with patch('app.database.SessionLocal') as mock_session_class:
            mock_session = Mock()
            mock_session_class.return_value = mock_session
            
            # Use the generator
            db_gen = get_db()
            next(db_gen)
            
            # Trigger cleanup
            try:
                next(db_gen)
            except StopIteration:
                pass
            
            # Verify close was called
            mock_session.close.assert_called_once()
