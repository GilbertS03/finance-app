// services/calculatorService.js

import api from '../api/api'

// Time Value
export const calcFutureValue = async (P, i, n) => {
  const response = await api.post('/calc/time-value/future-value', { P, i, n })
  return response.data
}

export const calcPresentValue = async (F, i, n) => {
  const response = await api.post('/calc/time-value/present-value', { F, i, n })
  return response.data
}

export const calcInterestRate = async (P, F, n) => {
  const response = await api.post('/calc/time-value/interest-rate', { P, F, n })
  return response.data
}

export const calcPeriods = async (P, F, i) => {
  const response = await api.post('/calc/time-value/periods', { P, F, i })
  return response.data
}

export const calcEffectiveRate = async (r, m) => {
  const response = await api.post('/calc/time-value/effective-rate', { r, m })
  return response.data
}

export const calcContinuousCompounding = async (P, r, n) => {
  const response = await api.post('/calc/time-value/continuous-compounding', { P, r, n })
  return response.data
}

// Annuities
export const calcAnnuityFV = async (A, i, n) => {
  const response = await api.post('/calc/annuities/fv', { A, i, n })
  return response.data
}

export const calcAnnuityPV = async (A, i, n) => {
  const response = await api.post('/calc/annuities/pv', { A, i, n })
  return response.data
}

export const calcAnnuityFromFV = async (F, i, n) => {
  const response = await api.post('/calc/annuities/from-fv', { F, i, n })
  return response.data
}

export const calcAnnuityFromPV = async (P, i, n) => {
  const response = await api.post('/calc/annuities/from-pv', { P, i, n })
  return response.data
}

export const calcPeriodsFromPV = async (P, A, i) => {
  const response = await api.post('/calc/annuities/periods-from-pv', { P, A, i })
  return response.data
}

export const calcPeriodsFromFV = async (F, A, i) => {
  const response = await api.post('/calc/annuities/periods-from-fv', { F, A, i })
  return response.data
}

export const calcPerpetuity = async (A, i) => {
  const response = await api.post('/calc/annuities/perpetuity', { A, i })
  return response.data
}

// Gradients
export const calcArithmeticPV = async (G, i, n) => {
  const response = await api.post('/calc/gradients/arithmetic-pv', { G, i, n })
  return response.data
}

export const calcArithmeticFV = async (G, i, n) => {
  const response = await api.post('/calc/gradients/arithmetic-fv', { G, i, n })
  return response.data
}

export const calcArithmeticAnnuity = async (G, i, n) => {
  const response = await api.post('/calc/gradients/arithmetic-annuity', { G, i, n })
  return response.data
}

export const calcGeometricPV = async (A1, g, i, n) => {
  const response = await api.post('/calc/gradients/geometric-pv', { A1, g, i, n })
  return response.data
}

export const calcGeometricFV = async (A1, g, i, n) => {
  const response = await api.post('/calc/gradients/geometric-fv', { A1, g, i, n })
  return response.data
}

export const calcTotalArithmeticPV = async (A, G, i, n) => {
  const response = await api.post('/calc/gradients/total-arithmetic-pv', { A, G, i, n })
  return response.data
}

export const calcTotalGeometricPV = async (A1, g, i, n) => {
  const response = await api.post('/calc/gradients/total-geometric-pv', { A1, g, i, n })
  return response.data
}

// Loan
export const calcLoanPayment = async (P, i, n) => {
  const response = await api.post('/calc/loan/payment', { P, i, n })
  return response.data
}

export const calcLoanSchedule = async (P, i, n) => {
  const response = await api.post('/calc/loan/schedule', { P, i, n })
  return response.data
}

export const calcMaxLoan = async (A, i, n) => {
  const response = await api.post('/calc/loan/max-amount', { A, i, n })
  return response.data
}

export const calcRemainingBalance = async (P, i, n, periods_paid) => {
  const response = await api.post('/calc/loan/remaining-balance', { P, i, n, periods_paid })
  return response.data
}

// Bond
export const calcBondPrice = async (F, i, n, C = null, r = null) => {
  const response = await api.post('/calc/bond/price', { F, i, n, C, r })
  return response.data
}

export const calcCurrentYield = async (F, i, n, C = null, r = null) => {
  const response = await api.post('/calc/bond/current-yield', { F, i, n, C, r })
  return response.data
}

export const calcYTM = async (F, C, P, n) => {
  const response = await api.post('/calc/bond/ytm', { F, C, P, n })
  return response.data
}

export const calcBondDuration = async (F, i, n, C = null, r = null) => {
  const response = await api.post('/calc/bond/duration', { F, i, n, C, r })
  return response.data
}

export const calcBondSchedule = async (F, i, n, C = null, r = null) => {
  const response = await api.post('/calc/bond/schedule', { F, i, n, C, r })
  return response.data
}

// Savings
export const calcRequiredSavings = async (F, i, n) => {
  const response = await api.post('/calc/savings/required-payment', { F, i, n })
  return response.data
}

export const calcSavingsFV = async (A, i, n) => {
  const response = await api.post('/calc/savings/future-value', { A, i, n })
  return response.data
}

export const calcPeriodsToGoal = async (F, A, i) => {
  const response = await api.post('/calc/savings/periods-to-goal', { F, A, i })
  return response.data
}

export const calcSavingsSchedule = async (A, i, n) => {
  const response = await api.post('/calc/savings/schedule', { A, i, n })
  return response.data
}

export const calcSavingsWithDeposit = async (P, A, i, n) => {
  const response = await api.post('/calc/savings/with-initial-deposit', { P, A, i, n })
  return response.data
}

export const calcInflationGoal = async (F, inflation, n) => {
  const response = await api.post('/calc/savings/inflation-adjusted-goal', { F, inflation, n })
  return response.data
}

export const calcRealRate = async (i, inflation) => {
  const response = await api.post('/calc/savings/real-rate', { i, inflation })
  return response.data
}