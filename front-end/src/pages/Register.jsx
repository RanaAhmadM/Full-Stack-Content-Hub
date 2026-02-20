import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      login(res.data);
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center mb-4">
          <h3 className="auth-title mb-1">
            Create your account<span className="d-none d-sm-inline"> 🚀</span>
          </h3>
          <p className="auth-subtitle">
            Get started with AI-powered code snippets.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Jane Doe"
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Create a password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-success w-100 fw-semibold">
            Register
          </button>
        </form>

        <p className="text-center auth-footer mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none fw-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
