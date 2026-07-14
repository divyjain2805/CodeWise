import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import api from "../api/axios";

export default function SubmissionDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await api.get(`/submission/${id}`);
        if (!cancelled) setSubmission(res.data?.submission || null);
      } catch (e) {
        if (!cancelled) setErr(e?.response?.data?.message || "Failed to load submission");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (err) return <div className="alert alert-error">{err}</div>;
  if (!submission) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Submission</h1>
          <p className="text-base-content/70">
            {submission.problem?.title} · <span className="badge badge-outline">{submission.problem?.difficulty}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link className="btn btn-ghost" to="/submissions">
            Back
          </Link>
          {submission.problem?.title && (
            <Link className="btn btn-primary" to={`/problems/${submission.problem?.slug || ""}`}>
              Open problem
            </Link>
          )}
        </div>
      </div>

      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-title">Status</div>
          <div className="stat-value text-primary">{submission.status}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Language</div>
          <div className="stat-value">{submission.language?.toUpperCase()}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Runtime</div>
          <div className="stat-value">{submission.runtime || "—"}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Memory</div>
          <div className="stat-value">{submission.memory || "—"}</div>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Code</h2>
          <pre className="whitespace-pre-wrap text-sm font-mono bg-base-200 rounded-lg p-4 overflow-auto">
            {submission.code}
          </pre>
        </div>
      </div>
    </div>
  );
}

