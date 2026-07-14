import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";

export default function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function loadUsers() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data?.users || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  }

  async function handleMakeAdmin(id) {
    if (!window.confirm("Make this user an ADMIN?")) return;
    try {
      const res = await api.put(`/admin/users/${id}/role`);
      setUsers(users.map((u) => (u._id === id ? res.data.user : u)));
    } catch (e) {
      alert(e?.response?.data?.message || "Update failed");
    }
  }

  async function handleMakeUser(id) {
    if (!window.confirm("Make this ADMIN a USER?")) return;
    try {
      const res = await api.put(`/admin/users/${id}/role/user`);
      setUsers(users.map((u) => (u._id === id ? res.data.user : u)));
    } catch (e) {
      alert(e?.response?.data?.message || "Update failed");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (err) return <div className="alert alert-error">{err}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="text-base-content/70">View, promote, and remove users.</p>
        </div>
        <Link className="btn btn-ghost" to="/admin/dashboard">
          Back to Dashboard
        </Link>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="font-medium">{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-primary' : 'badge-outline'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="text-sm text-base-content/70">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-right space-x-2">
                      {u.role !== 'ADMIN' && (
                        <button
                          className="btn btn-xs btn-outline btn-success"
                          onClick={() => handleMakeAdmin(u._id)}
                        >
                          Make Admin
                        </button>
                      )}
                      {u.role !== 'USER' && (
                        <button
                          className="btn btn-xs btn-outline btn-success"
                          onClick={() => handleMakeUser(u._id)}
                        >
                          Make User
                        </button>
                      )}
                      <button
                        className="btn btn-xs btn-outline btn-error"
                        onClick={() => handleDelete(u._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-base-content/60">
                      No users found.
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
