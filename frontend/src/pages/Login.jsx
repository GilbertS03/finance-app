// pages/Login.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  InputGroup,
} from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { validateLogin } from "../utils/validation";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateLogin(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(email, password);
      login(
        { user_id: data.user_id, full_name: data.full_name, email: data.email },
        data.access_token,
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <Card
        style={{ width: "100%", maxWidth: "440px" }}
        className="p-4 shadow-sm"
      >
        <h4 className="mb-4 text-center fw-semibold">Sign in</h4>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="person@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onPaste={(e) => e.preventDefault()}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Form>

        <p
          className="text-center mt-3 mb-0 text-muted"
          style={{ fontSize: "0.9rem" }}
        >
          Don't have an account? <Link to="/register">Create One</Link>
        </p>
      </Card>
    </Container>
  );
}

export default Login;
