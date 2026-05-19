// pages/calculators/TimeValue.jsx
import { useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
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
import {
  calcFutureValue,
  calcPresentValue,
} from "../../services/calculatorService";

import { formatCurrency, formatPercent } from "../../utils/calculatorHelpers";
import { CustomTooltip } from "./CustomToolTip";
import { saveScenario } from "../../services/scenarioService";
import { useAuth } from "../../context/AuthContext";
import FutureValueCalc from "./tvm/FutureValueCalc";
import PresentValueCalc from "./tvm/PresentValueCalc";

function TimeValue() {
  return (
    <Container className="py-5">
      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Time Value of Money</h4>
        <p className="text-muted mb-0">
          Calculate how money grows or discounts over time using compound
          interest.
        </p>
      </div>

      <Tabs defaultActiveKey="fv" className="mb-4">
        <Tab eventKey="fv" title="Future Value">
          <FutureValueCalc
            formatCurrency={formatCurrency}
            formatPercent={formatPercent}
          />
        </Tab>
        <Tab eventKey="pv" title="Present Value">
          <PresentValueCalc
            formatCurrency={formatCurrency}
            formatPercent={formatPercent}
          />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default TimeValue;
