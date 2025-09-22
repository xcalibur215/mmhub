#!/usr/bin/env python3
"""
Sample data generator for MM Hub Real Estate Platform.
This script generates 100 realistic property listings with associated data.
"""

import os
import random
import sys
from datetime import datetime

from faker import Faker
from sqlalchemy.orm import Session

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.security import get_password_hash
from db.base import SessionLocal
from db.models import Amenity, Property, PropertyAmenity, PropertyPhoto, User
from db.models.property import PropertyStatus, PropertyType
from db.models.user import UserRole, UserStatus

fake = Faker()

# Real estate-specific data
CITIES_COORDS = {
    # Major US Cities with (lat, lon)
    "New York": (40.7128, -74.0060),
    "Los Angeles": (34.0522, -118.2437),
    "Chicago": (41.8781, -87.6298),
    "Houston": (29.7604, -95.3698),
    "Phoenix": (33.4484, -112.0740),
    "Philadelphia": (39.9526, -75.1652),
    "San Antonio": (29.4241, -98.4936),
    "San Diego": (32.7157, -117.1611),
    "Dallas": (32.7767, -96.7970),
    "San Jose": (37.3382, -121.8863),
    "Austin": (30.2672, -97.7431),
    "Jacksonville": (30.3322, -81.6557),
    "Fort Worth": (32.7555, -97.3308),
    "Columbus": (39.9612, -82.9988),
    "Charlotte": (35.2271, -80.8431),
    "San Francisco": (37.7749, -122.4194),
    "Indianapolis": (39.7684, -86.1581),
    "Seattle": (47.6062, -122.3321),
    "Denver": (39.7392, -104.9903),
    "Boston": (42.3601, -71.0589),
    "El Paso": (31.7619, -106.4850),
    "Detroit": (42.3314, -83.0458),
    "Nashville": (36.1627, -86.7816),
    "Portland": (45.5152, -122.6784),
    "Memphis": (35.1495, -90.0490),
    "Oklahoma City": (35.4676, -97.5164),
    "Las Vegas": (36.1699, -115.1398),
    "Louisville": (38.2527, -85.7585),
    "Baltimore": (39.2904, -76.6122),
    "Milwaukee": (43.0389, -87.9065),
}

STATES = {
    "New York": "NY",
    "Los Angeles": "CA",
    "Chicago": "IL",
    "Houston": "TX",
    "Phoenix": "AZ",
    "Philadelphia": "PA",
    "San Antonio": "TX",
    "San Diego": "CA",
    "Dallas": "TX",
    "San Jose": "CA",
    "Austin": "TX",
    "Jacksonville": "FL",
    "Fort Worth": "TX",
    "Columbus": "OH",
    "Charlotte": "NC",
    "San Francisco": "CA",
    "Indianapolis": "IN",
    "Seattle": "WA",
    "Denver": "CO",
    "Boston": "MA",
    "El Paso": "TX",
    "Detroit": "MI",
    "Nashville": "TN",
    "Portland": "OR",
    "Memphis": "TN",
    "Oklahoma City": "OK",
    "Las Vegas": "NV",
    "Louisville": "KY",
    "Baltimore": "MD",
    "Milwaukee": "WI",
}

AMENITIES_DATA = [
    ("Air Conditioning", "Central air conditioning system", "❄️", "comfort"),
    ("In-Unit Laundry", "Washer and dryer in unit", "🧺", "laundry"),
    ("Parking", "Dedicated parking space", "🚗", "parking"),
    ("Balcony", "Private balcony or patio", "🏠", "outdoor"),
    ("Swimming Pool", "Access to swimming pool", "🏊", "recreation"),
    ("Gym/Fitness Center", "On-site fitness facilities", "💪", "recreation"),
    ("Pet Friendly", "Pets allowed", "🐕", "policy"),
    ("Microwave", "Built-in microwave", "📱", "kitchen"),
    ("Closet", "Spacious closet", "👗", "storage"),
    ("Fireplace", "Wood or gas fireplace", "🔥", "comfort"),
    (
        "Stainless Steel Appliances",
        "Modern stainless steel appliances",
        "✨",
        "kitchen",
    ),
    ("Granite Countertops", "Premium granite countertops", "💎", "kitchen"),
    ("High Ceilings", "9+ foot ceilings", "⬆️", "architecture"),
    (
        "Floor-to-Ceiling Windows",
        "Large windows with natural light",
        "🪟",
        "architecture",
    ),
    ("Elevator", "Elevator access", "🛗", "building"),
    ("Storage Unit", "Additional storage space", "📦", "storage"),
    ("Garden/Yard", "Private or shared garden space", "🌻", "outdoor"),
    ("Near Public Transit", "Close to public transportation", "🚊", "location"),
    ("Doorman", "24-hour doorman service", "👨‍💼", "service"),
    ("WiFi", "High-speed internet connection", "📶", "technology"),
    ("Working desk", "Dedicated workspace with desk", "🏢", "workspace"),
    ("Recently Renovated", "Recently updated and renovated", "🔨", "condition"),
    ("Bike Storage", "Secure bike storage", "🚲", "storage"),
    ("Business Center", "On-site business center", "💼", "amenity"),
    ("Package Service", "Package receiving service", "📦", "service"),
    ("Wheelchair Accessible", "ADA compliant", "♿", "accessibility"),
    ("Utilities Included", "Some utilities included in rent", "⚡", "financial"),
    ("Short-term Lease Available", "Flexible lease terms", "📅", "policy"),
]

