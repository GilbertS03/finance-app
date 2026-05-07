# finance/gradients.py

import math

def present_value_arithmetic_graident(G: float, i: float, n: float) -> float:
    """
        Present Value of an Arithmetic Gradient (P/G)
        P = G * [(1 + i)^n - i*n - 1] / [i^2 * (1 + i)^n]
        G = Gradient amount (uniform increase per period)
        i = Interest rate per period
        n = Number of periods
    """
    pass

def future_value_arithmetic_gradient(G: float, i: float, n: float) -> float:
    """
        Future Value of an Arithmetic Gradient (F/G)
        F = G * [(1 + i)^n - i*n - 1] / i^2
        G = Gradient amount (uniform increase per period)
        i = Interest rate per period
        n = Number of periods
    """
    pass

def annuity_from_arithmetic_gradient(G: float, i: float, n: float) -> float:
    """
        Uniform Series given Arithmetic Gradient (A/G)
        A = G * [1/i - n / ((1 + i)^n - 1)]
        G = Gradient amount (uniform increase per period)
        i = Interest rate per period
        n = Number of periods
    """
    pass

def present_value_geometric_gradient(A1: float, g: float, i: float, n: float) -> float:
    """
        Present Value of a Geometric Gradient (P/A,g)
        When g != i:
            P = A1 * [1 - (1 + g)^n * (1 + i)^-n] / (i - g)
        When g == i:
            P = A1 * n / (1 + i)
        A1 = First period payment
        g  = Growth rate per period
        i  = Interest rate per period
        n  = Number of periods
    """
    pass

def future_value_geometric_gradient(A1: float, g: float, i: float, n: float) -> float:
    """
        Future Value of a Geometric Gradient
        When g != i:
            F = A1 * [(1 + i)^n - (1 + g)^n] / (i - g)
        When g == i:
            F = A1 * n * (1 + i)^(n-1)
        A1 = First period payment
        g  = Growth rate per period
        i  = Interest rate per period
        n  = Number of periods
    """
    pass

def total_present_value_arithmetic(A: float, G: float, i: float, n: float) -> float:
    """
        Total Present Value of Base Annuity + Arithmetic Gradient
        P_total = P_annuity + P_gradient
        A = Base uniform payment
        G = Gradient amount
        i = Interest rate per period
        n = Number of periods
    """
    pass

def total_present_value_geometric(A1: float, g: float, i: float, n: float) -> float:
    """
        Total Present Value of a Geometric Gradient Series
        This is just the geometric gradient PV since A1 is the first payment
        A1 = First period payment
        g  = Growth rate per period
        i  = Interest rate per period
        n  = Number of periods
    """
    pass

