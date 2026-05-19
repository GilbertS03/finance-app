// pages/calculators/Annuities.jsx
import { useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";

import { formatCurrency } from "../../utils/calculatorHelpers";
import AnnuityFromFV from "./annuities/AnnuityFV";
import AnnuityFromPV from "./annuities/AnnuityFromFV";
import AnnuityFV from "./annuities/AnnuityFV";
import AnnuityPV from "./annuities/AnnuityFromPV";
import PeriodsFromFV from "./annuities/PeriodsFromFV";
import PeriodsFromPV from "./annuities/PeriodsFromPV";
import Perpetuity from "./annuities/Perpetuity";
import SaveBlock from "./annuities/SaveBlock";

function Annuities() {
  return (
    <Container className="py-5">
      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Annuities</h4>
        <p className="text-muted mb-0">
          Analyze uniform payment series — solve for future value, present
          value, payment amount, or number of periods.
        </p>
      </div>

      <Tabs defaultActiveKey="fv" className="mb-4">
        <Tab eventKey="fv" title="F/A — Future Value">
          <AnnuityFV formatCurrency={formatCurrency} />
        </Tab>
        <Tab eventKey="pv" title="P/A — Present Value">
          <AnnuityPV formatCurrency={formatCurrency} />
        </Tab>
        <Tab eventKey="afv" title="A/F — Payment from FV">
          <AnnuityFromFV formatCurrency={formatCurrency} />
        </Tab>
        <Tab eventKey="apv" title="A/P — Payment from PV">
          <AnnuityFromPV formatCurrency={formatCurrency} />
        </Tab>
        <Tab eventKey="nfpv" title="n from P/A">
          <PeriodsFromPV formatCurrency={formatCurrency} />
        </Tab>
        <Tab eventKey="nffv" title="n from F/A">
          <PeriodsFromFV formatCurrency={formatCurrency} />
        </Tab>
        <Tab eventKey="perp" title="Perpetuity">
          <Perpetuity formatCurrency={formatCurrency} />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default Annuities;
