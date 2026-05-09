# finance/savings.py

import math

def required_monthly_savings(F: float, i: float, n: float) -> float:
    """
    Required payment per period to reach a savings goal (A/F)
    A = F * i / [(1 + i)^n - 1]
    F = Savings goal (future value)
    i = Interest rate per period
    n = Number of periods
    """
    return F * i / ((1 + i) ** n - 1)

def savings_future_value(A: float, i: float, n: float) -> float:
    """
    Future value of regular savings contributions (F/A)
    F = A * [(1 + i)^n - 1] / i
    A = Payment per period
    i = Interest rate per period
    n = Number of periods
    """
    return A * ((1 + i) ** n - 1) / i

def periods_to_reach_goal(F: float, A: float, i: float) -> float:
    """
    Number of periods to reach a savings goal
    n = log(1 + (F * i / A)) / log(1 + i)
    F = Savings goal
    A = Payment per period
    i = Interest rate per period
    """
    return math.log(1 + (F * i / A)) / math.log(1 + i)

def savings_schedule(A: float, i: float, n: int) -> list[dict]:
    """
    Full savings growth schedule
    Returns a list of dicts, one per period, with:
        period            = period number
        contribution      = amount contributed this period
        interest_earned   = interest earned this period
        ending_balance    = total balance after this period
        total_contributed = cumulative contributions so far
        total_interest    = cumulative interest earned so far
    A = Payment per period
    i = Interest rate per period
    n = Number of periods
    """
    schedule = []
    balance = 0.0
    total_contributed = 0.0
    total_interest = 0.0
    
    for period in range(1, 1 + n):
        interest_earned = balance * i
        balance += interest_earned + A
        total_contributed += A
        total_interest += interest_earned

        schedule.append({
            "period" : period,
            "contribution" : round(A, 2),
            "interest_earned" : round(interest_earned, 2),
            "ending_balance" : round(balance, 2),
            "total_contributed" : round(total_contributed, 2),
            "total_interest" : round(total_interest, 2)
        })

def savings_with_initial_deposit(P: float, A: float, i: float, n: float) -> float:
    """
    Future value of savings with an initial lump sum plus regular contributions
    F = P(1 + i)^n + A * [(1 + i)^n - 1] / i
    P = Initial deposit (present value)
    A = Payment per period
    i = Interest rate per period
    n = Number of periods
    """
    from finance.tvm import future_value
    from finance.annuities import future_value_annuity
    return future_value(P, n, i) + future_value_annuity(A, n, i)

def inflation_adjusted_goal(F: float, inflation: float, n: float) -> float:
    """
    Inflation adjusted future savings goal
    F_real = F * (1 + inflation)^n
    F         = Target amount in today's dollars
    inflation = Annual inflation rate
    n         = Number of years
    """
    return F * (1 + inflation) ** n

def real_interest_rate(i: float, inflation: float) -> float:
    """
    Real interest rate adjusted for inflation (Fisher equation)
    r = (1 + i) / (1 + inflation) - 1
    i         = Nominal interest rate
    inflation = Inflation rate
    """
    return (1 + i) / (1 + inflation) - 1