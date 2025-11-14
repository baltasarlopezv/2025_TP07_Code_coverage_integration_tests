"""
Unit tests for main app initialization
Tests isolated app configuration with mocks, NO real server startup
"""
import pytest
from unittest.mock import Mock, patch
from fastapi import FastAPI


class TestAppConfiguration:
    """Test FastAPI app configuration"""
    
    def test_app_is_fastapi_instance(self):
        """Test that app is a FastAPI instance"""
        from app.main import app
        
        assert isinstance(app, FastAPI)
        assert app.title == "Courts Reservation API"
    
    def test_app_has_routes(self):
        """Test that app has registered routes"""
        from app.main import app
        
        # Check that routes are registered
        routes = [route.path for route in app.routes]
        
        # Should have at least API routes
        assert len(routes) > 0
    
    def test_app_version(self):
        """Test app version is set"""
        from app.main import app
        
        assert app.version == "1.0.0"
