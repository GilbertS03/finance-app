// pages/Dashboard.jsx

import { Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <Container className="mt-5">
      <h4>Welcome back, {user?.full_name} </h4>
    </Container>
  );
}

export default Dashboard;
