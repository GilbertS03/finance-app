import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppNavbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Calculators from "./pages/calculators/Calculators";
import TimeValue from "./pages/calculators/TimeValue";
import Annuities from "./pages/calculators/Annuities";
import Gradients from "./pages/calculators/Gradients";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppNavbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calculators"
            element={
              <ProtectedRoute>
                <Calculators />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calculators/time-value"
            element={
              <ProtectedRoute>
                <TimeValue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calculators/annuities"
            element={
              <ProtectedRoute>
                <Annuities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calculators/gradients"
            element={
              <ProtectedRoute>
                <Gradients />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
