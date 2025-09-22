#!/usr/bin/env python3
"""
Complete database setup script for MM Hub
Creates all tables and populates with comprehensive sample data
"""

import os
import random
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.append(str(backend_dir))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from core.config import settings
from core.security import get_password_hash
from db.base import Base
from db.models.amenity import Amenity
from db.models.property import Property, PropertyStatus, PropertyType
from db.models.property_amenity import PropertyAmenity
from db.models.property_photo import PropertyPhoto
from db.models.user import User, UserRole, UserStatus

# Thailand locations (from previous implementation)
THAILAND_LOCATIONS = [
    "Bangkok",
    "Sukhumvit",
    "Silom",
    "Sathorn",
    "Asoke",
    "Phrom Phong",
    "Thong Lo",
    "Ekkamai",
    "Ari",
    "Saphan Phut",
    "Chatuchak",
    "Lat Phrao",
    "Huai Khwang",
    "Din Daeng",
    "Ratchathewi",
    "Pathum Wan",
    "Bang Rak",
    "Yannawa",
    "Khlong Toei",
    "Watthana",
    "Vadhana",
    "Dusit",
    "Phra Nakhon",
    "Samphanthawong",
    "Bang Kho Laem",
    "Yan Nawa",
    "Bang Sue",
    "Phaya Thai",
    "Ratchathewi",
    "Huai Khwang",
    "Din Daeng",
    "Bueng Kum",
    "Saphan Phut",
    "Pom Prap Sattru Phai",
    "Nong Chok",
    "Bang Khae",
    "Lak Si",
    "Sai Mai",
    "Khan Na Yao",
    "Saphan Sung",
    "Wang Thonglang",
    "Bang Kapi",
    "Pravej",
    "Lat Krabang",
    "Min Buri",
    "Nong Chok",
    "Chiang Mai",
    "Phuket",
    "Pattaya",
]

# Property amenities
AMENITIES_DATA = [
    ("Air Conditioning", "Central air conditioning system", "❄️"),
    ("WiFi", "High-speed internet connection", "📶"),
    ("Working desk", "Dedicated workspace with desk", "🏢"),
    ("In-Unit Laundry", "Washer and dryer in unit", "🧺"),
    ("Parking", "Dedicated parking space", "🚗"),
    ("Balcony", "Private balcony or patio", "🏠"),
    ("Swimming Pool", "Access to swimming pool", "🏊"),
    ("Gym/Fitness Center", "On-site fitness facilities", "💪"),
    ("Pet Friendly", "Pets allowed", "🐕"),
    ("Microwave", "Built-in microwave", "📱"),
    ("Closet", "Spacious closet", "👗"),
    ("Fireplace", "Wood or gas fireplace", "🔥"),
    ("Stainless Steel Appliances", "Modern stainless steel appliances", "✨"),
    ("Granite Countertops", "Premium granite countertops", "💎"),
    ("High Ceilings", "9+ foot ceilings", "⬆️"),
    ("Floor-to-Ceiling Windows", "Large windows with natural light", "🪟"),
    ("Elevator", "Elevator access", "🛗"),
    ("Storage Unit", "Additional storage space", "📦"),
    ("Garden/Yard", "Private or shared garden space", "🌻"),
    ("Near Public Transit", "Close to public transportation", "🚊"),
    ("Doorman", "24-hour doorman service", "👨‍💼"),
]

# Sample property descriptions
PROPERTY_DESCRIPTIONS = [
    "Modern and spacious {} in the heart of {}. Features high-end finishes and premium amenities.",
    "Beautiful {} located in desirable {} area. Perfect for professionals seeking comfort and convenience.",
    "Luxurious {} in prime {} location. Enjoy city living with all the amenities you need.",
    "Newly renovated {} in {}. Contemporary design meets functional living in this stunning property.",
    "Charming {} in vibrant {} neighborhood. Close to restaurants, shopping, and entertainment.",
    "Elegant {} in prestigious {} area. High-end finishes and top-tier amenities throughout.",
    "Contemporary {} in bustling {} district. Perfect blend of style and functionality.",
    "Stylish {} in popular {} location. Modern amenities and excellent connectivity to the city.",
]


