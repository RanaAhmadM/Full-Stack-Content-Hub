// src/pages/GenerateSnippet.jsx
import { useState, useContext } from "react";
import API from "../api/axios"; // apna axios instance
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const GenerateSnippet = () => {
    const { user, setUser } = useContext(AuthContext);
    const [form, setForm] = useState({ title: "", category: "", prompt: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await API.post("/snippets/generate", form);
            console.log("Generated Snippet:", res.data);

            // 🔹 Update credits in context & localStorage
            setUser(prev => ({
                ...prev,
                credits: res.data.remainingCredits
            }));
            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...user,
                    credits: res.data.remainingCredits
                })
            );

            navigate("/"); // back to dashboard
        } catch (err) {
            console.error("Generate Snippet Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Snippet generation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="app-main">
            <div className="dashboard-shell">
                <div className="row justify-content-center">
                    <div className="col-lg-7 col-xl-6">
                        <div className="card shadow-lg border-0" style={{ borderRadius: "20px", backgroundColor: "rgba(15,23,42,0.98)", color: "#e5e7eb", border: "1px solid rgba(148,163,184,0.35)" }}>
                            <div className="card-body p-4 p-md-5">
                                <h3 className="fw-bold mb-2">
                                    Generate a new <span className="text-gradient">snippet</span>
                                </h3>
                                <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
                                    Describe what you need and we’ll generate a reusable code snippet for you.
                                </p>

                                {error && <div className="alert alert-danger">{error}</div>}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Title</label>
                                        <input
                                            className="form-control"
                                            placeholder="Authentication helper, API call wrapper..."
                                            value={form.title}
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Category / language</label>
                                        <input
                                            className="form-control"
                                            placeholder="JavaScript, React, Node, SQL..."
                                            value={form.category}
                                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">Prompt</label>
                                        <textarea
                                            className="form-control"
                                            placeholder="Explain what the snippet should do, e.g. 'Create a function that debounces input with TypeScript types...'"
                                            value={form.prompt}
                                            onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                                            rows={5}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 fw-semibold"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                />
                                                Generating...
                                            </>
                                        ) : (
                                            "Generate (1 credit)"
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default GenerateSnippet;
