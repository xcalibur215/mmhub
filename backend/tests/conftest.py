import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from core.config import settings
from db.base import Base
from db.session import get_db
from main import app

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


# Override the database dependency
app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session")
def db():
    """Create test database and tables."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def test_db():
    """Create a clean database session for each test."""
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="session")
def client():
    """Create test client."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def test_user_data():
    """Sample user data for testing."""
    return {
        "email": "testuser@example.com",
        "username": "testuser",
        "password": "testpassword123",
        "first_name": "Test",
        "last_name": "User",
        "phone": "+1234567890",
    }


@pytest.fixture
def test_property_data():
    """Sample property data for testing."""
    return {
        "title": "Test Property",
        "description": "A beautiful test property",
        "property_type": "apartment",
        "address": "123 Test Street",
        "city": "Test City",
        "state": "TS",
        "postal_code": "12345",
        "country": "US",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "bedrooms": 2,
        "bathrooms": 1.5,
        "square_feet": 1000,
        "rent_price": 2500.00,
        "is_furnished": False,
        "pets_allowed": True,
        "parking_available": True,
        "utilities_included": False,
    }
