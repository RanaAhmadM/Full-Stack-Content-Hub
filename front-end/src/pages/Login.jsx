import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      login(res.data);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center mb-4">
          <h3 className="auth-title mb-1">
            Welcome back<span className="d-none d-sm-inline"> 👋</span>
          </h3>
          <p className="auth-subtitle">Sign in to continue generating snippets.</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              required
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              required
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <button
            className="btn btn-primary w-100 fw-semibold"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