PROPERTY_DESCRIPTIONS = [
    "Stunning modern apartment with breathtaking city views and premium finishes throughout.",
    "Charming historic home with original details and modern updates in desirable neighborhood.",
    "Spacious family home with open floor plan and large backyard perfect for entertaining.",
    "Luxury high-rise condo with resort-style amenities and panoramic views.",
    "Cozy townhouse with private patio in quiet residential area close to parks and schools.",
    "Contemporary loft with exposed brick, high ceilings, and industrial charm.",
    "Beautifully renovated Victorian home with period details and modern conveniences.",
    "Brand new construction with smart home features and energy-efficient appliances.",
    "Elegant apartment in pre-war building with classic architectural details.",
    "Modern studio with efficient layout and premium amenities in vibrant neighborhood.",
]


def create_sample_users(db: Session, count: int = 25) -> list:
    """Create sample users with different roles."""
    users = []

    # Create admin user
    admin_user = User(
        email="admin@mmhub.com",
        username="admin",
        hashed_password=get_password_hash("admin123"),
        first_name="Admin",
        last_name="User",
        role=UserRole.ADMIN,
        status=UserStatus.ACTIVE,
        is_verified=True,
        is_active=True,
        created_at=datetime.utcnow(),
    )
    db.add(admin_user)
    users.append(admin_user)

    # Create landlords and agents
    for i in range(count):
        role = random.choice([UserRole.LANDLORD, UserRole.AGENT, UserRole.USER])

        user = User(
            email=fake.email(),
            username=fake.user_name(),
            hashed_password=get_password_hash("password123"),
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            phone=fake.phone_number(),
            role=role,
            status=UserStatus.ACTIVE,
            bio=fake.text(max_nb_chars=200) if random.random() > 0.3 else None,
            is_verified=random.choice([True, False]),
            is_active=True,
            created_at=fake.date_time_between(start_date="-2y", end_date="now"),
        )
        db.add(user)
        users.append(user)

    db.commit()
    return users


def create_amenities(db: Session) -> list:
    """Create standard amenities."""
    amenities = []

    for name, description, icon, category in AMENITIES_DATA:
        amenity = Amenity(
            name=name,
            description=description,
            icon=icon,
            category=category,
            is_active=True,
        )
        db.add(amenity)
        amenities.append(amenity)

    db.commit()
    return amenities


