// pages/calculators/Gradients.jsx

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
} from "react-bootstrap";

import {
  calcArithmeticPV,
  calcArithmeticFV,
  calcArithmeticAnnuity,
  calcGeometricPV,
  calcGeometricFV,
  calcTotalArithmeticPV,
  calcTotalGeometricPV,
} from "../../services/calculatorService";

import { formatCurrency } from "../../utils/calculatorHelpers";
import { saveScenario } from "../../services/scenarioService";
import { useAuth } from "../../context/AuthContext";
import ArithmeticPV from "./gradients/ArithmeticPV";

function Gradients() {
  return (
    <Container className="py-5">
      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Annuities</h4>
        <p className="text-muted mb-0">
          Analyze non-uniform payment series — solve for future value, present
          value, and total values
        </p>
      </div>

      <Tabs defaultActiveKey="pv" className="mb-4">
        <Tab eventKey="pv" title="P/G — Present Value">
          <ArithmeticPV formatCurrency={formatCurrency} />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default Gradients;
