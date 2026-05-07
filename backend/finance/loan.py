# /finance/loan.py

def monthly_payment(P: float, i: float, n: float) -> float:
    """
        Monthly Payment given Loan Amount (A/P)
        A = P * [i(1 + i)^n] / [(1 + i)^n - 1]
        P = Loan principal
        i = Interest rate per period
        n = Number of periods
    """
    pass

def total_payment(A: float, n: float) -> float:
    """
        Total amount paid over life of loan
        Total = A * n
        A = Payment per period
        n = Number of periods
    """
    pass

def total_interest(P: float, A: float, n: float) -> float:
    """
        Total interest paid over life of loan
        Interest = (A * n) - P
        P = Loan principal
        A = Payment per period
        n = Number of periods
    """
    pass

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
    pass

def max_loan_amount(A: float, i: float, n: float) -> float:
    """
        Maximum loan amount given desired payment (P/A)
        P = A * [(1 + i)^n - 1] / [i(1 + i)^n]
        A = Desired payment per period
        i = Interest rate per period
        n = Number of periods
    """
    pass

def remaining_balance(P: float, i: float, n: int, periods_paid: int) -> float:
    """
        Remaining balance after k payments
        B = P(1 + i)^k - A * [(1 + i)^k - 1] / i
        P             = Original loan principal
        i             = Interest rate per period
        n             = Total number of periods
        periods_paid  = Number of payments already made
    """
    pass
