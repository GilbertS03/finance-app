# /finance/tvm.py

def present_value(F: float, n: float, i: float) -> float:
    """ 
        This is the Present value given a future value
        Such as P = F(1+i)^-n
        P = Present Value
        F = Future Value
        n = number of periods
        i = effective interest rate per period
    """
    return F * (1 + i) ** -n

def future_value(P: float, n: float, i: float) -> float:
    """ 
        This is the Future value given a future value
        Such as F = P(1+i)^n
        F = Future Value
        P = Present Value
        n = number of periods
        i = effective interest rate per period
    """
    return P * (1 + i) ** n

def interest_rate(P: float, F: float, n: float) -> float:
    """
        Interest Rate given Present and Future Value
        i = (F/P)^(1/n) - 1
        P = Present Value
        F = Future Value
        n = number of periods
    """
    return ((F/P)**(1/n)) - 1

def periods(P: float, F: float, i: float):
    """
        Number of periods given Present and Future Value
        n = log(F/P)/log(1+i)
        P = Present Value
        F = Future Value
        i = interest rate per period
    """
    import math
    return math.log(F/P)/ math.log(1 + i)

def effective_interest_rate(r: float, m: int) -> float:
    """
        Effective annual interest rate given nominal rate
        i_eff = (1 + r/m)^m -1
        r = nominal interest rate
        m = number of compounding periods per year
    """
    return ((1 + (r/m))**m) - 1

def continuous_compounding_fv(P: float, r: float, n: float) -> float:
    """
        Future Value with continous compounding
        F = Pe^(rn)
        P = Present Value
        r = nominal rate
        n = number of periods
    """
    import math
    return P * math.e**(r*n)