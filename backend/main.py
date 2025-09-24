import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Minimal FastAPI app for health checks and future custom endpoints
app = FastAPI(
    title="MM Hub Minimal API",
    description="Minimal API for health checks and custom endpoints - Main data layer is Supabase",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "MM Hub Minimal API - Data layer is Supabase",
        "version": "1.0.0",
        "health": "/health",
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "Minimal API running - Main data operations via Supabase"
    }

if __name__ == "__main__":
    # Keep in sync with Vite proxy target in vite.config.ts
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
