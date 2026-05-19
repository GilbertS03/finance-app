// pages/Calculators.jsx
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  TrendingUp,
  Clock,
  BarChart2,
  PiggyBank,
  Landmark,
  DollarSign,
} from "lucide-react";

const CALCULATORS = [
  {
    title: "Time Value of Money",
    description: "Calculate future and present value using compound interest.",
    icon: Clock,
    color: "primary",
    path: "/calculators/time-value",
  },
  {
    title: "Annuities",
    description:
      "Analyze uniform payment series — find payment, present, or future value.",
    icon: TrendingUp,
    color: "success",
    path: "/calculators/annuities",
  },
  {
    title: "Gradients",
    description: "Work with arithmetic and geometric gradient payment series.",
    icon: BarChart2,
    color: "warning",
    path: "/calculators/gradients",
  },
  {
    title: "Loan Amortization",
    description:
      "Calculate monthly payments and view full amortization schedules.",
    icon: DollarSign,
    color: "danger",
    path: "/calculators/loan",
  },
  {
    title: "Bond",
    description:
      "Price bonds, calculate yield to maturity, duration, and cash flows.",
    icon: Landmark,
    color: "secondary",
    path: "/calculators/bond",
  },
  {
    title: "Savings Goal",
    description:
      "Project savings growth and find required contributions to hit your goal.",
    icon: PiggyBank,
    color: "dark",
    path: "/calculators/savings",
  },
];

function Calculators() {
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Calculators</h4>
        <p className="text-muted mb-0">
          Choose a calculator to get started. Results can be saved and compared.
        </p>
      </div>

      <Row xs={1} sm={2} lg={3} className="g-4">
        {CALCULATORS.map((calculator) => {
          const Icon = calculator.icon;
          return (
            <Col key={calculator.path}>
              <Card
                className="h-100 shadow-sm"
                style={{ cursor: "pointer", transition: "transform 0.15s" }}
                onClick={() => navigate(calculator.path)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-3px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <Card.Body className="d-flex flex-column">
                  <div className={`text-${calculator.color} mb-3`}>
                    <Icon size={28} />
                  </div>
                  <Card.Title className="fs-6 fw-semibold">
                    {calculator.title}
                  </Card.Title>
                  <Card.Text
                    className="text-muted"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {calculator.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default Calculators;
