import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";

export default function AdminManageProblems() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [rows, setRows] = useState([]);
  const [deletingSlug, setDeletingSlug] = useState("");

  async function loadProblems() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/prob/problems", {
        params: { page: 1, limit: 200, sort: "newest" },
      });
      setRows(res.data?.problems || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load problems");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProblems();
  }, []);

  async function handleDelete(slug) {
    const ok = window.confirm(`Delete problem "${slug}"? This action cannot be undone.`);
    if (!ok) return;
    setDeletingSlug(slug);
    setErr("");
    try {
      await api.delete(`/prob/problems/${slug}`);
      setRows((prev) => prev.filter((p) => p.slug !== slug));
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to delete problem");
    } finally {
      setDeletingSlug("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Problems</h1>
          <p className="text-base-content/70">Edit and delete existing problems.</p>
        </div>
        <div className="flex gap-2">
          <Link className="btn btn-outline" to="/admin/dashboard">
            Back
          </Link>
          <Link className="btn btn-primary" to="/admin/problems/create">
            Create Problem
          </Link>
        </div>
      </div>

      {!!err && <div className="alert alert-error">{err}</div>}

      {loading ? (
        <div className="flex justify-center mt-20">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Slug</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p._id}>
                  <td className="font-medium">{p.title}</td>
                  <td>
                    <span className="badge badge-outline">{p.difficulty}</span>
                  </td>
                  <td className="text-sm text-base-content/70">{p.slug}</td>
                  <td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link className="btn btn-sm" to={`/problems/${p.slug}`}>
                        View
                      </Link>
                      <Link className="btn btn-sm btn-primary" to={`/admin/problems/${p.slug}/edit`}>
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDelete(p.slug)}
                        disabled={deletingSlug === p.slug}
                      >
                        {deletingSlug === p.slug ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-base-content/60">
                    No problems found.
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

