# routes/loan.py

from fastapi import APIRouter
from schemas.calculators import LoanRequest, MaxLoanRequest, RemainingBalanceRequest
from finance.loan import (
    monthly_payment, total_payment, total_interest,
    amortization_schedule, max_loan_amount, remaining_balance
)

router = APIRouter(prefix="/calc/loan", tags=["loan"])

@router.post("/payment")
def calc_loan_payment(req: LoanRequest):
    A = monthly_payment(req.P, req.i, req.n)
    return {
        "payment": round(A, 2),
        "total_payment": round(total_payment(A, req.n), 2),
        "total_interest": round(total_interest(req.P, A, req.n), 2)
    } 

@router.post("/schedule")
def calc_loan_schedule(req: LoanRequest):
    return {"schedule": amortization_schedule(req.P, req.i, req.n)}

@router.post("/max-amount")
def calc_max_loan(req: MaxLoanRequest):
    return {"result": round(max_loan_amount(req.A, req.i, req.n), 2)}

@router.post("/remaining-balance")
def calc_remaining_balance(req: RemainingBalanceRequest):
    return {"result": round(remaining_balance(req.P, req.i, req.n, req.periods_paid))}
