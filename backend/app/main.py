import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.api.router import api_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="EcoAI Carbon Twin API",
    description="Backend API for calculations, simulations, and Gemini AI sustainability coaching",
    version="1.0.0",
)

# Mount API router
app.include_router(api_router, prefix="/api")

# Configure CORS
# Allow local Next.js frontend during development, and dynamically configure for production
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Wildcards or production URLs can be set/loaded from env variables
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "EcoAI Carbon Twin API",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=True)
