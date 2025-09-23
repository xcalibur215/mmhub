from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from core.config import settings

# Helper: if using SQLite, enable check_same_thread False so FastAPI with async workers
# and reload does not hit the SQLite thread check error. Safe no-op for other DBs.
if settings.DATABASE_URL.startswith("sqlite"):
	engine = create_engine(
		settings.DATABASE_URL, connect_args={"check_same_thread": False}
	)
else:
	engine = create_engine(settings.DATABASE_URL)

# Create a session factory
SessionLocal = sessionmaker(autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()
