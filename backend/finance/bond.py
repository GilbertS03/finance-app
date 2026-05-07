# /finance/bond.py

import math

def bond_price(F: float, C: float, i: float, n: int) -> float:
    """
    Price of a bond given yield to maturity
    P = C * [(1 + i)^n - 1] / [i(1 + i)^n] + F / (1 + i)^n
    F = Face value (par value)
    C = Coupon payment per period
    i = Yield to maturity per period
    n = Number of periods
    """
    pass
def coupon_payment(F: float, r: float) -> float:
    """
    Coupon payment per period
    C = F * r
    F = Face value
    r = Coupon rate per period
    """
    pass

def current_yield(C: float, P: float) -> float:
    """
    Current yield of a bond
    CY = C / P
    C = Annual coupon payment
    P = Current bond price
    """
    pass

def yield_to_maturity(F: float, C: float, P: float, n: int, precision: float = 1e-6) -> float:
    """
    Yield to Maturity using bisection method
    Finds i such that bond_price(F, C, i, n) == P
    F         = Face value
    C         = Coupon payment per period
    P         = Current bond price
    n         = Number of periods
    precision = Acceptable margin of error
    """
    pass

def bond_duration(F: float, C: float, i: float, n: int) -> float:
    """
    Macaulay Duration of a bond
    Weighted average time to receive cash flows
    D = [sum of t * PV(CF_t)] / Bond Price
    F = Face value
    C = Coupon payment per period
    i = Yield to maturity per period
    n = Number of periods
    """
    pass

def bond_schedule(F: float, C: float, i: float, n: int) -> list[dict]:
    """
    Full bond cash flow schedule
    Returns a list of dicts, one per period, with:
        period        = period number
        coupon        = coupon payment
        pv_coupon     = present value of coupon
        face_repaid   = face value repaid (only on last period)
        pv_face       = present value of face repaid
        total_cf      = total cash flow for period
        pv_total      = present value of total cash flow
    F = Face value
    C = Coupon payment per period
    i = Yield to maturity per period
    n = Number of periods
    """
    pass