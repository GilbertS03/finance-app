// pages/calculators/Annuities.jsx
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Tab,
  Tabs,
} from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  calcAnnuityFV,
  calcAnnuityPV,
  calcAnnuityFromFV,
  calcAnnuityFromPV,
  calcPeriodsFromPV,
  calcPeriodsFromFV,
  calcPerpetuity,
} from "../../services/calculatorService";
import { saveScenario } from "../../services/scenarioService";
import { useAuth } from "../../context/AuthContext";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

const CustomTooltip = ({ active, payload, label }) => {
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

// ── Save Block ────────────────────────────────────────────────────────────────

function SaveBlock({ calculatorType, inputValues, result, onError }) {
  const [scenarioName, setScenarioName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveScenario({
        scenario_name: scenarioName || null,
        calculator_type: calculatorType,
        input_values: inputValues,
        calculated_result: { result },
      });
      setSaved(true);
    } catch {
      onError("Failed to save scenario.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="shadow-sm mt-4">
      <Card.Body>
        <Card.Title className="fs-6 fw-semibold mb-3">Save Scenario</Card.Title>
        {saved ? (
          <Alert variant="success" className="mb-0">
            Scenario saved successfully!
          </Alert>
        ) : (
          <Row className="g-2 align-items-end">
            <Col>
              <Form.Control
                type="text"
                placeholder="Scenario name (optional)"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
              />
            </Col>
            <Col xs="auto">
              <Button
                variant="outline-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
}

// ── Result Card ───────────────────────────────────────────────────────────────

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

// ── FV Annuity ────────────────────────────────────────────────────────────────

function AnnuityFV() {
  const [A, setA] = useState("");
  const [i, setI] = useState("");
  const [n, setN] = useState("");
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await calcAnnuityFV(
        parseFloat(A),
        parseFloat(i) / 100,
        parseFloat(n),
      );
      setResult(data.result);
      setChartData(
        Array.from({ length: Math.floor(parseFloat(n)) + 1 }, (_, t) => ({
          period: t,
          value: parseFloat(
            (
              parseFloat(A) *
              (((1 + parseFloat(i) / 100) ** t - 1) / (parseFloat(i) / 100))
            ).toFixed(2),
          ),
        })),
      );
    } catch {
      setError("Calculation failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="g-4">
      <Col md={4}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="fs-6 fw-semibold mb-3">Inputs</Card.Title>
            <Form onSubmit={handleCalculate}>
              <Form.Group className="mb-3">
                <Form.Label>Payment per Period (A)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 500"
                  value={A}
                  onChange={(e) => setA(e.target.value)}
                  min="0"
                  step="any"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Interest Rate per Period (%)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 5"
                  value={i}
                  onChange={(e) => setI(e.target.value)}
                  min="0"
                  step="any"
                  required
                />
                <Form.Text className="text-muted">
                  Enter as percentage, e.g. 5 for 5%
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Number of Periods (n)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 10"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  min="1"
                  step="any"
                  required
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Calculating..." : "Calculate"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={8}>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {result !== null && (
          <>
            <ResultCard
              label="Future Value of Annuity"
              value={result}
              stats={[
                { label: "Payment", value: formatCurrency(parseFloat(A)) },
                {
                  label: "Total contributed",
                  value: formatCurrency(parseFloat(A) * parseFloat(n)),
                },
                {
                  label: "Interest earned",
                  value: formatCurrency(result - parseFloat(A) * parseFloat(n)),
                },
              ]}
            />
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title className="fs-6 fw-semibold mb-3">
                  Accumulated Value Over Time
                </Card.Title>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                    <YAxis
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Future Value"
                      stroke="#0d6efd"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
            <SaveBlock
              calculatorType="annuity_fv"
              inputValues={{
                A: parseFloat(A),
                i: parseFloat(i),
                n: parseFloat(n),
              }}
              result={result}
              onError={setError}
            />
          </>
        )}
        {result === null && !error && (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            <p>Enter values and calculate to see results</p>
          </div>
        )}
      </Col>
    </Row>
  );
}

// ── PV Annuity ────────────────────────────────────────────────────────────────

function AnnuityPV() {
  const [A, setA] = useState("");
  const [i, setI] = useState("");
  const [n, setN] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await calcAnnuityPV(
        parseFloat(A),
        parseFloat(i) / 100,
        parseFloat(n),
      );
      setResult(data.result);
    } catch {
      setError("Calculation failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="g-4">
      <Col md={4}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="fs-6 fw-semibold mb-3">Inputs</Card.Title>
            <Form onSubmit={handleCalculate}>
              <Form.Group className="mb-3">
                <Form.Label>Payment per Period (A)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 500"
                  value={A}
                  onChange={(e) => setA(e.target.value)}
                  min="0"
                  step="any"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Interest Rate per Period (%)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 5"
                  value={i}
                  onChange={(e) => setI(e.target.value)}
                  min="0"
                  step="any"
                  required
                />
                <Form.Text className="text-muted">
                  Enter as percentage, e.g. 5 for 5%
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Number of Periods (n)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 10"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  min="1"
                  step="any"
                  required
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Calculating..." : "Calculate"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={8}>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {result !== null && (
          <>
            <ResultCard
              label="Present Value of Annuity"
              value={result}
              stats={[
                { label: "Payment", value: formatCurrency(parseFloat(A)) },
                {
                  label: "Total payments",
                  value: formatCurrency(parseFloat(A) * parseFloat(n)),
                },
                {
                  label: "Discount",
                  value: formatCurrency(parseFloat(A) * parseFloat(n) - result),
                },
              ]}
            />
            <SaveBlock
              calculatorType="annuity_pv"
              inputValues={{
                A: parseFloat(A),
                i: parseFloat(i),
                n: parseFloat(n),
              }}
              result={result}
              onError={setError}
            />
          </>
        )}
        {result === null && !error && (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            <p>Enter values and calculate to see results</p>
          </div>
        )}
      </Col>
    </Row>
  );
}

// ── A from FV ─────────────────────────────────────────────────────────────────

function AnnuityFromFV() {
  const [F, setF] = useState("");
  const [i, setI] = useState("");
  const [n, setN] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await calcAnnuityFromFV(
        parseFloat(F),
        parseFloat(i) / 100,
        parseFloat(n),
      );
      setResult(data.result);
    } catch {
      setError("Calculation failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="g-4">
      <Col md={4}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="fs-6 fw-semibold mb-3">Inputs</Card.Title>
            <Form onSubmit={handleCalculate}>
              <Form.Group className="mb-3">
                <Form.Label>Future Value (F)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 10000"
                  value={F}
                  onChange={(e) => setF(e.target.value)}
                  min="0"
                  step="any"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Interest Rate per Period (%)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 5"
                  value={i}
                  onChange={(e) => setI(e.target.value)}
                  min="0"
                  step="any"
                  required
                />
                <Form.Text className="text-muted">
                  Enter as percentage, e.g. 5 for 5%
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Number of Periods (n)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 10"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  min="1"
                  step="any"
                  required
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Calculating..." : "Calculate"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={8}>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {result !== null && (
          <>
            <ResultCard
              label="Required Payment per Period (A/F)"
              value={result}
              stats={[
                { label: "Future Value", value: formatCurrency(parseFloat(F)) },
                {
                  label: "Total contributed",
                  value: formatCurrency(result * parseFloat(n)),
                },
                {
                  label: "Interest earned",
                  value: formatCurrency(parseFloat(F) - result * parseFloat(n)),
                },
              ]}
            />
            <SaveBlock
              calculatorType="annuity_from_fv"
              inputValues={{
                F: parseFloat(F),
                i: parseFloat(i),
                n: parseFloat(n),
              }}
              result={result}
              onError={setError}
            />
          </>
        )}
        {result === null && !error && (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            <p>Enter values and calculate to see results</p>
          </div>
        )}
      </Col>
    </Row>
  );
}

