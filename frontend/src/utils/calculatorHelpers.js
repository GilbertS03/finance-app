export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

export const formatPercent = (value) => `${(value * 100).toFixed(2)}%`;

export const buildFVChartData = (P, i, n) => {
  return Array.from({ length: Math.floor(n) + 1 }, (_, t) => ({
    period: t,
    value: parseFloat((P * (1 + i) ** t).toFixed(2)),
    principal: parseFloat(P.toFixed(2)),
  }));
};

export const buildPVChartData = (F, i, n) => {
  return Array.from({ length: Math.floor(n) + 1 }, (_, t) => ({
    period: t,
    value: parseFloat((F / (1 + i) ** (n - t)).toFixed(2)),
    future: parseFloat(F.toFixed(2)),
  }));
};