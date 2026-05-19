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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="bg-white border rounded shadow-sm p-2"
        style={{ fontSize: "0.85rem" }}
      >
        <p className="mb-1 fw-semibold">Period {label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="mb-0" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
