import { formatCurrency } from "../../utils/calculatorHelpers";

export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="bg-white border rounded shadow-sm p-2"
        style={{ fontSize: "0.85rem" }}
      >
        <p className="mb-1 fw-semibold">Period {label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="mb-0" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
