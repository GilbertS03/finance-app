// pages/calcualtors/tvm.FutureValueCalc.jsx

import { useState } from "react";
import { calcFutureValue } from "../../../services/calculatorService";
import { saveScenario } from "../../../services/scenarioService";
import { Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
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
import { useAuth } from "../../../context/AuthContext";
import { buildFVChartData } from "../../../utils/calculatorHelpers";
import { CustomTooltip } from "../CustomToolTip";

function FutureValueCalc({ formatCurrency, formatPercent }) {
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

export default FutureValueCalc;