// ── A from PV ─────────────────────────────────────────────────────────────────

function AnnuityFromPV() {
  const [P, setP] = useState("");
  const [i, setI] = useState("");
  const [n, setN] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await calcAnnuityFromPV(
        parseFloat(P),
        parseFloat(i) / 100,
        parseFloat(n),
      );
      setResult(data.result);
    } catch {
      setError("Calculation failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="g-4">
      <Col md={4}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="fs-6 fw-semibold mb-3">Inputs</Card.Title>
            <Form onSubmit={handleCalculate}>
              <Form.Group className="mb-3">
                <Form.Label>Present Value (P)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 10000"
                  value={P}
                  onChange={(e) => setP(e.target.value)}
                  min="0"
                  step="any"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Interest Rate per Period (%)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 5"
                  value={i}
                  onChange={(e) => setI(e.target.value)}
                  min="0"
                  step="any"
                  required
                />
                <Form.Text className="text-muted">
                  Enter as percentage, e.g. 5 for 5%
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Number of Periods (n)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 10"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  min="1"
                  step="any"
                  required
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Calculating..." : "Calculate"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={8}>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {result !== null && (
          <>
            <ResultCard
              label="Required Payment per Period (A/P)"
              value={result}
              stats={[
                {
                  label: "Present Value",
                  value: formatCurrency(parseFloat(P)),
                },
                {
                  label: "Total payments",
                  value: formatCurrency(result * parseFloat(n)),
                },
                {
                  label: "Interest paid",
                  value: formatCurrency(result * parseFloat(n) - parseFloat(P)),
                },
              ]}
            />
            <SaveBlock
              calculatorType="annuity_from_pv"
              inputValues={{
                P: parseFloat(P),
                i: parseFloat(i),
                n: parseFloat(n),
              }}
              result={result}
              onError={setError}
            />
          </>
        )}
        {result === null && !error && (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            <p>Enter values and calculate to see results</p>
          </div>
        )}
      </Col>
    </Row>
  );
}

