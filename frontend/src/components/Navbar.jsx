// components/Navbar.jsx

import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { User } from "lucide-react";

function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="white" border="bottom" expand="md" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-semibold">
          Financial Calculator
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          {user ? (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/calculator">
                  Calculator
                </Nav.Link>
                <Nav.Link as={Link} to="/comparisons">
                  Comparisons
                </Nav.Link>
              </Nav>
              <Nav className="align-items-center">
                <NavDropdown
                  title={
                    <span className="d-inline-flex align-items-center gap-2">
                      <User size={18} />
                      <span style={{ fontSize: "0.9rem" }}>
                        {user.full_name}
                      </span>
                    </span>
                  }
                  align="end"
                >
                  <NavDropdown.ItemText
                    className="text-muter"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {user.email}
                  </NavDropdown.ItemText>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto gap-2">
              <Nav.Link as={Link} to="/login">
                Sign In
              </Nav.Link>
              <Button as={Link} to="/register" variant="primary" size="sm">
                Get Started
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
