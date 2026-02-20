import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import SnippetCard from "../components/SnippetCard"; // Use the improved SnippetCard

const Dashboard = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSnippets = async () => {
    try {
      const res = await API.get("/snippets");
      setSnippets(res.data.snippets || []);
    } catch (err) {
      console.error("Fetch Snippets Error:", err.response?.data || err.message);
      setError("Failed to load snippets.");
      setSnippets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this snippet?")) return;

    try {
      await API.delete(`/snippets/${id}`);
      setSnippets(snippets.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete Snippet Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete snippet");
    }
  };

  if (loading)
    return (
      <main className="app-main">
        <div className="dashboard-shell">
          <p className="text-center text-light-50 fs-5">Loading snippets...</p>
        </div>
      </main>
    );

  if (error)
    return (
      <main className="app-main">
        <div className="dashboard-shell">
          <p className="text-center text-danger mt-5 fs-5">{error}</p>
        </div>
      </main>
    );

  return (
    <main className="app-main">
      <div className="dashboard-shell">
        <div className="dashboard-header">
          <div>
            <h3 className="dashboard-title">Your Snippets</h3>
            <p className="dashboard-subtitle">
              Collection of AI-generated snippets saved to your workspace.
            </p>
          </div>
          <Link to="/generate" className="btn btn-primary-elevated">
            Generate snippet
          </Link>
        </div>

        {snippets.length === 0 ? (
          <div className="snippets-empty">
            <h4>No snippets yet</h4>
            <p className="mb-0">
              Start by generating your first code snippet using the{" "}
              <strong>Generate snippet</strong> button.
            </p>
          </div>
        ) : (
          <div className="snippets-grid">
            {snippets.map((snippet) => (
              <SnippetCard
                key={snippet._id}
                title={snippet.title}
                description={snippet.content}
                language={snippet.category}
                createdAt={new Date(snippet.createdAt).toLocaleDateString()}
              >
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(snippet._id)}
                >
                  Delete
                </button>
              </SnippetCard>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
