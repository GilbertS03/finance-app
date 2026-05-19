// pages/Register.jsx

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
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/authService";
import { validateRegister } from "../utils/validation";
import { Eye, EyeOff } from "lucide-react";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateRegister(
      fullName,
      email,
      password,
      confirmPassword,
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(fullName, email, password);
      login(
        { user_id: data.user_id, full_name: data.full_name, email: data.email },
        data.access_token,
      );
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Registration failed. Please try again.",
      );
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
        <h4 className="mb-4 text-center fw-semibold">Create an account</h4>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="someone@example.com"
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

          <Form.Group className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button
            variant="button"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </Form>

        <p
          className="text-center mt-3 mb-0 text-muted"
          style={{ fontSize: "0.9rem" }}
        >
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </Card>
    </Container>
  );
}

export default Register;
