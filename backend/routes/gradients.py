# routes/gradients.py

from fastapi import APIRouter
from schemas.calculators import GradientRequest
from finance.gradients import (
    present_value_arithmetic_gradient, future_value_arithmetic_gradient,
    annuity_from_arithmetic_gradient, present_value_geometric_gradient,
    future_value_geometric_gradient, total_present_value_arithmetic,
    total_present_value_geometric
)

router = APIRouter(prefix="/calc/gradients", tags=["gradients"])

@router.post("/arithmetic-pv")
def calc_arithmetic_pv(req: GradientRequest):
    return {"result": present_value_arithmetic_gradient(req.G, req.i, req.n)}

@router.post("/arithemtic-fv")
def calc_arithmetic_fv(req: GradientRequest):
    return {"result": future_value_arithmetic_gradient(req.G, req.i, req.n)}

@router.post("/arithmetic-annuity")
def calc_arithmetic_annuity(req: GradientRequest):
    return {"result": annuity_from_arithmetic_gradient(req.G, req.i, req.n)}

@router.post("/geometric-pv")
def calc_geometric_pv(req: GradientRequest):
    return {"result": present_value_geometric_gradient(req.A1, req.g, req.i, req.n)}

@router.post("/geomtric-fv")
def calc_geometric_fv(req: GradientRequest):
    return {"result": future_value_geometric_gradient(req.A1, req.g, req.i, req.n)}

@router.post("/total-arihmetic-pv")
def calc_total_arithmetic_pv(req: GradientRequest):
    return {"result": total_present_value_arithmetic(req.A, req.G, req.i, req.n)}

@router.post("/total-geometric-pv")
def calc_total_geometric_pv(req: GradientRequest):
    return {"result": total_present_value_geometric(req.A1, req.g, req.i, req.n)}
