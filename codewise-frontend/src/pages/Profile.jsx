import { useAuth } from "../context/AuthContext";

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="stat-title">{label}</div>
      <div className="stat-value text-primary">{value ?? 0}</div>
    </div>
  );
}

export default function Profile() {
  const { user, refresh } = useAuth();

  const stats = user?.stats || {};

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-base-content/70">
            {user?.username} · {user?.email} · <span className="badge badge-outline">{user?.role}</span>
          </p>
        </div>
        <button className="btn btn-outline" onClick={refresh}>
          Refresh
        </button>
      </div>

      <div className="stats stats-vertical md:stats-horizontal shadow w-full">
        <Stat label="Total submissions" value={stats.totalSubmissions} />
        <Stat label="Accepted" value={stats.acceptedSubmissions} />
        <Stat label="Solved" value={stats.problemsSolved} />
      </div>

      <div className="stats stats-vertical md:stats-horizontal shadow w-full">
        <Stat label="Easy solved" value={stats.easySolved} />
        <Stat label="Medium solved" value={stats.mediumSolved} />
        <Stat label="Hard solved" value={stats.hardSolved} />
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Solved problems</h2>
          <p className="text-base-content/70">
            {user?.solvedproblems?.length || 0} problems in your solved list.
          </p>
        </div>
      </div>
    </div>
  );
}

