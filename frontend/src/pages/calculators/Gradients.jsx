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
