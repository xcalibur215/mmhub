#!/usr/bin/env python3

import os
import random
import sys
from datetime import datetime, timedelta
from typing import List

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session

from core.security import get_password_hash
from db.base import Base, SessionLocal, engine
from db.models import *
from db.models.user import UserRole


class DatabaseSeeder:
    def __init__(self):
        self.fake_names = [
            "John Smith",
            "Sarah Johnson",
            "Michael Brown",
            "Emily Davis",
            "David Wilson",
            "Jessica Miller",
            "Christopher Anderson",
            "Amanda Taylor",
            "Matthew Thomas",
            "Ashley Jackson",
            "Daniel White",
            "Jennifer Harris",
            "Anthony Martin",
            "Elizabeth Thompson",
            "Mark Garcia",
            "Linda Rodriguez",
            "Steven Lewis",
            "Susan Walker",
            "Paul Hall",
            "Nancy Allen",
            "Kenneth Young",
            "Betty King",
            "Joshua Wright",
            "Helen Lopez",
            "Ryan Hill",
            "Michelle Green",
            "Brian Adams",
            "Sharon Nelson",
            "Edward Baker",
            "Carol Gonzalez",
            "Jason Turner",
            "Lisa Phillips",
            "Kevin Campbell",
            "Donna Parker",
            "Gary Evans",
            "Maria Edwards",
            "Timothy Collins",
            "Sandra Stewart",
            "Jose Sanchez",
            "Ruth Morris",
            "Frank Rogers",
            "Anna Reed",
            "Scott Cook",
            "Deborah Bailey",
            "Raymond Rivera",
            "Laura Cooper",
            "Gregory Richardson",
            "Janet Cox",
            "Alexander Howard",
            "Catherine Ward",
        ]

        self.property_titles = [
            "Luxury Downtown Apartment",
            "Cozy Studio Near Campus",
            "Modern 2BR with Balcony",
            "Spacious Family Home",
            "Charming Garden Apartment",
            "High-Rise City View",
            "Renovated Historic Loft",
            "Penthouse Suite",
            "Waterfront Condo",
            "Suburban Villa",
            "Minimalist Studio",
            "Executive Townhouse",
            "Artists' Loft Space",
            "Rooftop Terrace Apartment",
            "Classic Brownstone",
            "Contemporary High-Rise",
            "Garden Level Unit",
            "Corner Penthouse",
            "Converted Warehouse Loft",
            "Boutique Studio",
            "Mid-Century Modern Home",
            "Industrial Chic Apartment",
            "Elegant Victorian House",
            "Urban Retreat",
            "Skyline View Condo",
            "Riverside Apartment",
            "Designer Furnished Studio",
            "Luxury High-Rise Unit",
            "Vintage Charm Apartment",
            "Modern Townhouse",
        ]

        self.locations = [
            "Downtown Manhattan, New York",
            "SoHo, New York",
            "Brooklyn Heights, New York",
            "Beverly Hills, Los Angeles",
            "Santa Monica, Los Angeles",
            "Hollywood, Los Angeles",
            "Lincoln Park, Chicago",
            "River North, Chicago",
            "Wicker Park, Chicago",
            "South Beach, Miami",
            "Brickell, Miami",
            "Coral Gables, Miami",
            "Capitol Hill, Seattle",
            "Belltown, Seattle",
            "Queen Anne, Seattle",
            "Mission District, San Francisco",
            "SOMA, San Francisco",
            "Pacific Heights, San Francisco",
            "Back Bay, Boston",
            "North End, Boston",
            "Cambridge, Boston",
            "Dupont Circle, Washington DC",
            "Georgetown, Washington DC",
            "Adams Morgan, Washington DC",
        ]

        self.amenities = [
            "Pool",
            "Gym",
            "Parking",
            "Balcony",
            "Air Conditioning",
            "Heating",
            "Washing Machine",
            "Dryer",
            "Closet",
            "Granite Countertops",
            "Stainless Steel Appliances",
            "In-unit Laundry",
            "Doorman",
            "Elevator",
            "Pet Friendly",
            "Furnished",
            "Fireplace",
            "High Ceilings",
            "Floor-to-ceiling Windows",
            "City View",
            "Garden View",
            "Waterfront View",
            "WiFi",
            "Working desk",
        ]

    def create_admin_user(self, session: Session):
        """Create the admin user"""
        admin_user = User(
            email="admin@mmhub.com",
            username="admin",
            hashed_password=get_password_hash("admin123"),
            first_name="MM Hub",
            last_name="Administrator",
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
            phone="+1-555-000-0000",
            bio="MM Hub platform administrator",
            created_at=datetime.utcnow(),
        )
        session.add(admin_user)
        session.commit()
        session.refresh(admin_user)
        print(f"✓ Created admin user: {admin_user.email}")
        return admin_user

    def create_users(self, session: Session, count: int = 50) -> List[User]:
        """Create random users with different roles"""
        users = []
        roles = [UserRole.USER, UserRole.LANDLORD, UserRole.AGENT]
        role_weights = [0.6, 0.25, 0.15]  # 60% renters, 25% landlords, 15% agents

        for i in range(count):
            name = random.choice(self.fake_names)
            first_name, last_name = name.split(" ", 1)
            username = f"{first_name.lower()}{last_name.lower().replace(' ', '')}{i+1}"
            email = f"{username}@example.com"

            role = random.choices(roles, weights=role_weights)[0]

            user = User(
                email=email,
                username=username,
                hashed_password=get_password_hash("password123"),
                first_name=first_name,
                last_name=last_name,
                role=role,
                is_active=True,
                is_verified=random.choice([True, True, True, False]),  # 75% verified
                phone=f"+1-555-{random.randint(100, 999)}-{random.randint(1000, 9999)}",
                avatar_url=f"https://ui-avatars.com/api/?name={name.replace(' ', '+')}&background=random",
                bio=self.generate_bio(role),
                created_at=datetime.utcnow() - timedelta(days=random.randint(1, 365)),
            )

            session.add(user)
            users.append(user)

        session.commit()
        for user in users:
            session.refresh(user)

        print(f"✓ Created {len(users)} users")
        return users

    def generate_bio(self, role: UserRole) -> str:
        """Generate role-appropriate bio"""
        if role == UserRole.USER:
            return random.choice(
                [
                    "Looking for a comfortable place to call home.",
                    "Young professional seeking modern living space.",
                    "Student looking for affordable housing near campus.",
                    "Family-oriented renter seeking safe neighborhood.",
                    "Remote worker needing quiet space with good internet.",
                ]
            )
        elif role == UserRole.LANDLORD:
            return random.choice(
                [
                    "Experienced property owner with multiple listings.",
                    "Dedicated to providing quality rental experiences.",
                    "Property investor focused on tenant satisfaction.",
                    "Long-time landlord with well-maintained properties.",
                    "Professional property management services.",
                ]
            )
        else:  # AGENT
            return random.choice(
                [
                    "Licensed real estate agent specializing in rentals.",
                    "Helping clients find their perfect home since 2015.",
                    "Expert in luxury rental properties and locations.",
                    "Dedicated to matching tenants with ideal properties.",
                    "Full-service real estate professional.",
                ]
            )

    def create_properties(
        self, session: Session, landlords: List[User], agents: List[User]
    ) -> List[Property]:
        """Create random properties"""
        properties = []
        property_types = ["Apartment", "House", "Studio", "Loft", "Townhouse", "Condo"]

        # Get all landlords and some agents who can manage properties
        property_owners = landlords + random.sample(agents, min(5, len(agents)))

        for i in range(100):  # Create 100 properties
            title = random.choice(self.property_titles)
            location = random.choice(self.locations)
            property_type = random.choice(property_types)

            # Generate realistic specs based on property type
            if property_type == "Studio":
                bedrooms = 0
                bathrooms = 1
                square_feet = random.randint(300, 600)
            elif property_type in ["Apartment", "Condo"]:
                bedrooms = random.choices([1, 2, 3], weights=[0.4, 0.4, 0.2])[0]
                bathrooms = random.randint(1, 2)
                square_feet = random.randint(500, 1500)
            else:  # House, Loft, Townhouse
                bedrooms = random.choices([2, 3, 4, 5], weights=[0.2, 0.4, 0.3, 0.1])[0]
                bathrooms = random.randint(1, 3)
                square_feet = random.randint(800, 3000)

            # Price based on location and specs (in USD, will be converted in frontend)
            base_price = {
                "Studio": 800,
                "Apartment": 1200,
                "Condo": 1500,
                "Loft": 1800,
                "Townhouse": 2000,
                "House": 2500,
            }[property_type]

            # Location multiplier
            if "Manhattan" in location or "Beverly Hills" in location:
                location_multiplier = 2.5
            elif "San Francisco" in location or "Downtown" in location:
                location_multiplier = 2.0
            elif "Seattle" in location or "Boston" in location:
                location_multiplier = 1.5
            else:
                location_multiplier = 1.0

            monthly_rent = int(
                base_price * location_multiplier * (1 + random.uniform(-0.3, 0.5))
            )

            property_obj = Property(
                title=title,
                description=self.generate_property_description(
                    title, property_type, location
                ),
                property_type=property_type,
                price=monthly_rent,
                bedrooms=bedrooms,
                bathrooms=bathrooms,
                square_feet=square_feet,
                address=f"{random.randint(100, 9999)} {random.choice(['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Broadway', 'Park Ave'])}",
                city=location.split(", ")[-1],
                state=location.split(", ")[-1] if ", " in location else "NY",
                zip_code=f"{random.randint(10000, 99999)}",
                latitude=40.7128 + random.uniform(-0.1, 0.1),  # Around NYC coords
                longitude=-74.0060 + random.uniform(-0.1, 0.1),
                is_available=random.choice([True, True, True, False]),  # 75% available
                owner_id=random.choice(property_owners).id,
                created_at=datetime.utcnow() - timedelta(days=random.randint(1, 180)),
                updated_at=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
            )

            session.add(property_obj)
            properties.append(property_obj)

        session.commit()
        for prop in properties:
            session.refresh(prop)

        print(f"✓ Created {len(properties)} properties")
        return properties

    def generate_property_description(
        self, title: str, property_type: str, location: str
    ) -> str:
        """Generate realistic property description"""
        descriptions = [
            f"Beautiful {property_type.lower()} in the heart of {location}. This stunning unit features modern amenities and is perfect for those seeking luxury living.",
            f"Spacious {property_type.lower()} located in {location}. Newly renovated with high-end finishes throughout.",
            f"Charming {property_type.lower()} in {location}. Great location with easy access to public transportation and local amenities.",
            f"Modern {property_type.lower()} in {location}. Features include updated kitchen, high-speed WiFi, and plenty of natural light.",
            f"Stunning {property_type.lower()} in the desirable {location} area. Perfect for professionals or families looking for quality living.",
        ]
        return random.choice(descriptions)

    def create_property_amenities(self, session: Session, properties: List[Property]):
        """Create property amenities relationships"""
        for property_obj in properties:
            # Each property gets 3-8 random amenities
            num_amenities = random.randint(3, 8)
            selected_amenities = random.sample(self.amenities, num_amenities)

            for amenity_name in selected_amenities:
                amenity = PropertyAmenity(
                    property_id=property_obj.id,
                    name=amenity_name,
                    description=f"{amenity_name} available for this property",
                )
                session.add(amenity)

        session.commit()
        print(f"✓ Created property amenities")

    def create_property_images(self, session: Session, properties: List[Property]):
        """Create property images"""
        for property_obj in properties:
            # Each property gets 1-5 images
            num_images = random.randint(1, 5)

            for i in range(num_images):
                image = PropertyPhoto(
                    property_id=property_obj.id,
                    url=f"https://images.unsplash.com/photo-{random.randint(1560000000000, 1700000000000)}?w=800&h=600&fit=crop&crop=house",
                    caption=f"{property_obj.title} - Image {i+1}",
                    is_primary=i == 0,  # First image is primary
                    order=i,
                )
                session.add(image)

        session.commit()
        print(f"✓ Created property images")

    def create_messages(
        self, session: Session, users: List[User], properties: List[Property]
    ):
        """Create messages between users"""
        messages = []

        # Create 50-80 messages
        for _ in range(random.randint(50, 80)):
            sender = random.choice(users)
            receiver = random.choice(users)

            # Don't send message to yourself
            if sender.id == receiver.id:
                continue

            property_obj = (
                random.choice(properties) if random.choice([True, False]) else None
            )

            message_content = random.choice(
                [
                    "Hi, I'm interested in your property listing. Could you provide more details?",
                    "Is this property still available? I'd like to schedule a viewing.",
                    "What's the earliest move-in date for this property?",
                    "Are pets allowed in this rental?",
                    "Could you tell me more about the neighborhood?",
                    "I'm very interested in renting this place. Let me know when we can meet.",
                    "Is parking included with the rental?",
                    "What utilities are included in the rent?",
                ]
            )

            message = Message(
                sender_id=sender.id,
                recipient_id=receiver.id,
                property_id=property_obj.id if property_obj else None,
                content=message_content,
                is_read=random.choice([True, False]),
                created_at=datetime.utcnow() - timedelta(days=random.randint(1, 30)),
            )

            session.add(message)
            messages.append(message)

        session.commit()
        print(f"✓ Created {len(messages)} messages")

    def run_seed(self):
        """Run the complete seeding process"""
        print("🌱 Starting database seeding...")

        # Create tables
        Base.metadata.create_all(bind=engine)
        print("✓ Database tables created/verified")

        session = SessionLocal()
        try:
            # Create admin user first
            admin_user = self.create_admin_user(session)

            # Create regular users
            users = self.create_users(session, 50)

            # Separate users by role
            renters = [u for u in users if u.role == UserRole.USER]
            landlords = [u for u in users if u.role == UserRole.LANDLORD]
            agents = [u for u in users if u.role == UserRole.AGENT]

            print(f"  - {len(renters)} renters")
            print(f"  - {len(landlords)} landlords")
            print(f"  - {len(agents)} agents")

            # Create properties
            properties = self.create_properties(session, landlords, agents)

            # Create property amenities
            self.create_property_amenities(session, properties)

            # Create property images
            self.create_property_images(session, properties)

            # Create messages
            self.create_messages(session, users + [admin_user], properties)

            print("✅ Database seeding completed successfully!")
            print(f"📊 Summary:")
            print(f"   - 1 admin user (admin@mmhub.com / admin123)")
            print(f"   - {len(users)} regular users")
            print(f"   - {len(properties)} properties")
            print(f"   - Property amenities and images added")
            print(f"   - Messages created")

        except Exception as e:
            print(f"❌ Error during seeding: {e}")
            session.rollback()
            raise
        finally:
            session.close()


def main():
    """Main function to run the seeder"""
    seeder = DatabaseSeeder()
    seeder.run_seed()


if __name__ == "__main__":
    main()
