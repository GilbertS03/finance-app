// pages/Dashboard.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Spinner,
  Alert,
  ButtonGroup,
} from "react-bootstrap";
import { LayoutGrid, List, Trash2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getAllScenarios,
  deleteScenarioById,
} from "../services/scenarioService";
import {
  getAllComparisons,
  deleteComparisonById,
} from "../services/comparisonService";

const CALCULATOR_LABELS = {
  future_value: "Future Value",
  present_value: "Present Value",
  interest_rate: "Interest Rate",
  periods: "Periods",
  effective_rate: "Effective Rate",
  continuous_compounding: "Continuous Compounding",
  annuity_fv: "Annuity — Future Value",
  annuity_pv: "Annuity — Present Value",
  annuity_from_fv: "Annuity from FV",
  annuity_from_pv: "Annuity from PV",
  perpetuity: "Perpetuity",
  arithmetic_gradient: "Arithmetic Gradient",
  geometric_gradient: "Geometric Gradient",
  loan: "Loan Amortization",
  bond: "Bond",
  savings: "Savings Goal",
};

const CALCULATOR_COLORS = {
  future_value: "primary",
  present_value: "primary",
  interest_rate: "info",
  periods: "info",
  annuity_fv: "success",
  annuity_pv: "success",
  annuity_from_fv: "success",
  annuity_from_pv: "success",
  perpetuity: "success",
  arithmetic_gradient: "warning",
  geometric_gradient: "warning",
  loan: "danger",
  bond: "secondary",
  savings: "dark",
};

function ScenarioCard({ scenario, onDelete, navigate }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge
            bg={CALCULATOR_COLORS[scenario.calculator_type] || "secondary"}
          >
            {CALCULATOR_LABELS[scenario.calculator_type] ||
              scenario.calculator_type}
          </Badge>
          <Button
            variant="link"
            className="text-danger p-0"
            onClick={() => onDelete(scenario.scenario_id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
        <Card.Title className="fs-6 fw-semibold mt-1">
          {scenario.scenario_name || "Untitled Scenario"}
        </Card.Title>
        <Card.Text className="text-muted" style={{ fontSize: "0.8rem" }}>
          {new Date(scenario.saved_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Card.Text>
        <div className="mt-auto">
          <Button
            variant="outline-primary"
            size="sm"
            className="w-100"
            onClick={() => navigate(`/scenarios/${scenario.scenario_id}`)}
          >
            View <ArrowRight size={14} />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

function Dashboard() {
  const [scenarios, setScenarios] = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scenariosData, comparisonsData] = await Promise.all([
          getAllScenarios(),
          getAllComparisons(),
        ]);
        setScenarios(scenariosData);
        setComparisons(comparisonsData);
      } catch (err) {
        setError("Failed to load your data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteScenario = async (scenarioId) => {
    try {
      await deleteScenarioById(scenarioId);
      setScenarios((prev) => prev.filter((s) => s.scenario_id !== scenarioId));
    } catch (err) {
      setError("Failed to delete scenario.");
    }
  };

  const handleDeleteComparison = async (comparisonId) => {
    try {
      await deleteComparisonById(comparisonId);
      setComparisons((prev) =>
        prev.filter((c) => c.comparison_id !== comparisonId),
      );
    } catch (err) {
      setError("Failed to delete comparison.");
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-semibold mb-0">Welcome back, {user?.full_name}</h4>
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
            {scenarios.length} saved scenario{scenarios.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate("/calculators")}>
          New Calculation
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Scenarios */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-semibold mb-0">Saved Scenarios</h5>
        <ButtonGroup size="sm">
          <Button
            variant={view === "grid" ? "primary" : "outline-primary"}
            onClick={() => setView("grid")}
          >
            <LayoutGrid size={15} />
          </Button>
          <Button
            variant={view === "list" ? "primary" : "outline-primary"}
            onClick={() => setView("list")}
          >
            <List size={15} />
          </Button>
        </ButtonGroup>
      </div>

      {scenarios.length === 0 ? (
        <Card className="text-center py-5 shadow-sm mb-5">
          <Card.Body>
            <p className="text-muted mb-3">No saved scenarios yet</p>
            <Button variant="primary" onClick={() => navigate("/calculators")}>
              Run your first calculation
            </Button>
          </Card.Body>
        </Card>
      ) : view === "grid" ? (
        <Row xs={1} sm={2} lg={3} xl={4} className="g-3 mb-5">
          {scenarios.map((scenario) => (
            <Col key={scenario.scenario_id}>
              <ScenarioCard
                scenario={scenario}
                onDelete={handleDeleteScenario}
                navigate={navigate}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="shadow-sm mb-5">
          <Table hover responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Calculator</th>
                <th>Saved</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario) => (
                <tr key={scenario.scenario_id}>
                  <td className="align-middle fw-medium">
                    {scenario.scenario_name || "Untitled Scenario"}
                  </td>
                  <td className="align-middle">
                    <Badge
                      bg={
                        CALCULATOR_COLORS[scenario.calculator_type] ||
                        "secondary"
                      }
                    >
                      {CALCULATOR_LABELS[scenario.calculator_type] ||
                        scenario.calculator_type}
                    </Badge>
                  </td>
                  <td
                    className="align-middle text-muted"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {new Date(scenario.saved_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="align-middle text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          navigate(`/scenarios/${scenario.scenario_id}`)
                        }
                      >
                        View
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          handleDeleteScenario(scenario.scenario_id)
                        }
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Comparisons */}
      <h5 className="fw-semibold mb-3">Recent Comparisons</h5>

      {comparisons.length === 0 ? (
        <Card className="text-center py-5 shadow-sm">
          <Card.Body>
            <p className="text-muted mb-3">No comparisons yet</p>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/comparisons")}
            >
              Create a comparison
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <Table hover responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Scenarios</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {comparisons.slice(0, 5).map((comparison) => (
                <tr key={comparison.comparison_id}>
                  <td className="align-middle fw-medium">
                    {comparison.comparison_title}
                  </td>
                  <td
                    className="align-middle text-muted"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {comparison.items
                      ?.map(
                        (item) => item.scenario?.scenario_name || "Untitled",
                      )
                      .join(" vs ")}
                  </td>
                  <td
                    className="align-middle text-muted"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {new Date(comparison.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </td>
                  <td className="align-middle text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          navigate(`/comparisons/${comparison.comparison_id}`)
                        }
                      >
                        View
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          handleDeleteComparison(comparison.comparison_id)
                        }
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {comparisons.length > 5 && (
            <Card.Footer className="text-center">
              <Button variant="link" onClick={() => navigate("/comparisons")}>
                View all {comparisons.length} comparisons
              </Button>
            </Card.Footer>
          )}
        </Card>
      )}
    </Container>
  );
}

export default Dashboard;
