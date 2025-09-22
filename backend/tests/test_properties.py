import pytest
from sqlalchemy.orm import Session

from tests.conftest import test_db
from db.models.property import Property, PropertyType, PropertyStatus
from db.models.user import User, UserRole
from core.security import get_password_hash


class TestPropertyModel:
    """Test Property model operations."""
    
    def test_create_property(self, test_db: Session):
        """Test creating a property."""
        # First create a user to own the property
        user = User(
            email="owner@example.com",
            username="owner",
            hashed_password=get_password_hash("password"),
            first_name="Property",
            last_name="Owner",
            role=UserRole.LANDLORD,
            is_active=True
        )
        test_db.add(user)
        test_db.commit()
        
        # Create property
        property_obj = Property(
            title="Test Property",
            description="A test property",
            property_type=PropertyType.APARTMENT,
            address="123 Test St",
            city="Test City",
            state="TS",
            postal_code="12345",
            country="US",
            latitude=40.7128,
            longitude=-74.0060,
            bedrooms=2,
            bathrooms=1.5,
            square_feet=1000,
            rent_price=2500.00,
            owner_id=user.id
        )
        
        test_db.add(property_obj)
        test_db.commit()
        
        # Verify property was created
        assert property_obj.id is not None
        assert property_obj.title == "Test Property"
        assert property_obj.status == PropertyStatus.AVAILABLE
        assert property_obj.is_active is True
        assert property_obj.owner_id == user.id
    
    def test_property_relationships(self, test_db: Session):
        """Test property relationships with user."""
        # Create user
        user = User(
            email="landlord@example.com",
            username="landlord",
            hashed_password=get_password_hash("password"),
            first_name="Land",
            last_name="Lord",
            role=UserRole.LANDLORD,
            is_active=True
        )
        test_db.add(user)
        test_db.commit()
        
        # Create property
        property_obj = Property(
            title="Relationship Test Property",
            property_type=PropertyType.HOUSE,
            address="456 Test Ave",
            city="Test City",
            state="TS",
            postal_code="12345",
            bedrooms=3,
            bathrooms=2,
            rent_price=3000.00,
            owner_id=user.id
        )
        test_db.add(property_obj)
        test_db.commit()
        
        # Test relationship
        assert property_obj.owner.id == user.id
        assert property_obj.owner.username == "landlord"
        assert len(user.properties) == 1
        assert user.properties[0].title == "Relationship Test Property"


class TestUserModel:
    """Test User model operations."""
    
    def test_create_user(self, test_db: Session):
        """Test creating a user."""
        user = User(
            email="newuser@example.com",
            username="newuser",
            hashed_password=get_password_hash("securepassword"),
            first_name="New",
            last_name="User",
            phone="+1234567890",
            role=UserRole.USER,
            is_active=True,
            is_verified=False
        )
        
        test_db.add(user)
        test_db.commit()
        
        # Verify user was created
        assert user.id is not None
        assert user.email == "newuser@example.com"
        assert user.role == UserRole.USER
        assert user.is_active is True
        assert user.is_verified is False
    
    def test_user_unique_constraints(self, test_db: Session):
        """Test user unique constraints."""
        # Create first user
        user1 = User(
            email="unique@example.com",
            username="uniqueuser",
            hashed_password=get_password_hash("password"),
            first_name="First",
            last_name="User",
            is_active=True
        )
        test_db.add(user1)
        test_db.commit()
        
        # Try to create second user with same email
        user2 = User(
            email="unique@example.com",  # Same email
            username="differentuser",
            hashed_password=get_password_hash("password"),
            first_name="Second",
            last_name="User",
            is_active=True
        )
        test_db.add(user2)
        
        # This should raise an integrity error
        with pytest.raises(Exception):
            test_db.commit()


if __name__ == "__main__":
    pytest.main([__file__])