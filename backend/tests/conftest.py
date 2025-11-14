"""
Pytest configuration and fixtures for testing
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app import models
from app.auth import get_password_hash, create_access_token


# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database for each test"""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with dependency override"""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db_session):
    """Create a test user"""
    user = models.User(
        id="test-user-123",
        email="test@example.com",
        hashed_password=get_password_hash("testpassword"),
        first_name="Test",
        last_name="User",
        phone="+1234567890",
        role=models.UserRole.USER
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_admin(db_session):
    """Create a test admin user"""
    admin = models.User(
        id="admin-user-123",
        email="admin@example.com",
        hashed_password=get_password_hash("adminpassword"),
        first_name="Admin",
        last_name="User",
        phone="+9876543210",
        role=models.UserRole.ADMIN
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    return admin


@pytest.fixture
def auth_token(test_user):
    """Generate authentication token for test user"""
    return create_access_token(data={"sub": test_user.id})


@pytest.fixture
def admin_token(test_admin):
    """Generate authentication token for admin user"""
    return create_access_token(data={"sub": test_admin.id})


@pytest.fixture
def auth_headers(auth_token):
    """Create authorization headers with token"""
    return {"Authorization": f"Bearer {auth_token}"}


@pytest.fixture
def admin_headers(admin_token):
    """Create authorization headers with admin token"""
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture
def test_sport(db_session):
    """Create a test sport"""
    sport = models.Sport(
        id="sport-123",
        name="Football",
        description="Football sport"
    )
    db_session.add(sport)
    db_session.commit()
    db_session.refresh(sport)
    return sport


@pytest.fixture
def test_court(db_session, test_sport):
    """Create a test court"""
    court = models.Court(
        id="court-123",
        name="Court 1",
        sport_id=test_sport.id,
        location="Test Location",
        price_per_hour=100.0,
        capacity=10,
        is_active=True
    )
    db_session.add(court)
    db_session.commit()
    db_session.refresh(court)
    return court


@pytest.fixture
def test_reservation(db_session, test_user, test_court):
    """Create a test reservation"""
    from datetime import datetime
    reservation = models.Reservation(
        id="reservation-123",
        user_id=test_user.id,
        court_id=test_court.id,
        date=datetime.strptime("2025-12-01", "%Y-%m-%d"),
        start_time=datetime.strptime("2025-12-01 14:00", "%Y-%m-%d %H:%M"),
        end_time=datetime.strptime("2025-12-01 15:00", "%Y-%m-%d %H:%M"),
        total_price=100.0,
        status=models.ReservationStatus.CONFIRMED
    )
    db_session.add(reservation)
    db_session.commit()
    db_session.refresh(reservation)
    return reservation
