# /finance/loan.py

def monthly_payment(P: float, i: float, n: float) -> float:
    """
        Monthly Payment given Loan Amount (A/P)
        A = P * [i(1 + i)^n] / [(1 + i)^n - 1]
        P = Loan principal
        i = Interest rate per period
        n = Number of periods
    """
    return P * (i * (1 + i) ** n) / ((1 +i) ** n - 1)

def total_payment(A: float, n: float) -> float:
    """
        Total amount paid over life of loan
        Total = A * n
        A = Payment per period
        n = Number of periods
    """
    return A * n

def total_interest(P: float, A: float, n: float) -> float:
    """
        Total interest paid over life of loan
        Interest = (A * n) - P
        P = Loan principal
        A = Payment per period
        n = Number of periods
    """
    return (A * n) - P

def amortization_schedule(P: float, i: float, n: int) -> list[dict]:
    """
        Full amortization schedule for a loan
        Returns a list of dicts, one per period, with:
            period          = period number
            payment         = fixed payment amount
            principal_paid  = portion of payment going to principal
            interest_paid   = portion of payment going to interest
            ending_balance  = remaining balance after payment
        P = Loan principal
        i = Interest rate per period
        n = Number of periods
    """
    A = monthly_payment(P, i, n)
    schedule = []
    balance = P

    for period in range(1, n + 1):
        interest_paid = balance * i
        principal_paid = A - interest_paid
        balance -= principal_paid

        if period == n and abs(balance) < 0.01:
            balance = 0.0
        
        schedule.append({
            "period" : period,
            "payment" : round(A, 2),
            "principal_paid" : round(principal_paid, 2),
            "interest_paid" : round(interest_paid, 2),
            "ending_balance" : round(max(balance, 0.0), 2)
        })
    return schedule

def max_loan_amount(A: float, i: float, n: float) -> float:
    """
        Maximum loan amount given desired payment (P/A)
        P = A * [(1 + i)^n - 1] / [i(1 + i)^n]
        A = Desired payment per period
        i = Interest rate per period
        n = Number of periods
    """
    return A * ((1 + i) ** n - 1) / (i * (1 + i) ** n)

def remaining_balance(P: float, i: float, n: int, periods_paid: int) -> float:
    """
        Remaining balance after k payments
        B = P(1 + i)^k - A * [(1 + i)^k - 1] / i
        P             = Original loan principal
        i             = Interest rate per period
        n             = Total number of periods
        periods_paid  = Number of payments already made
    """
    A = monthly_payment(P, i, n)
    return P * (1 + i) ** periods_paid - A * ((1 + i) ** periods_paid - 1) / i