def create_sample_properties(
    db: Session, users: list, amenities: list, count: int = 100
) -> list:
    """Create sample properties."""
    properties = []

    # Filter users who can own properties (landlords, agents, admin)
    property_owners = [
        u
        for u in users
        if u.role in [UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN]
    ]

    for i in range(count):
        city = random.choice(list(CITIES_COORDS.keys()))
        lat, lon = CITIES_COORDS[city]
        state = STATES[city]

        # Add some random variation to coordinates
        lat += random.uniform(-0.1, 0.1)
        lon += random.uniform(-0.1, 0.1)

        property_type = random.choice(list(PropertyType))

        # Adjust property details based on type
        if property_type == PropertyType.STUDIO:
            bedrooms = 0
            bathrooms = 1
            sq_ft = random.randint(300, 600)
        elif property_type == PropertyType.ROOM:
            bedrooms = 1
            bathrooms = 1
            sq_ft = random.randint(100, 300)
        elif property_type == PropertyType.APARTMENT:
            bedrooms = random.randint(1, 4)
            bathrooms = random.choice([1, 1.5, 2, 2.5, 3])
            sq_ft = random.randint(500, 2000)
        elif property_type == PropertyType.HOUSE:
            bedrooms = random.randint(2, 6)
            bathrooms = random.choice([1.5, 2, 2.5, 3, 3.5, 4])
            sq_ft = random.randint(1000, 4000)
        else:  # CONDO, TOWNHOUSE, COMMERCIAL
            bedrooms = random.randint(1, 4)
            bathrooms = random.choice([1, 1.5, 2, 2.5, 3])
            sq_ft = random.randint(700, 3000)

        # Calculate rent based on location and size
        base_rent = sq_ft * random.uniform(1.5, 4.0)
        if city in ["San Francisco", "New York", "San Jose"]:
            base_rent *= random.uniform(1.5, 2.5)
        elif city in ["Los Angeles", "Seattle", "Boston"]:
            base_rent *= random.uniform(1.2, 1.8)

        rent_price = round(base_rent, 2)

        property_obj = Property(
            title=f"{random.choice(['Beautiful', 'Stunning', 'Modern', 'Spacious', 'Cozy', 'Luxury'])} "
            f"{bedrooms if bedrooms > 0 else 'Studio'} "
            f"{'Bed' if bedrooms == 1 else 'Bedroom' if bedrooms > 1 else ''} "
            f"{property_type.value.title()} in {city}".strip(),
            description=random.choice(PROPERTY_DESCRIPTIONS),
            property_type=property_type,
            status=(
                random.choice([PropertyStatus.AVAILABLE, PropertyStatus.RENTED])
                if random.random() > 0.1
                else PropertyStatus.AVAILABLE
            ),
            address=fake.street_address(),
            city=city,
            state=state,
            postal_code=fake.zipcode(),
            country="US",
            latitude=lat,
            longitude=lon,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            square_feet=sq_ft,
            lot_size=(
                random.randint(1000, 10000)
                if property_type == PropertyType.HOUSE
                else None
            ),
            year_built=random.randint(1950, 2024),
            floor_number=(
                random.randint(1, 20)
                if property_type in [PropertyType.APARTMENT, PropertyType.CONDO]
                else None
            ),
            total_floors=(
                random.randint(1, 30)
                if property_type in [PropertyType.APARTMENT, PropertyType.CONDO]
                else None
            ),
            rent_price=rent_price,
            security_deposit=rent_price * random.uniform(0.5, 2.0),
            is_furnished=random.choice([True, False]),
            pets_allowed=random.choice([True, False]),
            smoking_allowed=random.choice([True, False]),
            parking_available=random.choice([True, False]),
            utilities_included=random.choice([True, False]),
            min_lease_term=random.choice([1, 3, 6, 12]),
            max_lease_term=random.choice([12, 24, 36]),
            available_from=fake.date_between(start_date="today", end_date="+6m"),
            views_count=random.randint(0, 500),
            is_featured=random.random() < 0.1,  # 10% featured
            is_active=True,
            created_at=fake.date_time_between(start_date="-1y", end_date="now"),
            owner_id=random.choice(property_owners).id,
        )

        db.add(property_obj)
        properties.append(property_obj)

    db.commit()
    return properties


def create_property_photos(db: Session, properties: list):
    """Create sample property photos."""
    photo_urls = [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9",
        "https://images.unsplash.com/photo-1567496898669-ee935f5f647a",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    ]

    for property_obj in properties:
        # Each property gets 2-8 photos
        num_photos = random.randint(2, 8)

        for i in range(num_photos):
            photo = PropertyPhoto(
                property_id=property_obj.id,
                url=f"{random.choice(photo_urls)}?w=800&h=600&fit=crop&auto=format",
                alt_text=f"Photo of {property_obj.title}",
                caption=f"Interior view {i+1}" if i > 0 else "Main view",
                display_order=i,
                is_primary=(i == 0),
                width=800,
                height=600,
                created_at=datetime.utcnow(),
            )
            db.add(photo)

    db.commit()


def create_property_amenities(db: Session, properties: list, amenities: list):
    """Create property-amenity associations."""
    for property_obj in properties:
        # Each property gets 3-12 random amenities
        num_amenities = random.randint(3, 12)
        selected_amenities = random.sample(amenities, num_amenities)

        for amenity in selected_amenities:
            property_amenity = PropertyAmenity(
                property_id=property_obj.id, amenity_id=amenity.id
            )
            db.add(property_amenity)

    db.commit()


def main():
    """Generate all sample data."""
    db = SessionLocal()

    try:
        print("🏠 Generating MM Hub sample data...")

        print("👥 Creating users...")
        users = create_sample_users(db, 25)
        print(f"✅ Created {len(users)} users")

        print("🏷️ Creating amenities...")
        amenities = create_amenities(db)
        print(f"✅ Created {len(amenities)} amenities")

        print("🏘️ Creating properties...")
        properties = create_sample_properties(db, users, amenities, 100)
        print(f"✅ Created {len(properties)} properties")

        print("📸 Creating property photos...")
        create_property_photos(db, properties)
        print("✅ Created property photos")

        print("🔗 Creating property amenities...")
        create_property_amenities(db, properties, amenities)
        print("✅ Created property amenities")

        print("🎉 Sample data generation complete!")
        print(f"📊 Summary:")
        print(
            f"   - {len(users)} users (1 admin, {len([u for u in users if u.role == UserRole.LANDLORD])} landlords, {len([u for u in users if u.role == UserRole.AGENT])} agents)"
        )
        print(f"   - {len(amenities)} amenities")
        print(f"   - {len(properties)} properties across {len(CITIES_COORDS)} cities")
        print("   - Property photos and amenity associations")

        print("\n🔑 Admin credentials:")
        print("   Email: admin@mmhub.com")
        print("   Password: admin123")

    except Exception as e:
        print(f"❌ Error generating sample data: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
