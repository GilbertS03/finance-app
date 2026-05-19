// pages/calculators/annuities/AnnuityPV.jsx

import { useState } from "react";
import { calcAnnuityPV } from "../../../services/calculatorService";
import { Row, Col, Form, Card, Button, Alert } from "react-bootstrap";
import SaveBlock from "./SaveBlock";
import ResultCard from "./ResultCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AnnuityPV({ formatCurrency }) {
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

export default AnnuityPV;
