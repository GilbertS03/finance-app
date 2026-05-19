// pages/calculators/annuities/AnnuityFromPV.jsx

import { useState } from "react";
import { calcAnnuityFromPV } from "../../../services/calculatorService";
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

function AnnuityFromPV({ formatCurrency }) {
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

export default AnnuityFromPV;
