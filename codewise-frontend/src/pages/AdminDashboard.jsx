import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await api.get("/admin/dashboard");
        if (!cancelled) setData(res.data?.data || null);
      } catch (e) {
        if (!cancelled) setErr(e?.response?.data?.message || "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (err) return <div className="alert alert-error">{err}</div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-base-content/70">Platform overview and recent activity.</p>
        <div className="mt-3 flex gap-2">
          <Link className="btn btn-outline btn-sm" to="/admin/problems">
            Manage Problems
          </Link>
          <Link className="btn btn-outline btn-sm" to="/admin/users">
            Manage Users
          </Link>
          <Link className="btn btn-primary btn-sm" to="/admin/problems/create">
            Create Problem
          </Link>
        </div>
      </div>

      <div className="stats stats-vertical md:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Users</div>
          <div className="stat-value text-primary">{data.totalusers}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Problems</div>
          <div className="stat-value text-secondary">{data.totalproblems}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Submissions</div>
          <div className="stat-value">{data.totalsubmissions}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Acceptance</div>
          <div className="stat-value">{data.acceptancerate}%</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Recent Problems</h2>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Difficulty</th>
                    <th className="text-right">Open</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.recentproblems || []).map((p) => (
                    <tr key={p._id}>
                      <td>{p.title}</td>
                      <td>
                        <span className="badge badge-outline">{p.difficulty}</span>
                      </td>
                      <td className="text-right">
                        <Link className="btn btn-xs" to={`/problems/${p.slug}`}>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {(data.recentproblems || []).length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center text-base-content/60 py-6">
                        No data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Recent Users</h2>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.recentusers || []).map((u) => (
                    <tr key={u._id}>
                      <td>{u.username}</td>
                      <td className="text-base-content/70">{u.email}</td>
                      <td>
                        <span className="badge badge-outline">{u.role}</span>
                      </td>
                    </tr>
                  ))}
                  {(data.recentusers || []).length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center text-base-content/60 py-6">
                        No data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Recent Submissions</h2>
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Problem</th>
                  <th>Difficulty</th>
                  <th>Status</th>
                  <th className="text-right">When</th>
                </tr>
              </thead>
              <tbody>
                {(data.recentsubmissions || []).map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="font-medium">{s.user?.username}</div>
                      <div className="text-xs text-base-content/60">{s.user?.email}</div>
                    </td>
                    <td>
                      <Link className="link" to={`/problems/${s.problem?.slug}`}>
                        {s.problem?.title}
                      </Link>
                    </td>
                    <td>
                      <span className="badge badge-outline">{s.problem?.difficulty}</span>
                    </td>
                    <td>
                      <span className="badge">{s.status}</span>
                    </td>
                    <td className="text-right text-xs text-base-content/60">
                      {s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
                {(data.recentsubmissions || []).length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-base-content/60 py-6">
                      No data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

