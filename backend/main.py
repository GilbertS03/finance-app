from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.routes.auth_routes import router as auth_router

app = FastAPI(title="Finance Calculator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "Finance Caculator API is running"}