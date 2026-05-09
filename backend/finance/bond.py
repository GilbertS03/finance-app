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
    pv_coupons = C * ((1 + i) ** n - 1) / (i * (1 + i) ** n)
    pv_face = F / (1 + i) ** n
    return  

def coupon_payment(F: float, r: float) -> float:
    """
    Coupon payment per period
    C = F * r
    F = Face value
    r = Coupon rate per period
    """
    return F * r

def current_yield(C: float, P: float) -> float:
    """
    Current yield of a bond
    CY = C / P
    C = Annual coupon payment
    P = Current bond price
    """
    return C / P

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
    low, high = 0.0001, 1.0

    for _ in range(1000):
        mid = (low + high) / 2
        price = bond_price(F, C, mid, n)

        if abs(price - P) < precision:
            return mid
        if price > P:
            low = mid
        else:
            high = mid

    return mid

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
    price = bond_price(F, C, i, n)
    weighted_sum = 0.0

    for t in range(1, n + 1):
        if t < n:
            cf = C
        else:
            cf = C + F
        pv_cf = cf / (1 + i) ** t
        weighted_sum += t * pv_cf
    return weighted_sum / price

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
    schedule = []

    for t in range(1, n + 1):
        face_repaid = F if t == n else 0.0
        total_cf = C + face_repaid
        pv_coupon = C / (1 + i) ** t
        pv_face = face_repaid / (1 + i) ** t
        pv_total = total_cf / (1 + i) ** t

        schedule.append({
            "period" : t,
            "coupon" : round(C, 2),
            "pv_coupon" : round(pv_coupon, 2),
            "face_repaid": round(face_repaid, 2),
            "pv_face" : round(pv_face, 2),
            "total_cf" : round(total_cf, 2),
            "pv_total" : round(pv_total, 2)
        })
    return schedule
