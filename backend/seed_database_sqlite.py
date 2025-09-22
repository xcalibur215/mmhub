#!/usr/bin/env python3

import hashlib
import random
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path


def hash_password(password: str) -> str:
    """Simple password hashing for demo purposes"""
    return hashlib.sha256(password.encode()).hexdigest()


class DatabaseSeeder:
    def __init__(self, db_path: str = "mmhub.db"):
        self.db_path = db_path
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

    def create_tables(self, conn):
        """Create database tables"""
        cursor = conn.cursor()

        # Users table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                username TEXT UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                phone TEXT,
                role TEXT DEFAULT 'user',
                status TEXT DEFAULT 'active',
                avatar_url TEXT,
                bio TEXT,
                is_verified BOOLEAN DEFAULT 0,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP
            )
        """
        )

        # Properties table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS properties (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                property_type TEXT,
                price DECIMAL(10,2),
                bedrooms INTEGER,
                bathrooms INTEGER,
                square_feet INTEGER,
                address TEXT,
                city TEXT,
                state TEXT,
                zip_code TEXT,
                latitude REAL,
                longitude REAL,
                is_available BOOLEAN DEFAULT 1,
                owner_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (owner_id) REFERENCES users (id)
            )
        """
        )

        # Property photos table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS property_photos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                property_id INTEGER,
                url TEXT NOT NULL,
                caption TEXT,
                is_primary BOOLEAN DEFAULT 0,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (property_id) REFERENCES properties (id)
            )
        """
        )

        # Property amenities table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS property_amenities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                property_id INTEGER,
                name TEXT NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (property_id) REFERENCES properties (id)
            )
        """
        )

        # Messages table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_id INTEGER,
                recipient_id INTEGER,
                property_id INTEGER,
                content TEXT NOT NULL,
                is_read BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sender_id) REFERENCES users (id),
                FOREIGN KEY (recipient_id) REFERENCES users (id),
                FOREIGN KEY (property_id) REFERENCES properties (id)
            )
        """
        )

        conn.commit()
        print("✓ Database tables created")

    def create_admin_user(self, conn):
        """Create the admin user"""
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO users (email, username, hashed_password, first_name, last_name, role, is_verified, is_active, phone, bio)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
            (
                "admin@mmhub.com",
                "admin",
                hash_password("admin123"),
                "MM Hub",
                "Administrator",
                "admin",
                1,
                1,
                "+1-555-000-0000",
                "MM Hub platform administrator",
            ),
        )

        conn.commit()
        print(f"✓ Created admin user: admin@mmhub.com")
        return cursor.lastrowid

    def create_users(self, conn, count: int = 50):
        """Create random users with different roles"""
        cursor = conn.cursor()
        users = []
        roles = ["user", "landlord", "agent"]
        role_weights = [0.6, 0.25, 0.15]  # 60% renters, 25% landlords, 15% agents

        for i in range(count):
            name = random.choice(self.fake_names)
            first_name, last_name = name.split(" ", 1)
            username = f"{first_name.lower()}{last_name.lower().replace(' ', '')}{i+1}"
            email = f"{username}@example.com"

            role = random.choices(roles, weights=role_weights)[0]

            cursor.execute(
                """
                INSERT INTO users (email, username, hashed_password, first_name, last_name, role, is_verified, is_active, phone, avatar_url, bio)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
                (
                    email,
                    username,
                    hash_password("password123"),
                    first_name,
                    last_name,
                    role,
                    random.choice([0, 1, 1, 1]),  # 75% verified
                    1,
                    f"+1-555-{random.randint(100, 999)}-{random.randint(1000, 9999)}",
                    f"https://ui-avatars.com/api/?name={name.replace(' ', '+')}&background=random",
                    self.generate_bio(role),
                ),
            )

            users.append(cursor.lastrowid)

        conn.commit()
        print(f"✓ Created {len(users)} users")
        return users

    def generate_bio(self, role: str) -> str:
        """Generate role-appropriate bio"""
        if role == "user":
            return random.choice(
                [
                    "Looking for a comfortable place to call home.",
                    "Young professional seeking modern living space.",
                    "Student looking for affordable housing near campus.",
                    "Family-oriented renter seeking safe neighborhood.",
                    "Remote worker needing quiet space with good internet.",
                ]
            )
        elif role == "landlord":
            return random.choice(
                [
                    "Experienced property owner with multiple listings.",
                    "Dedicated to providing quality rental experiences.",
                    "Property investor focused on tenant satisfaction.",
                    "Long-time landlord with well-maintained properties.",
                    "Professional property management services.",
                ]
            )
        else:  # agent
            return random.choice(
                [
                    "Licensed real estate agent specializing in rentals.",
                    "Helping clients find their perfect home since 2015.",
                    "Expert in luxury rental properties and locations.",
                    "Dedicated to matching tenants with ideal properties.",
                    "Full-service real estate professional.",
                ]
            )

    def create_properties(self, conn, user_ids):
        """Create random properties"""
        cursor = conn.cursor()
        properties = []
        property_types = ["Apartment", "House", "Studio", "Loft", "Townhouse", "Condo"]

        # Get landlords and agents who can own properties
        cursor.execute("SELECT id FROM users WHERE role IN ('landlord', 'agent')")
        property_owners = [row[0] for row in cursor.fetchall()]

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

            # Price based on location and specs (in USD)
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

            cursor.execute(
                """
                INSERT INTO properties (title, description, property_type, price, bedrooms, bathrooms, square_feet, 
                                      address, city, state, zip_code, latitude, longitude, is_available, owner_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
                (
                    title,
                    self.generate_property_description(title, property_type, location),
                    property_type,
                    monthly_rent,
                    bedrooms,
                    bathrooms,
                    square_feet,
                    f"{random.randint(100, 9999)} {random.choice(['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Broadway', 'Park Ave'])}",
                    location.split(", ")[-1],
                    location.split(", ")[-1] if ", " in location else "NY",
                    f"{random.randint(10000, 99999)}",
                    40.7128 + random.uniform(-0.1, 0.1),  # Around NYC coords
                    -74.0060 + random.uniform(-0.1, 0.1),
                    random.choice([1, 1, 1, 0]),  # 75% available
                    (
                        random.choice(property_owners)
                        if property_owners
                        else random.choice(user_ids)
                    ),
                ),
            )

            properties.append(cursor.lastrowid)

        conn.commit()
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

    def create_property_photos(self, conn, property_ids):
        """Create property photos"""
        cursor = conn.cursor()

        for property_id in property_ids:
            # Each property gets 1-5 images
            num_images = random.randint(1, 5)

            for i in range(num_images):
                cursor.execute(
                    """
                    INSERT INTO property_photos (property_id, url, caption, is_primary, order_index)
                    VALUES (?, ?, ?, ?, ?)
                """,
                    (
                        property_id,
                        f"https://images.unsplash.com/photo-{random.randint(1560000000000, 1700000000000)}?w=800&h=600&fit=crop&crop=house",
                        f"Property Image {i+1}",
                        1 if i == 0 else 0,  # First image is primary
                        i,
                    ),
                )

        conn.commit()
        print(f"✓ Created property photos")

    def create_property_amenities(self, conn, property_ids):
        """Create property amenities"""
        cursor = conn.cursor()
        amenities = [
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

        for property_id in property_ids:
            # Each property gets 3-8 random amenities
            num_amenities = random.randint(3, 8)
            selected_amenities = random.sample(amenities, num_amenities)

            for amenity_name in selected_amenities:
                cursor.execute(
                    """
                    INSERT INTO property_amenities (property_id, name, description)
                    VALUES (?, ?, ?)
                """,
                    (
                        property_id,
                        amenity_name,
                        f"{amenity_name} available for this property",
                    ),
                )

        conn.commit()
        print(f"✓ Created property amenities")

    def create_messages(self, conn, user_ids, property_ids):
        """Create messages between users"""
        cursor = conn.cursor()

        # Create 50-80 messages
        for _ in range(random.randint(50, 80)):
            sender_id = random.choice(user_ids)
            recipient_id = random.choice(user_ids)

            # Don't send message to yourself
            if sender_id == recipient_id:
                continue

            property_id = (
                random.choice(property_ids) if random.choice([True, False]) else None
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

            cursor.execute(
                """
                INSERT INTO messages (sender_id, recipient_id, property_id, content, is_read)
                VALUES (?, ?, ?, ?, ?)
            """,
                (
                    sender_id,
                    recipient_id,
                    property_id,
                    message_content,
                    random.choice([0, 1]),
                ),
            )

        conn.commit()
        print(f"✓ Created messages")

    def run_seed(self):
        """Run the complete seeding process"""
        print("🌱 Starting database seeding...")

        # Remove existing database
        if Path(self.db_path).exists():
            Path(self.db_path).unlink()
            print("✓ Removed existing database")

        conn = sqlite3.connect(self.db_path)

        try:
            # Create tables
            self.create_tables(conn)

            # Create admin user first
            admin_id = self.create_admin_user(conn)

            # Create regular users
            user_ids = self.create_users(conn, 50)
            all_user_ids = [admin_id] + user_ids

            # Create properties
            property_ids = self.create_properties(conn, all_user_ids)

            # Create property photos
            self.create_property_photos(conn, property_ids)

            # Create property amenities
            self.create_property_amenities(conn, property_ids)

            # Create messages
            self.create_messages(conn, all_user_ids, property_ids)

            print("✅ Database seeding completed successfully!")
            print(f"📊 Summary:")
            print(f"   - 1 admin user (admin@mmhub.com / admin123)")
            print(f"   - {len(user_ids)} regular users")
            print(f"   - {len(property_ids)} properties")
            print(f"   - Property amenities and photos added")
            print(f"   - Messages created")
            print(f"   - Database file: {Path(self.db_path).absolute()}")

        except Exception as e:
            print(f"❌ Error during seeding: {e}")
            raise
        finally:
            conn.close()


def main():
    """Main function to run the seeder"""
    seeder = DatabaseSeeder()
    seeder.run_seed()


if __name__ == "__main__":
    main()
