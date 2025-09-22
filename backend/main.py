import time

import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse

from core.config import settings
from core.logging import setup_app_logging

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="MM Hub Real Estate Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Setup logging
setup_app_logging(settings)

# Add CORS middleware
if settings.BACKEND_CORS_ORIGINS:
    # Normalize and strip trailing slashes to ensure exact match with browser Origin
    allowed_origins = [str(origin).rstrip("/") for origin in settings.BACKEND_CORS_ORIGINS]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Add trusted host middleware (security)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=[
        "localhost",
        "127.0.0.1",
        "10.0.0.26",
        "192.168.20.1",
        "*.mmhub.com",
    ],
)


# Custom middleware for request timing
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Exception handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(status_code=404, content={"detail": "Resource not found"})


@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "app_name": settings.APP_NAME,
    }


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to MM Hub API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }


from api.v1.routes.admin import router as admin_router
from api.v1.routes.moderation import router as moderation_router

# Include API routes
from api.v1.routes.auth import router as auth_router
from api.v1.routes.properties import router as properties_router
from api.v1.routes.users import router as users_router

app.include_router(
    auth_router, prefix=settings.API_V1_STR + "/auth", tags=["authentication"]
)
app.include_router(users_router, prefix=settings.API_V1_STR + "/users", tags=["users"])
app.include_router(
    properties_router, prefix=settings.API_V1_STR + "/properties", tags=["properties"]
)
app.include_router(admin_router, prefix=settings.API_V1_STR + "/admin", tags=["admin"])
app.include_router(moderation_router, prefix=settings.API_V1_STR, tags=["moderation"])


# Ensure tables exist in development (safe for SQLite)
try:
    from db.base import Base, engine  # type: ignore

    @app.on_event("startup")
    async def ensure_tables():
        try:
            Base.metadata.create_all(bind=engine)
        except Exception:
            # Avoid crashing if migrations are managed elsewhere
            pass
except Exception:
    pass

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8081,
        reload=settings.DEBUG,
        reload_dirs=["./"] if settings.DEBUG else None,
    )
