# finance/annuities.py

import math

def future_value_annuity(A: float, n: float, i: float) -> float:
    """
        Future Value given a Uniform Series (F|A)
        F = A * [(1+ i) ^ n - 1] / i
        A = Uniform payment amount per period
        i = Interest Rate per Period
        n = Number of Periods
    """
    return A * ((1 + i)** n - 1) / i

def present_value_annuity(A: float, n: float, i: float) -> float:
    """
        Present Value given a Uniform Series (P|A) - Present Worth Factor
        P = A * [(1 + i) ^ n - 1] / [i * (1 + i) ^ n]
        A = Uniform payment amount per period
        i = Interest Rate per Period
        n = Number of Periods
    """
    return A * ((1 + i)** n - 1)/ (i * (1 + i) ** n)

def annuity_from_future_value(F: float, n: float, i: float) -> float:
    """
        Uniform Series given Future Value (A|F) - Sinking Fund Factor
        A = F * i / [(1 + i) ^ n - 1]
        F = Future Worth
        i = Interest rate
        n = Number of Periods
    """
    return F * i / ((1 + i) ** n - 1)

def annuity_from_present_value(P: float, n: float, i: float) -> float:
    """
        Uniform Series given Present Value (A|P) - Capital Recovery Factor
        A = P * [(i * (1 + i) ^ n)] / [(1 + i) ^ n - 1]
        P = Present Worth
        i = Interest rate
        n = Number of Periods
    """
    return P * (i * (1 + i) ** n) / ((1 + i) ** n - 1)

def periods_from_present_value_annuity(P: float, A: float, i: float) -> float: 
    """
        Number of periods given Present Value and Annuity (n given P/A)
        n = -log(1 - (P * i / A)) / log(1 + i)
        P = Present value
        A = Uniform payment amount per period
        i = Interest rate per period
    """
    return -math.log(1 - (P * i / A)) / math.log(1 + i)

def periods_from_future_value_annuity(F: float, A: float, i: float) -> float:
    """
        Number of periods given Future Value and Annuity (n given F/A)
        n = log(1 + (F * i / A)) / log(1 + i)
        F = Future value
        A = Uniform payment amount per period
        i = Interest rate per period
    """
    return math.log((F *i / A) + 1) / math.log(1 + i)

def perpetuity_present_value(A: float, i: float) -> float:
    """
        Present Value of a Perpetuity (infinite uniform series)
        P = A / i
        A = Uniform payment amount per period
        i = Interest rate per period
    """
    return A / i