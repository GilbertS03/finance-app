# routes/calculators.py

from fastapi import APIRouter
from schemas.calculators import (
    TimeValueRequest, EffectiveRateRequest, ContinuousRequest,
    AnnuityRequest, GradientRequest, LoanRequest, MaxLoanRequest,
    RemainingBalanceRequest, BondRequest, YTMRequest,
    SavingsRequest, InflationRequest, RealRateRequest
)
from finance.annuities import (
    future_value_annuity, present_value_annuity,
    annuity_from_future_value, annuity_from_present_value,
    periods_from_present_value_annuity, periods_from_future_value_annuity,
    perpetuity_present_value
)
from finance.gradients import (
    present_value_arithmetic_gradient, future_value_arithmetic_gradient,
    annuity_from_arithmetic_gradient, present_value_geometric_gradient,
    future_value_geometric_gradient, total_present_value_arithmetic,
    total_present_value_geometric
)
from finance.loan import (
    monthly_payment, total_payment, total_interest,
    amortization_schedule, max_loan_amount, remaining_balance
)
from finance.bond import (
    bond_price, coupon_payment, current_yield,
    yield_to_maturity, bond_duration, bond_schedule
)
from finance.savings import (
    required_monthly_savings, savings_future_value,
    periods_to_reach_goal, savings_schedule,
    savings_with_initial_deposit, inflation_adjusted_goal,
    real_interest_rate
)

router = APIRouter(prefix="/calc", tags=["calculators"])

# ___Gradients__________________________________________________________________

@router.post("/gradient/arithmetic-pv")
def calc_arithmetic_pv(req: GradientRequest):
    return {"result": present_value_arithmetic_gradient(req.G, req.i, req.n)}

@router.post("/gradient/arithemtic-fv")
def calc_arithmetic_fv(req: GradientRequest):
    return {"result": future_value_arithmetic_gradient(req.G, req.i, req.n)}

@router.post("/gradient/arithmetic-annuity")
def calc_arithmetic_annuity(req: GradientRequest):
    return {"result": annuity_from_arithmetic_gradient(req.G, req.i, req.n)}

@router.post("/gradient/geometric-pv")
def calc_geometric_pv(req: GradientRequest):
    return {"result": present_value_geometric_gradient(req.A1, req.g, req.i, req.n)}

@router.post("/gradient/geomtric-fv")
def calc_geometric_fv(req: GradientRequest):
    return {"result": future_value_geometric_gradient(req.A1, req.g, req.i, req.n)}

@router.post("/gradient/total-arihmetic-pv")
def calc_total_arithmetic_pv(req: GradientRequest):
    return {"result": total_present_value_arithmetic(req.A, req.G, req.i, req.n)}

@router.post("/gradient/total-geometric-pv")
def calc_total_geometric_pv(req: GradientRequest):
    return {"result": total_present_value_geometric(req.A1, req.g, req.i, req.n)}

# ___Loan__________________________________________________________________________

@router.post("/loan/payment")
def calc_loan_payment(req: LoanRequest):
    A = monthly_payment(req.P, req.i, req.n)
    return {
        "payment": round(A, 2),
        "total_payment": round(total_payment(A, req.n), 2),
        "total_interest": round(total_interest(req.P, A, req.n), 2)
    } 

@router.post("/loan/")