// ── Periods from PV ───────────────────────────────────────────────────────────

function PeriodsFromPV() {
  const [P, setP] = useState("");
  const [A, setA] = useState("");
  const [i, setI] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await calcPeriodsFromPV(
        parseFloat(P),
        parseFloat(A),
        parseFloat(i) / 100,
      );
      setResult(data.result);
    } catch {
      setError(
        "Calculation failed. Check that your payment is large enough to cover interest.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="g-4">
      <Col md={4}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="fs-6 fw-semibold mb-3">Inputs</Card.Title>
            <Form onSubmit={handleCalculate}>
              <Form.Group className="mb-3">
                <Form.Label>Present Value (P)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 10000"
                  value={P}
                  onChange={(e) => setP(e.target.value)}
                  min="0"
                  step="any"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Payment per Period (A)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 500"
                  value={A}
                  onChange={(e) => setA(e.target.value)}
                  min="0"
                  step="any"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Interest Rate per Period (%)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 5"
                  value={i}
                  onChange={(e) => setI(e.target.value)}
                  min="0"
                  step="any"
                  required
                />
                <Form.Text className="text-muted">
                  Enter as percentage, e.g. 5 for 5%
                </Form.Text>
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Calculating..." : "Calculate"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={8}>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {result !== null && (
          <>
            <ResultCard
              label="Number of Periods (n)"
              value={`${result} periods`}
              stats={[
                {
                  label: "Present Value",
                  value: formatCurrency(parseFloat(P)),
                },
                { label: "Payment", value: formatCurrency(parseFloat(A)) },
                {
                  label: "Total paid",
                  value: formatCurrency(parseFloat(A) * result),
                },
              ]}
            />
            <SaveBlock
              calculatorType="annuity_periods_from_pv"
              inputValues={{
                P: parseFloat(P),
                A: parseFloat(A),
                i: parseFloat(i),
              }}
              result={result}
              onError={setError}
            />
          </>
        )}
        {result === null && !error && (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            <p>Enter values and calculate to see results</p>
          </div>
        )}
      </Col>
    </Row>
  );
}

// ── Periods from FV ───────────────────────────────────────────────────────────