class DatabaseSetup:
    def __init__(self):
        # Create engine and session
        self.engine = create_engine(settings.DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        self.session = SessionLocal()

    def create_tables(self):
        """Create all database tables"""
        print("Creating database tables...")
        Base.metadata.create_all(bind=self.engine)
        print("✓ Tables created successfully")

    def create_amenities(self):
        """Create amenities"""
        print("Creating amenities...")
        existing = {name for (name,) in self.session.query(Amenity.name).all()}
        created = 0
        for name, description, icon in AMENITIES_DATA:
            if name in existing:
                continue
            amenity = Amenity(name=name, description=description, icon=icon)
            self.session.add(amenity)
            created += 1
        if created:
            self.session.commit()
        print(
            f"✓ Amenities present: {len(existing) + created} (added {created}, skipped {len(existing)})"
        )

    def create_users(self):
        """Create sample users including admin, landlords, agents, and regular users"""
        print("Creating users...")

        users_data = [
            # Admin user
            {
                "email": "admin@mmhub.com",
                "username": "admin",
                "first_name": "System",
                "last_name": "Administrator",
                "phone": "+66 2 123 0001",
                "role": UserRole.ADMIN,
                "password": "admin123",
                "bio": "System administrator for MM Hub platform",
            },
            # Landlords
            {
                "email": "john.landlord@mmhub.com",
                "username": "johnlandlord",
                "first_name": "John",
                "last_name": "Smith",
                "phone": "+66 2 123 0002",
                "role": UserRole.LANDLORD,
                "password": "landlord123",
                "bio": "Experienced property owner with multiple listings in Bangkok",
            },
            {
                "email": "mary.owner@mmhub.com",
                "username": "maryowner",
                "first_name": "Mary",
                "last_name": "Johnson",
                "phone": "+66 2 123 0003",
                "role": UserRole.LANDLORD,
                "password": "landlord123",
                "bio": "Real estate investor specializing in luxury properties",
            },
            {
                "email": "david.property@mmhub.com",
                "username": "davidproperty",
                "first_name": "David",
                "last_name": "Williams",
                "phone": "+66 2 123 0004",
                "role": UserRole.LANDLORD,
                "password": "landlord123",
                "bio": "Property developer and landlord in Thailand for over 10 years",
            },
            # Agents
            {
                "email": "sarah.agent@mmhub.com",
                "username": "sarahagent",
                "first_name": "Sarah",
                "last_name": "Brown",
                "phone": "+66 2 123 0005",
                "role": UserRole.AGENT,
                "password": "agent123",
                "bio": "Licensed real estate agent with 5+ years experience in Bangkok",
            },
            {
                "email": "mike.broker@mmhub.com",
                "username": "mikebroker",
                "first_name": "Mike",
                "last_name": "Davis",
                "phone": "+66 2 123 0006",
                "role": UserRole.AGENT,
                "password": "agent123",
                "bio": "Real estate broker specializing in commercial and residential properties",
            },
            {
                "email": "lisa.realtor@mmhub.com",
                "username": "lisarealtor",
                "first_name": "Lisa",
                "last_name": "Wilson",
                "phone": "+66 2 123 0007",
                "role": UserRole.AGENT,
                "password": "agent123",
                "bio": "Top-performing agent with expertise in luxury rentals",
            },
            # Regular users
            {
                "email": "alice.user@gmail.com",
                "username": "aliceuser",
                "first_name": "Alice",
                "last_name": "Cooper",
                "phone": "+66 2 123 0008",
                "role": UserRole.USER,
                "password": "user123",
                "bio": "Digital nomad looking for modern apartments in Bangkok",
            },
            {
                "email": "bob.tenant@gmail.com",
                "username": "bobtenant",
                "first_name": "Bob",
                "last_name": "Miller",
                "phone": "+66 2 123 0009",
                "role": UserRole.USER,
                "password": "user123",
                "bio": "Expat professional seeking comfortable housing",
            },
            {
                "email": "charlie.renter@gmail.com",
                "username": "charlierenter",
                "first_name": "Charlie",
                "last_name": "Taylor",
                "phone": "+66 2 123 0010",
                "role": UserRole.USER,
                "password": "user123",
                "bio": "Local resident looking for affordable rental options",
            },
        ]

        existing_emails = {email for (email,) in self.session.query(User.email).all()}
        created = 0
        for user_data in users_data:
            if user_data["email"] in existing_emails:
                continue
            password = user_data.pop("password")
            user = User(
                **user_data,
                hashed_password=get_password_hash(password),
                is_verified=True,
                status=UserStatus.ACTIVE,
            )
            self.session.add(user)
            created += 1
        if created:
            self.session.commit()
        total_users = self.session.query(User).count()
        print(f"✓ Users present: {total_users} (added {created})")

    def create_properties(self):
        """Create sample properties"""
        print("Creating properties...")
        existing_count = self.session.query(Property).count()
        if existing_count > 0:
            print(
                f"✓ Properties already exist ({existing_count}); skipping property generation"
            )
            return

        # Get landlords and agents to assign as property owners
        owners = (
            self.session.query(User)
            .filter(User.role.in_([UserRole.LANDLORD, UserRole.AGENT]))
            .all()
        )

        # Get all amenities
        amenities = self.session.query(Amenity).all()

        property_types = [
            PropertyType.APARTMENT,
            PropertyType.CONDO,
            PropertyType.HOUSE,
            PropertyType.TOWNHOUSE,
            PropertyType.STUDIO,
            PropertyType.ROOM,
        ]

        properties_data = []

        # Create 50 diverse properties
        for i in range(50):
            location = random.choice(THAILAND_LOCATIONS)
            property_type = random.choice(property_types)
            owner = random.choice(owners)

            # Generate realistic pricing based on property type and location
            base_prices = {
                PropertyType.STUDIO: (8000, 25000),
                PropertyType.ROOM: (5000, 15000),
                PropertyType.APARTMENT: (15000, 60000),
                PropertyType.CONDO: (20000, 80000),
                PropertyType.HOUSE: (25000, 120000),
                PropertyType.TOWNHOUSE: (30000, 100000),
            }

            min_price, max_price = base_prices[property_type]
            # Adjust for prime locations
            if location in ["Sukhumvit", "Silom", "Sathorn", "Asoke", "Phrom Phong"]:
                min_price = int(min_price * 1.5)
                max_price = int(max_price * 2)

            rent_price = random.randint(min_price, max_price)

            # Generate property details based on type
            if property_type == PropertyType.STUDIO:
                bedrooms = 0
                bathrooms = 1
                sqft = random.randint(300, 600)
            elif property_type == PropertyType.ROOM:
                bedrooms = 1
                bathrooms = 1
                sqft = random.randint(200, 400)
            else:
                bedrooms = random.randint(1, 5)
                bathrooms = random.randint(1, bedrooms + 1)
                sqft = random.randint(500, 3000)

            # Generate description
            description_template = random.choice(PROPERTY_DESCRIPTIONS)
            description = description_template.format(
                property_type.value.title(), location
            )

            property_data = {
                "title": f"{property_type.value.title()} in {location}",
                "description": description,
                "property_type": property_type.value,
                "status": PropertyStatus.AVAILABLE,
                "address": f"{random.randint(1, 999)} {random.choice(['Sukhumvit', 'Silom', 'Sathorn', 'Phetchaburi'])} Road",
                "city": location,
                "state": "Bangkok",
                "postal_code": f"{random.randint(10000, 11000)}",
                "country": "Thailand",
                "latitude": 13.7563 + random.uniform(-0.1, 0.1),
                "longitude": 100.5018 + random.uniform(-0.1, 0.1),
                "bedrooms": bedrooms,
                "bathrooms": bathrooms,
                "square_feet": sqft,
                "year_built": random.randint(2000, 2024),
                "floor_number": (
                    random.randint(1, 30)
                    if property_type in [PropertyType.APARTMENT, PropertyType.CONDO]
                    else None
                ),
                "rent_price": float(rent_price),
                "security_deposit": float(rent_price * random.choice([1, 2])),
                "is_furnished": random.choice([True, False]),
                "pets_allowed": random.choice([True, False]),
                "smoking_allowed": random.choice([True, False]),
                "parking_available": random.choice([True, False]),
                "utilities_included": random.choice([True, False]),
                "min_lease_term": random.choice([3, 6, 12]),
                "max_lease_term": random.choice([12, 24, 36]),
                "available_from": datetime.utcnow()
                + timedelta(days=random.randint(0, 60)),
                "is_featured": (
                    random.choice([True, False]) if random.random() < 0.3 else False
                ),
                "owner_id": owner.id,
            }

            property = Property(**property_data)
            self.session.add(property)
            self.session.flush()  # Get the ID

            # Add random amenities (3-8 per property)
            num_amenities = random.randint(3, 8)
            selected_amenities = random.sample(
                amenities, min(num_amenities, len(amenities))
            )

            for amenity in selected_amenities:
                property_amenity = PropertyAmenity(
                    property_id=property.id, amenity_id=amenity.id
                )
                self.session.add(property_amenity)

            # Add sample photos (2-5 per property)
            photo_urls = [
                "https://images.unsplash.com/photo-1560448204-e1a3ecba7d83?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1567496898669-ee935f5317ac?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1584622781564-1d987a7df8a3?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
            ]

            num_photos = random.randint(2, 5)
            selected_photos = random.sample(
                photo_urls, min(num_photos, len(photo_urls))
            )

            for idx, photo_url in enumerate(selected_photos):
                photo = PropertyPhoto(
                    property_id=property.id,
                    url=photo_url,
                    alt_text=f"{property.title} - Photo {idx + 1}",
                    display_order=idx,
                    is_primary=(idx == 0),
                )
                self.session.add(photo)

            properties_data.append(property)

        self.session.commit()
        print(f"✓ Created {len(properties_data)} properties with amenities and photos")

    def run_setup(self):
        """Run the complete database setup"""
        print("🏗️  Starting MM Hub database setup...")
        print(f"Database URL: {settings.DATABASE_URL}")

        try:
            self.create_tables()
            self.create_amenities()
            self.create_users()
            self.create_properties()

            print("\n🎉 Database setup completed successfully!")
            print("\n📊 Summary:")
            print(f"   • Users: {self.session.query(User).count()}")
            print(f"   • Properties: {self.session.query(Property).count()}")
            print(f"   • Amenities: {self.session.query(Amenity).count()}")

            print("\n🔐 Login Credentials:")
            print("   • Admin: admin@mmhub.com / admin123")
            print("   • Landlord: john.landlord@mmhub.com / landlord123")
            print("   • Agent: sarah.agent@mmhub.com / agent123")
            print("   • User: alice.user@gmail.com / user123")

        except Exception as e:
            print(f"❌ Error during setup: {e}")
            self.session.rollback()
            raise
        finally:
            self.session.close()


if __name__ == "__main__":
    setup = DatabaseSetup()
    setup.run_setup()
