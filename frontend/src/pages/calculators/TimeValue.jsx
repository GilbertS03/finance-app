// pages/calculators/TimeValue.jsx
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
  Badge,
} from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  calcFutureValue,
  calcPresentValue,
} from "../../services/calculatorService";
import { saveScenario } from "../../services/scenarioService";
import { useAuth } from "../../context/AuthContext";

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

const formatPercent = (value) => `${(value * 100).toFixed(2)}%`;

const buildFVChartData = (P, i, n) => {
  return Array.from({ length: Math.floor(n) + 1 }, (_, t) => ({
    period: t,
    value: parseFloat((P * (1 + i) ** t).toFixed(2)),
    principal: parseFloat(P.toFixed(2)),
  }));
};

const buildPVChartData = (F, i, n) => {
  return Array.from({ length: Math.floor(n) + 1 }, (_, t) => ({
    period: t,
    value: parseFloat((F / (1 + i) ** (n - t)).toFixed(2)),
    future: parseFloat(F.toFixed(2)),
  }));
};

// ── Custom Tooltip ────────────────────────────────────────────────────────────

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

// ── FV Calculator ─────────────────────────────────────────────────────────────

function FutureValueCalc() {
  const [P, setP] = useState("");
  const [i, setI] = useState("");
  const [n, setN] = useState("");
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [scenarioName, setScenarioName] = useState("");

  const { user } = useAuth();

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setSaved(false);
    setLoading(true);

    try {
      const data = await calcFutureValue(
        parseFloat(P),
        parseFloat(i) / 100,
        parseFloat(n),
      );
      setResult(data.result);
      setChartData(
        buildFVChartData(parseFloat(P), parseFloat(i) / 100, parseFloat(n)),
      );
    } catch (err) {
      setError("Calculation failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveScenario({
        scenario_name: scenarioName || null,
        calculator_type: "future_value",
        input_values: { P: parseFloat(P), i: parseFloat(i), n: parseFloat(n) },
        calculated_result: { result },
      });
      setSaved(true);
    } catch (err) {
      setError("Failed to save scenario.");
    } finally {
      setSaving(false);
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
                  placeholder="e.g. 1000"
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
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <p className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
                  Future Value
                </p>
                <h3 className="fw-bold text-primary mb-0">
                  {formatCurrency(result)}
                </h3>
                <div
                  className="d-flex gap-3 mt-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  <span className="text-muted">
                    Principal: <strong>{formatCurrency(parseFloat(P))}</strong>
                  </span>
                  <span className="text-muted">
                    Interest earned:{" "}
                    <strong>{formatCurrency(result - parseFloat(P))}</strong>
                  </span>
                  <span className="text-muted">
                    Rate: <strong>{formatPercent(parseFloat(i) / 100)}</strong>
                  </span>
                </div>
              </Card.Body>
            </Card>

            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title className="fs-6 fw-semibold mb-3">
                  Growth Over Time
                </Card.Title>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="period"
                      label={{
                        value: "Period",
                        position: "insideBottom",
                        offset: -2,
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine
                      y={parseFloat(P)}
                      stroke="#adb5bd"
                      strokeDasharray="4 4"
                      label={{
                        value: "Principal",
                        fontSize: 11,
                        fill: "#adb5bd",
                      }}
                    />
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

            {user && (
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title className="fs-6 fw-semibold mb-3">
                    Save Scenario
                  </Card.Title>
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
            )}
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

// ── PV Calculator ─────────────────────────────────────────────────────────────

function PresentValueCalc() {
  const [F, setF] = useState("");
  const [i, setI] = useState("");
  const [n, setN] = useState("");
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [scenarioName, setScenarioName] = useState("");

  const { user } = useAuth();

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setSaved(false);
    setLoading(true);

    try {
      const data = await calcPresentValue(
        parseFloat(F),
        parseFloat(i) / 100,
        parseFloat(n),
      );
      setResult(data.result);
      setChartData(
        buildPVChartData(parseFloat(F), parseFloat(i) / 100, parseFloat(n)),
      );
    } catch (err) {
      setError("Calculation failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveScenario({
        scenario_name: scenarioName || null,
        calculator_type: "present_value",
        input_values: { F: parseFloat(F), i: parseFloat(i), n: parseFloat(n) },
        calculated_result: { result },
      });
      setSaved(true);
    } catch (err) {
      setError("Failed to save scenario.");
    } finally {
      setSaving(false);
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
                  placeholder="e.g. 5000"
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
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <p className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
                  Present Value
                </p>
                <h3 className="fw-bold text-primary mb-0">
                  {formatCurrency(result)}
                </h3>
                <div
                  className="d-flex gap-3 mt-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  <span className="text-muted">
                    Future Value:{" "}
                    <strong>{formatCurrency(parseFloat(F))}</strong>
                  </span>
                  <span className="text-muted">
                    Discount:{" "}
                    <strong>{formatCurrency(parseFloat(F) - result)}</strong>
                  </span>
                  <span className="text-muted">
                    Rate: <strong>{formatPercent(parseFloat(i) / 100)}</strong>
                  </span>
                </div>
              </Card.Body>
            </Card>

            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title className="fs-6 fw-semibold mb-3">
                  Value Over Time
                </Card.Title>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="period"
                      label={{
                        value: "Period",
                        position: "insideBottom",
                        offset: -2,
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine
                      y={parseFloat(F)}
                      stroke="#adb5bd"
                      strokeDasharray="4 4"
                      label={{
                        value: "Future Value",
                        fontSize: 11,
                        fill: "#adb5bd",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Present Value"
                      stroke="#0d6efd"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>

            {user && (
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title className="fs-6 fw-semibold mb-3">
                    Save Scenario
                  </Card.Title>
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
            )}
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

function TimeValue() {
  return (
    <Container className="py-5">
      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Time Value of Money</h4>
        <p className="text-muted mb-0">
          Calculate how money grows or discounts over time using compound
          interest.
        </p>
      </div>

      <Tabs defaultActiveKey="fv" className="mb-4">
        <Tab eventKey="fv" title="Future Value">
          <FutureValueCalc />
        </Tab>
        <Tab eventKey="pv" title="Present Value">
          <PresentValueCalc />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default TimeValue;
