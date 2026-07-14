import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";

function StatusBadge({ status }) {
  const cls =
    status === "Accepted"
      ? "badge-success"
      : status === "Wrong Answer"
      ? "badge-error"
      : status === "Compilation Error"
      ? "badge-warning"
      : status === "Runtime Error"
      ? "badge-warning"
      : "badge-ghost";
  return <span className={`badge ${cls}`}>{status}</span>;
}

export default function MySubmissions() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await api.get("/submission/my-submissions");
        if (!cancelled) setRows(res.data?.submissions || []);
      } catch (e) {
        if (!cancelled) setErr(e?.response?.data?.message || "Failed to load submissions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Submissions</h1>
        <p className="text-base-content/70">Your recent attempts across problems.</p>
      </div>

      {loading && (
        <div className="flex justify-center mt-10">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {!!err && <div className="alert alert-error">{err}</div>}

      {!loading && !err && (
        <div className="overflow-x-auto bg-base-100/60 backdrop-blur-md rounded-xl shadow-lg border border-base-200">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Problem</th>
                <th>Difficulty</th>
                <th>Language</th>
                <th>Status</th>
                <th>When</th>
                <th className="text-right">Open</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s._id}>
                  <td className="font-medium">
                    <Link className="link" to={`/problems/${s.problem?.slug}`}>
                      {s.problem?.title || "—"}
                    </Link>
                  </td>
                  <td>
                    <span className="badge badge-outline">{s.problem?.difficulty || "—"}</span>
                  </td>
                  <td className="uppercase">{s.language}</td>
                  <td>
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="text-sm text-base-content/70">
                    {s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"}
                  </td>
                  <td className="text-right">
                    <Link className="btn btn-sm btn-outline rounded-full px-4" to={`/submissions/${s._id}`}>
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-base-content/60">
                    No submissions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

