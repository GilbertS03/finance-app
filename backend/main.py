from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.routes.auth_routes import router as auth_router
from routes.time_value import router as time_value_router
from routes.annuities import router as annuities_router
from routes.gradients import router as gradients_router
from routes.loan import router as loan_router
from routes.bond import router as bond_router
from routes.savings import router as savings_router
from routes.scenarios import router as scenarios_router
from routes.comparisons import router as comparisons_router

app = FastAPI(title="Finance Calculator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)
app.include_router(time_value_router)
app.include_router(annuities_router)
app.include_router(gradients_router)
app.include_router(loan_router)
app.include_router(bond_router)
app.include_router(savings_router)
app.include_router(scenarios_router)
app.include_router(comparisons_router)

@app.get("/")
def root():
    return {"message": "Finance Caculator API is running"}