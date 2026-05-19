import { useState } from "react";
import { Card, Alert, Col, Row, Form, Button } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";

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

export default SaveBlock;
