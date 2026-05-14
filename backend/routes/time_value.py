# routes/time_value.py

from fastapi import APIRouter
from schemas.calculators import(
    TimeValueRequest, EffectiveRateRequest, ContinuousRequest
)
from finance.tvm import (
    future_value, present_value, interest_rate, periods, 
    effective_interest_rate, continuous_compounding_fv
)

router = APIRouter(prefix="/calc/time-value", tags=["time value"])

@router.post("/future-value")
def calc_future_value(req: TimeValueRequest):
    return {"result": round(future_value(req.P, req.n, req.i), 2)}

@router.post("/present-value")
def calc_present_value(req: TimeValueRequest):
    return {"result": round(present_value(req.F, req.n, req.i), 2)}

@router.post("/interest-rate")
def calc_interest_rate(req: TimeValueRequest):
    return {"result": round(interest_rate(req.P, req.F, req.n), 6)}

@router.post("/periods")
def calc_periods(req: TimeValueRequest):
    return {"result": round(periods(req.P, req.F, req.i), 2)}

@router.post("/effective-rate")
def calc_effective_rate(req: EffectiveRateRequest):
    return {"result": round(effective_interest_rate(req.r, req.m), 6)}

@router.post("/continuous-compounding")
def calc_continuous(req: ContinuousRequest):
    return {"result": round(continuous_compounding_fv(req.P, req.r, req.n), 2)}
