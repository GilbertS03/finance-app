# schemas/calculators.py

from pydantic import BaseModel
from typing import Optional

class TimeValueRequest(BaseModel):
    P: Optional[float] = None
    F: Optional[float] = None
    i: float
    n: float

class EffectiveRateRequest(BaseModel):
    r: float
    m: int

class ContinuousRequest(BaseModel):
    P: float
    r: float
    n: float

class AnnuityRequest(BaseModel):
    A: Optional[float] = None
    P: Optional[float] = None
    F: Optional[float] = None
    i: float
    n: Optional[float] = None

class GradientRequest(BaseModel):
    A: Optional[float] = None
    G: Optional[float] = None
    A1: Optional[float] = None
    g: Optional[float] = None
    i: float
    n: float

class LoanRequest(BaseModel):
    P: float
    i: float
    n: int

class MaxLoanRequest(BaseModel):
    A: float
    i: float
    n: float

class RemainingBalanceRequest(BaseModel):
    P: float
    i: float
    n: int
    periods_paid: int

class BondRequest(BaseModel):
    F: float
    C: Optional[float] = None
    r: Optional[float] = None
    i: float
    n: int

class YTMRequest(BaseModel):
    F: float
    C: float
    P: float
    n: int

class SavingsRequest(BaseModel):
    A: Optional[float] = None
    F: Optional[float] = None
    P: Optional[float] = None
    i: float
    n: Optional[float] = None

class InflationRequest(BaseModel):
    F: float
    inflation: float
    n: float

class RealRateRequest(BaseModel):
    i: float
    inflation: float