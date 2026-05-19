// pages/calculators/gradients/ArithmeticPV.jsx

import { useState } from "react";
import { calcArithmeticPV } from "../../../services/calculatorService";
import { Row, Col, Form, Card, Button, Alert } from "react-bootstrap";
import SaveBlock from "../SaveBlock";
import ResultCard from "../ResultCard";

function ArithmeticPV({ formatCurrency }) {
  const [G, setG] = useState("");
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
      const data = await calcArithmeticPV(
        parseFloat(G),
        parseFloat(i) / 100,
        parseFloat(n),
      );
      setResult(data.result);
    } catch {
      setError("Calculation failed. Please check your inputs");
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
                <Form.Label>Gradient Increase/Decrease (G)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 1000"
                  value={G}
                  onChange={(e) => setG(e.target.value)}
                  min="-100000"
                  max="100000"
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
              label="Present Value of Arithmetic Gradient (P/G)"
              value={result}
              stats={[
                { label: "Gradient", value: formatCurrency(parseFloat(G)) },
                { label: "Interest", value: parseFloat(i) },
                { label: "Number of Periods", value: parseFloat(n) },
              ]}
            />
            <SaveBlock
              calculatorType="present_value_arithmetic_gradient"
              inputValues={{
                G: parseFloat(G),
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
            <p>Enter values to see results</p>
          </div>
        )}
      </Col>
    </Row>
  );
}

export default ArithmeticPV;
