// pages/calculators/annuities/AnnuityFV.jsx

import { useState } from "react";
import { calcAnnuityFV } from "../../../services/calculatorService";
import { Row, Col, Form, Card, Button, Alert } from "react-bootstrap";
import SaveBlock from "../SaveBlock";
import ResultCard from "../ResultCard";
import { CustomTooltip } from "../CustomToolTip";

function AnnuityFV({ formatCurrency }) {
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

export default AnnuityFV;
