import { formatCurrency } from "../../utils/calculatorHelpers";
import { Card } from "react-bootstrap";
function ResultCard({ label, value, stats }) {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <p className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
          {label}
        </p>
        <h3 className="fw-bold text-primary mb-0">
          {typeof value === "number" && !isNaN(value)
            ? Number.isInteger(value)
              ? value
              : formatCurrency(value)
            : value}
        </h3>
        {stats && (
          <div
            className="d-flex gap-3 mt-2 flex-wrap"
            style={{ fontSize: "0.85rem" }}
          >
            {stats.map((s, i) => (
              <span key={i} className="text-muted">
                {s.label}: <strong>{s.value}</strong>
              </span>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default ResultCard;
