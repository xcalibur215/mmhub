# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

MM Hub is a comprehensive full-stack real estate platform for finding and listing rental properties. The project follows a modern architecture with a React TypeScript frontend and FastAPI Python backend.

## Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Library**: shadcn/ui components with Tailwind CSS
- **Routing**: React Router for client-side navigation
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Query for server state, Context API for auth
- **Runtime**: Bun preferred, npm supported

### Backend (FastAPI + Python)
- **Framework**: FastAPI with SQLAlchemy ORM
- **Database**: PostgreSQL with PostGIS for geographic data
- **Authentication**: JWT-based with bcrypt password hashing
- **Search**: Meilisearch integration for property search
- **Storage**: AWS S3/Cloudinary for file uploads
- **Migrations**: Alembic for database schema management
- **Payment**: Stripe integration (planned)

### Key Architectural Patterns
- Clean architecture with separation of concerns
- Repository pattern for data access
- Service layer for business logic
- API-first design with comprehensive OpenAPI documentation
- Role-based access control (User, Landlord, Agent, Admin)
- Geographic search with PostGIS spatial queries

## Development Commands

### Full Stack Development
```bash
# Start both frontend and backend simultaneously
bun run dev:all
# or
npm run dev:all
```

### Frontend Only
```bash
# Development server (port 3000)
bun run dev
# or
npm run dev

# Build for production
bun run build
npm run build

# Preview production build
bun run preview
npm run preview

# Linting
bun run lint
npm run lint
```

### Backend Only
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Development server (port 8081)
uvicorn main:app --reload --host 0.0.0.0 --port 8081

# Or using the main.py script
python main.py

# Database migrations
alembic upgrade head
alembic revision --autogenerate -m "Description"

# Generate sample data
python generate_sample_data.py
```

### Database Operations
```bash
cd backend

# Create new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history

# Generate comprehensive sample data (25+ users, 100 properties, 30 amenities)
python generate_sample_data.py

# Admin credentials after sample data: admin@mmhub.com / admin123
```

## Project Structure

### Frontend Structure
```
src/
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   ├── Layout/        # Layout components (Header, etc.)
│   └── routing/       # Route protection components
├── pages/             # Application pages/routes
├── hooks/             # Custom React hooks
├── context/           # React context providers (AuthContext)
├── lib/               # Utility functions and configurations
├── utils/             # Helper utilities (currency, location)
└── assets/            # Static assets
```

### Backend Structure
```
backend/
├── main.py            # FastAPI application entrypoint
├── api/v1/           # API endpoints and routes
│   ├── deps.py       # Dependencies (auth, database)
│   └── routes/       # Route handlers (auth, users, properties, admin)
├── core/             # Core application functionality
│   ├── config.py     # Settings (APP_NAME=mmeverything, JWT_ISSUER=mmeverything)
│   ├── security.py   # JWT and password handling
│   └── logging.py    # Application logging
├── db/               # Database layer
│   ├── session.py    # Database session management
│   ├── base.py       # SQLAlchemy base
│   └── models/       # Database models (User, Property, Amenity, etc.)
├── schemas/          # Pydantic request/response models
├── services/         # Business logic (storage, search, email, payments)
├── utils/            # Utilities (geo queries, pagination)
└── alembic/          # Database migration files
```

## Key Features and Components

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (User, Landlord, Agent, Admin)
- Protected routes with `ProtectedRoute` and `AdminRoute` components
- Context-based auth state management

### Property Management
- Full CRUD operations for property listings
- Geographic search with PostGIS integration
- Multiple property photos with cloud storage
- Amenity associations and filtering
- Real-time search via Meilisearch

### User System
- User registration and profile management
- Role assignment and verification
- Message threading between users
- Favorite properties functionality

### Technology Integration
- **Database**: PostgreSQL with PostGIS extension for geographic queries
- **Search**: Meilisearch for fast property search and filtering
- **Storage**: AWS S3 or Cloudinary for property image uploads
- **Payments**: Stripe integration (planned)
- **Email**: SMTP with template support

## Development Guidelines

### Frontend Development
- Use TypeScript for all new components and utilities
- Follow shadcn/ui component patterns for consistent styling
- Implement proper form validation with React Hook Form + Zod
- Use React Query for all API interactions
- Maintain responsive design with Tailwind CSS

### Backend Development
- Follow FastAPI best practices with proper dependency injection
- Use Pydantic schemas for all request/response validation
- Implement proper error handling and logging
- Write database queries using SQLAlchemy ORM
- Use Alembic for all database schema changes

### API Design
- RESTful endpoints with proper HTTP methods
- Comprehensive OpenAPI documentation
- Consistent error response format
- Pagination for list endpoints
- Geographic data in GeoJSON format

## Environment Configuration

### Frontend Environment
- Development server runs on port 3000
- Production builds to `dist/` directory
- Vite configuration in `vite.config.ts`

### Backend Environment
- Development server runs on port 8081
- Environment variables in `.env` (copy from `.env.example`)
- Database connection requires PostgreSQL with PostGIS
- JWT signing requires `SECRET_KEY` environment variable

## Testing and Quality

### Frontend Testing
- ESLint configuration for code quality
- TypeScript for compile-time type checking

### Backend Testing
- Pytest test suite in `tests/` directory
- Test database configuration in `conftest.py`
- Authentication and property endpoint tests

## Deployment Notes

- Frontend builds to static files suitable for CDN deployment
- Backend supports Docker deployment with proper environment variables
- Database requires PostgreSQL 13+ with PostGIS extension
- External services: Meilisearch, Redis, S3/Cloudinary, Stripe