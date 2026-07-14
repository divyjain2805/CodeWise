import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../api/axios";
import ProblemForm from "../components/ProblemForm";

export default function AdminEditProblem() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [bootLoading, setBootLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [initial, setInitial] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setBootLoading(true);
      setError("");
      try {
        const res = await api.get(`/prob/problems/${slug}`);
        if (cancelled) return;
        setInitial(res.data);
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.message || "Failed to load problem");
      } finally {
        if (!cancelled) setBootLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function handleSubmit(payload) {
    setError("");
    setSuccess("");
    try {
      setLoading(true);
      await api.put(`/prob/problems/${slug}`, {
        title: payload.title,
        description: payload.description,
        difficulty: payload.difficulty,
        tags: payload.tags,
        examples: payload.examples,
        constraints: payload.constraints,
        hints: payload.hints,
        visibletestcases: payload.visibletestcases,
        hiddentestcases: payload.hiddentestcases,
        starterCode: payload.starterCode,
        referenceSolution: payload.referenceSolution,
      });
      setSuccess("Problem updated successfully.");
      setTimeout(() => navigate("/admin/problems"), 700);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to update problem");
    } finally {
      setLoading(false);
    }
  }

  if (bootLoading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!initial) {
    return <div className="alert alert-error">{error || "Problem not found"}</div>;
  }

  return (
    <ProblemForm
      mode="edit"
      initial={initial}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      success={success}
      header={
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Problem</h1>
            <p className="text-base-content/70">Update problem data and testcases.</p>
          </div>
          <div className="flex gap-2">
            <Link className="btn btn-outline" to="/admin/problems">
              Back to List
            </Link>
            <Link className="btn" to={`/problems/${slug}`}>
              View
            </Link>
          </div>
        </div>
      }
    />
  );
}

