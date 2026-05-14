# routes/annuities

from fastapi import APIRouter
from schemas.calculators import AnnuityRequest
from finance.annuities import (
    future_value_annuity, present_value_annuity,
    annuity_from_future_value, annuity_from_present_value,
    periods_from_present_value_annuity, periods_from_future_value_annuity,
    perpetuity_present_value
)

router = APIRouter(prefix="/calc/annuities", tags=["annuities"])

@router.post("/fv")
def calc_annuity_fv(req: AnnuityRequest):
    return {"result": round(future_value_annuity(req.A, req.n, req.i), 2)}

@router.post("/pv")
def calc_annuity_pv(req: AnnuityRequest):
    return {"result": round(present_value_annuity(req.A, req.n, req.i), 2)}

@router.post("/from-fv")
def calc_annuity_from_fv(req: AnnuityRequest):
    return {"result": round(annuity_from_future_value(req.F, req.n, req.i), 2)}

@router.post("/from-pv")
def calc_annuity_from_pv(req: AnnuityRequest):
    return {"result": round(annuity_from_present_value(req.P, req.n, req.i), 2)}

@router.post("/periods-from-pv")
def calc_periods_from_pv(req: AnnuityRequest):
    return {"result": round(periods_from_present_value_annuity(req.P, req.A, req.i), 2)}

@router.post("/periods-from-fv")
def calc_periods_from_fv(req: AnnuityRequest):
    return {"result": round(periods_from_future_value_annuity(req.F, req.A, req.i), 2)}

@router.post("/perpetuity")
def calc_perpetuity(req: AnnuityRequest):
    return {"result": round(perpetuity_present_value(req.A, req.i), 2)}
