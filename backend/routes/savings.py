# routes/savings.py

from fastapi import APIRouter
from schemas.calculators import SavingsRequest, InflationRequest, RealRateRequest
from finance.savings import (
    required_monthly_savings, savings_future_value,
    periods_to_reach_goal, savings_schedule,
    savings_with_initial_deposit, inflation_adjusted_goal,
    real_interest_rate
)

router = APIRouter(prefix="/calc/savings", tags=["savings"])

@router.post("/required-payment")
def calc_required_savings(req: SavingsRequest):
    return {"result": round(required_monthly_savings(req.F, req.i, req.n), 2)}

@router.post("/future-value")
def calc_fv(req: SavingsRequest):
    return {"result": round(savings_future_value(req.A, req.i, req.n), 2)}

@router.post("/periods-to-goal")
def calc_periods_to_goal(req: SavingsRequest):
    return {"result": round(periods_to_reach_goal(req.F, req.A, req.i), 2)}

@router.post("/scheudle")
def calc_savings_schedule(req: SavingsRequest):
    return {"schedule": savings_schedule(req.A, req.i, req.n)}

@router.post("/with-initial-deposit")
def calc_savings_with_deposit(req: SavingsRequest):
    return {"result": round(savings_with_initial_deposit(req.P, req.A, req.i, req.n), 2)}

@router.post("/inflation-adjusted-goal")
def calc_inflation_goal(req: InflationRequest):
    return {"result": round(inflation_adjusted_goal(req.F, req.inflation, req.n), 2)}

@router.post("/real-rate")
def calc_real_rate(req: RealRateRequest):
    return {"result", round(real_interest_rate(req.i, req.inflation), 6)}
