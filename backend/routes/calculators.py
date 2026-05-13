# routes/calculators.py

from fastapi import APIRouter
from finance.time_value import (
    future_value, present_value, interest_rate,
    periods, effective_interest_rate, continuous_compounding_fv
)
from finance.annuities import (
    future_value_annuity, present_value_annuity,
    annuity_from_future_value, annuity_from_present_value,
    periods_from_present_value_annuity, periods_from_future_value_annuity,
    perpetuity_present_value
)
from finance.gradients import (
    present_value_arithmetic_gradient, future_value_arithmetic_gradient,
    annuity_from_arithmetic_gradient, present_value_geometric_gradient,
    future_value_geometric_gradient, total_present_value_arithmetic,
    total_present_value_geometric
)
from finance.loan import (
    monthly_payment, total_payment, total_interest,
    amortization_schedule, max_loan_amount, remaining_balance
)
from finance.bond import (
    bond_price, coupon_payment, current_yield,
    yield_to_maturity, bond_duration, bond_schedule
)
from finance.savings import (
    required_monthly_savings, savings_future_value,
    periods_to_reach_goal, savings_schedule,
    savings_with_initial_deposit, inflation_adjusted_goal,
    real_interest_rate
)
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/calc", tags=["calculators"])