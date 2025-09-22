from typing import Tuple, Optional
from math import radians, cos, sin, asin, sqrt
from geoalchemy2.functions import ST_DWithin, ST_GeogFromText, ST_Distance
from sqlalchemy import func


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees) using Haversine formula.
    
    Returns distance in kilometers.
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    
    # Radius of earth in kilometers
    r = 6371
    
    return c * r


def create_point_from_coords(latitude: float, longitude: float) -> str:
    """
    Create a PostGIS POINT string from latitude and longitude.
    """
    return f"POINT({longitude} {latitude})"


def add_distance_filter(query, model_class, latitude: float, longitude: float, radius_km: float):
    """
    Add a distance filter to a SQLAlchemy query using PostGIS.
    
    Args:
        query: SQLAlchemy query object
        model_class: The model class containing the location column
        latitude: Center latitude
        longitude: Center longitude
        radius_km: Search radius in kilometers
    
    Returns:
        Modified query with distance filter
    """
    # Create a geography point from the search coordinates
    search_point = ST_GeogFromText(f"POINT({longitude} {latitude})")
    
    # Add filter for points within the specified radius (in meters)
    radius_meters = radius_km * 1000
    
    return query.filter(
        ST_DWithin(
            func.geography(model_class.location),
            search_point,
            radius_meters
        )
    )


def add_distance_calculation(query, model_class, latitude: float, longitude: float):
    """
    Add distance calculation to a query result.
    
    Args:
        query: SQLAlchemy query object
        model_class: The model class containing the location column
        latitude: Reference latitude
        longitude: Reference longitude
    
    Returns:
        Modified query with distance calculation added
    """
    search_point = ST_GeogFromText(f"POINT({longitude} {latitude})")
    
    distance_calc = ST_Distance(
        func.geography(model_class.location),
        search_point
    ).label('distance_meters')
    
    return query.add_columns(distance_calc)


def validate_coordinates(latitude: Optional[float], longitude: Optional[float]) -> Tuple[bool, str]:
    """
    Validate latitude and longitude coordinates.
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    if latitude is None or longitude is None:
        return False, "Both latitude and longitude are required"
    
    if not (-90 <= latitude <= 90):
        return False, "Latitude must be between -90 and 90 degrees"
    
    if not (-180 <= longitude <= 180):
        return False, "Longitude must be between -180 and 180 degrees"
    
    return True, ""


def get_bounding_box(latitude: float, longitude: float, radius_km: float) -> Tuple[float, float, float, float]:
    """
    Calculate bounding box coordinates for a given center point and radius.
    
    Returns:
        Tuple of (min_lat, min_lon, max_lat, max_lon)
    """
    # Rough conversion: 1 degree of latitude ≈ 111 km
    # 1 degree of longitude ≈ 111 km * cos(latitude)
    
    lat_delta = radius_km / 111.0
    lon_delta = radius_km / (111.0 * cos(radians(latitude)))
    
    min_lat = latitude - lat_delta
    max_lat = latitude + lat_delta
    min_lon = longitude - lon_delta
    max_lon = longitude + lon_delta
    
    # Ensure bounds are within valid coordinate ranges
    min_lat = max(-90, min_lat)
    max_lat = min(90, max_lat)
    min_lon = max(-180, min_lon)
    max_lon = min(180, max_lon)
    
    return min_lat, min_lon, max_lat, max_lon