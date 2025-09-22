from math import ceil
from typing import Any, Dict, List, Optional


class PaginationParams:
    """Pagination parameters helper class."""

    def __init__(self, page: int = 1, page_size: int = 20, max_page_size: int = 100):
        self.page = max(1, page)
        self.page_size = min(max(1, page_size), max_page_size)
        self.offset = (self.page - 1) * self.page_size
        self.limit = self.page_size


class PaginatedResponse:
    """Paginated response helper class."""

    def __init__(
        self, items: List[Any], total: int, page: int, page_size: int, **kwargs
    ):
        self.items = items
        self.total = total
        self.page = page
        self.page_size = page_size
        self.total_pages = ceil(total / page_size) if page_size > 0 else 0
        self.has_next = page < self.total_pages
        self.has_prev = page > 1

        # Add any additional fields
        for key, value in kwargs.items():
            setattr(self, key, value)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary format."""
        return {
            "items": self.items,
            "total": self.total,
            "page": self.page,
            "page_size": self.page_size,
            "total_pages": self.total_pages,
            "has_next": self.has_next,
            "has_prev": self.has_prev,
        }


def paginate_query(query, page: int = 1, page_size: int = 20, max_page_size: int = 100):
    """
    Apply pagination to a SQLAlchemy query.

    Args:
        query: SQLAlchemy query object
        page: Page number (1-based)
        page_size: Number of items per page
        max_page_size: Maximum allowed page size

    Returns:
        PaginatedResponse object
    """
    params = PaginationParams(page, page_size, max_page_size)

    # Get total count
    total = query.count()

    # Apply offset and limit
    items = query.offset(params.offset).limit(params.limit).all()

    return PaginatedResponse(
        items=items, total=total, page=params.page, page_size=params.page_size
    )
