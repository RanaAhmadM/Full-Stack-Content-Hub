// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark app-navbar px-3 px-lg-4 py-3">
      <div className="container-fluid">
        <Link className="navbar-brand fw-semibold" to="/">
          <span className="text-gradient">SnippetAI</span>
        </Link>

        <div className="d-flex align-items-center ms-auto gap-2 gap-lg-3">
          {user ? (
            <>
              <span className="badge badge-user d-flex align-items-center">
                <span className="me-1">Hi, {user.name.split(" ")[0]}</span>
                <span className="ms-1">
                  · Credits: <strong>{user?.credits ?? 0}</strong>
                </span>
              </span>
              <button
                onClick={logout}
                className="btn btn-outline-light btn-sm btn-logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-outline-light btn-sm btn-ghost"
              >
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm btn-ghost">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
