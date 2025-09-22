from typing import Generator

from sqlalchemy.orm import Session

from db.base import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    Database dependency for FastAPI.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
