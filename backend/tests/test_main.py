"""
Tests for main application endpoints
"""
import pytest
from fastapi import status


def test_root_endpoint(client):
    """Test root endpoint returns correct message"""
    response = client.get("/")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["message"] == "Courts Reservation API"
    assert data["version"] == "1.0.0"
    assert data["docs"] == "/docs"
    assert data["redoc"] == "/redoc"


def test_health_check(client):
    """Test health check endpoint"""
    response = client.get("/health")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "healthy"


def test_openapi_docs_available(client):
    """Test that OpenAPI documentation is accessible"""
    response = client.get("/docs")
    assert response.status_code == status.HTTP_200_OK


def test_redoc_available(client):
    """Test that ReDoc documentation is accessible"""
    response = client.get("/redoc")
    assert response.status_code == status.HTTP_200_OK