function PeriodsFromFV() {
  const [F, setF] = useState("");
  const [A, setA] = useState("");
  const [i, setI] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await calcPeriodsFromFV(
        parseFloat(F),
        parseFloat(A),
        parseFloat(i) / 100,
      );
      setResult(data.result);
    } catch {
      setError("Calculation failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="g-4">
      <Col md={4}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="fs-6 fw-semibold mb-3">Inputs</Card.Title>
            <Form onSubmit={handleCalculate}>
              <Form.Group className="mb-3">
                <Form.Label>Future Value (F)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 50000"
                  value={F}
                  onChange={(e) => setF(e.target.value)}
                  min="0"
                  step="any"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Payment per Period (A)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 500"
                  value={A}
                  onChange={(e) => setA(e.target.value)}
                  min="0"
                  step="any"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Interest Rate per Period (%)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 5"
                  value={i}
                  onChange={(e) => setI(e.target.value)}
                  min="0"
                  step="any"
                  required
                />
                <Form.Text className="text-muted">
                  Enter as percentage, e.g. 5 for 5%
                </Form.Text>
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Calculating..." : "Calculate"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={8}>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {result !== null && (
          <>
            <ResultCard
              label="Number of Periods (n)"
              value={`${result} periods`}
              stats={[
                { label: "Future Value", value: formatCurrency(parseFloat(F)) },
                { label: "Payment", value: formatCurrency(parseFloat(A)) },
                {
                  label: "Total contributed",
                  value: formatCurrency(parseFloat(A) * result),
                },
              ]}
            />
            <SaveBlock
              calculatorType="annuity_periods_from_fv"
              inputValues={{
                F: parseFloat(F),
                A: parseFloat(A),
                i: parseFloat(i),
              }}
              result={result}
              onError={setError}
            />
          </>
        )}
        {result === null && !error && (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            <p>Enter values and calculate to see results</p>
          </div>
        )}
      </Col>
    </Row>
  );
}

// ── Perpetuity ────────────────────────────────────────────────────────────────

function Perpetuity() {
  const [A, setA] = useState("");
  const [i, setI] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await calcPerpetuity(parseFloat(A), parseFloat(i) / 100);
      setResult(data.result);
    } catch {
      setError("Calculation failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="g-4">
      <Col md={4}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="fs-6 fw-semibold mb-3">Inputs</Card.Title>
            <Form onSubmit={handleCalculate}>
              <Form.Group className="mb-3">
                <Form.Label>Payment per Period (A)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 500"
                  value={A}
                  onChange={(e) => setA(e.target.value)}
                  min="0"
                  step="any"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Interest Rate per Period (%)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 5"
                  value={i}
                  onChange={(e) => setI(e.target.value)}
                  min="0"
                  step="any"
                  required
                />
                <Form.Text className="text-muted">
                  Enter as percentage, e.g. 5 for 5%
                </Form.Text>
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Calculating..." : "Calculate"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={8}>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {result !== null && (
          <>
            <ResultCard
              label="Present Value of Perpetuity"
              value={result}
              stats={[
                { label: "Payment", value: formatCurrency(parseFloat(A)) },
                { label: "Rate", value: `${parseFloat(i)}%` },
                {
                  label: "Annual income",
                  value: formatCurrency(parseFloat(A)),
                },
              ]}
            />
            <SaveBlock
              calculatorType="perpetuity"
              inputValues={{ A: parseFloat(A), i: parseFloat(i) }}
              result={result}
              onError={setError}
            />
          </>
        )}
        {result === null && !error && (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            <p>Enter values and calculate to see results</p>
          </div>
        )}
      </Col>
    </Row>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function Annuities() {
  return (
    <Container className="py-5">
      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Annuities</h4>
        <p className="text-muted mb-0">
          Analyze uniform payment series — solve for future value, present
          value, payment amount, or number of periods.
        </p>
      </div>

      <Tabs defaultActiveKey="fv" className="mb-4">
        <Tab eventKey="fv" title="F/A — Future Value">
          <AnnuityFV />
        </Tab>
        <Tab eventKey="pv" title="P/A — Present Value">
          <AnnuityPV />
        </Tab>
        <Tab eventKey="afv" title="A/F — Payment from FV">
          <AnnuityFromFV />
        </Tab>
        <Tab eventKey="apv" title="A/P — Payment from PV">
          <AnnuityFromPV />
        </Tab>
        <Tab eventKey="nfpv" title="n from P/A">
          <PeriodsFromPV />
        </Tab>
        <Tab eventKey="nffv" title="n from F/A">
          <PeriodsFromFV />
        </Tab>
        <Tab eventKey="perp" title="Perpetuity">
          <Perpetuity />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default Annuities;
