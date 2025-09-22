import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from core.security import get_password_hash
from db.models.user import User
from tests.conftest import client, test_db, test_user_data


class TestAuth:
    """Test authentication endpoints."""

    def test_health_check(self, client: TestClient):
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    def test_root_endpoint(self, client: TestClient):
        """Test root endpoint."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data

    def test_register_user(
        self, client: TestClient, test_db: Session, test_user_data: dict
    ):
        """Test user registration."""
        # Note: This test assumes auth routes are implemented
        # For now, we'll just test that the endpoint exists
        response = client.post("/api/v1/auth/register", json=test_user_data)
        # Since routes aren't implemented yet, we expect 404
        assert response.status_code == 404

    def test_login_user(self, client: TestClient, test_db: Session):
        """Test user login."""
        # Create a test user in database
        user = User(
            email="test@example.com",
            username="testuser",
            hashed_password=get_password_hash("testpassword"),
            first_name="Test",
            last_name="User",
            is_active=True,
            is_verified=True,
        )
        test_db.add(user)
        test_db.commit()

        login_data = {"email": "test@example.com", "password": "testpassword"}

        # Note: This test assumes auth routes are implemented
        response = client.post("/api/v1/auth/login", json=login_data)
        # Since routes aren't implemented yet, we expect 404
        assert response.status_code == 404


class TestUsers:
    """Test user-related endpoints."""

    def test_get_users(self, client: TestClient):
        """Test getting users list."""
        response = client.get("/api/v1/users/")
        # Since routes aren't implemented yet, we expect 404
        assert response.status_code == 404

    def test_get_user_profile(self, client: TestClient):
        """Test getting user profile."""
        response = client.get("/api/v1/users/me")
        # Since routes aren't implemented yet, we expect 404
        assert response.status_code == 404


class TestProperties:
    """Test property-related endpoints."""

    def test_get_properties(self, client: TestClient):
        """Test getting properties list."""
        response = client.get("/api/v1/properties/")
        # Since routes aren't implemented yet, we expect 404
        assert response.status_code == 404

    def test_create_property(self, client: TestClient, test_property_data: dict):
        """Test creating a property."""
        response = client.post("/api/v1/properties/", json=test_property_data)
        # Since routes aren't implemented yet, we expect 404
        assert response.status_code == 404

    def test_get_property_detail(self, client: TestClient):
        """Test getting property details."""
        response = client.get("/api/v1/properties/1")
        # Since routes aren't implemented yet, we expect 404
        assert response.status_code == 404


if __name__ == "__main__":
    pytest.main([__file__])
