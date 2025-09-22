# MM Hub Backend API

A comprehensive FastAPI-based backend for the MM Hub Real Estate Platform.

## 🏗️ Architecture

The backend follows a clean architecture pattern with the following structure:

```
backend/
├─ pyproject.toml          # Poetry dependencies and configuration
├─ .env.example            # Environment variables template
├─ alembic.ini             # Database migration configuration
├─ main.py                 # FastAPI application entrypoint
├─ generate_sample_data.py # Sample data generator script
├─ alembic/                # Database migrations
│  ├─ env.py
│  ├─ script.py.mako
│  └─ versions/
├─ api/                    # API endpoints
│  └─ v1/
│     ├─ deps.py           # Dependencies (auth, etc.)
│     └─ routes/           # Route definitions
│        ├─ auth.py
│        ├─ users.py
│        ├─ properties.py
│        ├─ uploads.py
│        ├─ threads.py
│        └─ messages.py
├─ core/                   # Core functionality
│  ├─ config.py            # Settings (APP_NAME=mmeverything, JWT_ISSUER=mmeverything)
│  ├─ security.py          # JWT, password hashing
│  └─ logging.py           # Logging configuration
├─ db/                     # Database layer
│  ├─ session.py           # SessionLocal / async engine
│  ├─ base.py              # Base = declarative_base()
│  └─ models/              # SQLAlchemy models
│     ├─ __init__.py       # Re-export Base and models
│     ├─ user.py
│     ├─ property.py
│     ├─ amenity.py
│     ├─ property_photo.py
│     ├─ property_amenity.py
│     ├─ thread.py
│     └─ message.py
├─ schemas/                # Pydantic schemas
│  ├─ user.py
│  ├─ auth.py
│  ├─ property.py
│  └─ message.py
├─ services/               # Business logic services
│  ├─ storage.py           # S3/Cloudinary
│  ├─ search.py            # Meilisearch indexing
│  ├─ email.py
│  └─ payments.py          # Stripe
├─ utils/                  # Utility functions
│  ├─ geo.py               # PostGIS helpers
│  └─ pagination.py
└─ tests/                  # Test suite
   ├─ conftest.py
   ├─ test_auth.py
   └─ test_properties.py
```

## 🚀 Features

### Core Features
- **User Management**: Registration, authentication, profiles, roles (User, Landlord, Agent, Admin)
- **Property Management**: CRUD operations, search, filtering, photos, amenities
- **Messaging System**: Thread-based messaging between users
- **File Uploads**: Support for property photos with cloud storage
- **Geographic Search**: PostGIS integration for location-based queries
- **Real-time Search**: Meilisearch integration for fast property search

### Security Features
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Role-based access control
- CORS protection
- Input validation and sanitization

### Database Features
- PostgreSQL with PostGIS for geographic data
- SQLAlchemy ORM with Alembic migrations
- Comprehensive data models with relationships
- Database session management

### API Features
- RESTful API design
- Comprehensive API documentation with Swagger/OpenAPI
- Request/response validation with Pydantic
- Pagination support
- Error handling and logging

## 🛠️ Technology Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with PostGIS
- **ORM**: SQLAlchemy 2.0
- **Authentication**: JWT with python-jose
- **Validation**: Pydantic
- **Search**: Meilisearch
- **Storage**: AWS S3 / Cloudinary
- **Payment**: Stripe
- **Email**: SMTP with templates
- **Testing**: Pytest
- **Migrations**: Alembic

## 📋 Prerequisites

- Python 3.11+
- Poetry (for dependency management)
- PostgreSQL with PostGIS extension
- Redis (for caching)
- Meilisearch (for search functionality)

## ⚙️ Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies with Poetry:**
   ```bash
   poetry install
   ```

3. **Activate the virtual environment:**
   ```bash
   poetry shell
   ```

4. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

5. **Edit `.env` file with your configuration:**
   ```bash
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/mmhub_db
   
   # JWT
   SECRET_KEY=your-super-secret-key-here
   
   # Other services...
   ```

6. **Set up PostgreSQL database:**
   ```sql
   CREATE DATABASE mmhub_db;
   CREATE EXTENSION postgis;
   ```

7. **Run database migrations:**
   ```bash
   alembic upgrade head
   ```

8. **Generate sample data (optional):**
   ```bash
   python generate_sample_data.py
   ```

## 🚀 Running the Application

### Development Mode
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Using Poetry
```bash
poetry run uvicorn main:app --reload
```

### Using the main.py script
```bash
python main.py
```

## 📊 Sample Data

The project includes a comprehensive sample data generator that creates:

- **25+ Users**: Mix of admins, landlords, agents, and regular users
- **100 Properties**: Realistic property listings across 30 US cities
- **30 Amenities**: Common property amenities with categories
- **Property Photos**: Multiple photos per property with Unsplash URLs
- **Amenity Associations**: Random amenities assigned to properties

### Admin Credentials
After running the sample data generator:
- **Email**: admin@mmhub.com
- **Password**: admin123

### Generate Sample Data
```bash
python generate_sample_data.py
```

## 🧪 Testing

Run the test suite:
```bash
pytest
```

Run with coverage:
```bash
pytest --cov=.
```

Run specific test file:
```bash
pytest tests/test_auth.py
```

## 📖 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🗄️ Database Migrations

### Create a new migration
```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply migrations
```bash
alembic upgrade head
```

### Rollback migration
```bash
alembic downgrade -1
```

### View migration history
```bash
alembic history
```

## 🔧 Configuration

The application uses environment variables for configuration. Key settings include:

### Core Settings
- `APP_NAME`: Application name (default: mmeverything)
- `JWT_ISSUER`: JWT issuer (default: mmeverything)
- `SECRET_KEY`: JWT signing key
- `DATABASE_URL`: PostgreSQL connection string

### External Services
- `MEILISEARCH_URL`: Search service URL
- `REDIS_URL`: Redis connection string
- `STRIPE_SECRET_KEY`: Stripe payment processing
- `AWS_ACCESS_KEY_ID`: AWS S3 for file storage
- `SMTP_HOST`: Email service configuration

## 📁 Project Structure Details

### Models
- **User**: User accounts with roles and authentication
- **Property**: Real estate listings with location data
- **Amenity**: Property features and amenities
- **PropertyPhoto**: Property image management
- **PropertyAmenity**: Many-to-many property-amenity relationships
- **Thread**: Message conversation containers
- **Message**: Individual messages in threads

### API Endpoints (Planned)
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/users/me` - Current user profile
- `GET /api/v1/properties/` - List properties with filters
- `POST /api/v1/properties/` - Create new property
- `GET /api/v1/properties/{id}` - Get property details
- `POST /api/v1/uploads/` - Upload files
- `GET /api/v1/threads/` - List user conversations
- `POST /api/v1/messages/` - Send message

## 🔐 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Role-based access control (User, Landlord, Agent, Admin)
- Request validation and sanitization
- CORS protection
- Rate limiting (configurable)
- SQL injection prevention via ORM

## 🌍 Deployment

### Docker Deployment (Recommended)
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY . .

RUN pip install poetry
RUN poetry install --no-dev

CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production
Ensure these are set in production:
- `DATABASE_URL`
- `SECRET_KEY` (strong, unique key)
- `REDIS_URL`
- `MEILISEARCH_URL`
- External service keys (AWS, Stripe, etc.)

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Run linting: `black .` and `isort .`
5. Ensure all tests pass

## 📝 License

This project is part of the MM Hub platform.

---

For more information about the frontend, see the main project README.