# routes/bond.py

from fastapi import APIRouter
from schemas.calculators import BondRequest, YTMRequest
from finance.bond import (
    bond_price, coupon_payment, current_yield,
    yield_to_maturity, bond_duration, bond_schedule
)

router = APIRouter(prefix="/calc/bond", tags=["bond"])

@router.post("/price")
def calc_bond_price(req: BondRequest):
    C = req.C if req.C is not None else coupon_payment(req.F, req.r)
    return {"result": round(bond_price(req.F, C, req.i, req.n), 2)}

@router.post("/current-yield")
def calc_current_yield(req: BondRequest):
    C = req.C if req.C is not None else coupon_payment(req.F, req.r)
    P = bond_price(req.F, C, req.i, req.n)
    return {"result": round(current_yield(C, P), 6)}

@router.post("ytm")
def calc_ytm(req: YTMRequest):
    return {"result": round(yield_to_maturity(req.F, req.C, req.P, req.n), 6)}

@router.post("/duration")
def calc_bond_duration(req: BondRequest):
    C = req.C if req.C is not None else coupon_payment(req.F, req.r)
    return {"result": round(bond_duration(req.F, C, req.i, req.n), 4)}

@router.post("/schedule")
def calc_bond_schedule(req: BondRequest):
    C = req.C if req.C is not None else coupon_payment(req.F, req.r)
    return {"result": bond_schedule(req.F, C, req.i, req.n)}
