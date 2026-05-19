// pages/calculators/annuities/PeriodsFromPV.jsx

import { useState } from "react";
import { calcPeriodsFromPV } from "../../../services/calculatorService";
import { Row, Col, Form, Card, Button, Alert } from "react-bootstrap";
import SaveBlock from "../SaveBlock";
import ResultCard from "../ResultCard";

function PeriodsFromPV({ formatCurrency }) {
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

export default PeriodsFromPV;
