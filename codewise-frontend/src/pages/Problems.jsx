import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import api from "../api/axios";

const difficulties = ["", "EASY", "MEDIUM", "HARD"];

function Badge({ value }) {
  if (!value) return null;
  const cls =
    value === "EASY"
      ? "badge-success"
      : value === "MEDIUM"
      ? "badge-warning"
      : "badge-error";
  return <span className={`badge ${cls}`}>{value}</span>;
}

export default function Problems() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const query = useMemo(() => {
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const difficulty = searchParams.get("difficulty") || "";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "newest";
    return { page, limit, difficulty, search, sort };
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await api.get("/prob/problems", { params: query });
        if (!cancelled) setData(res.data);
      } catch (e) {
        if (!cancelled) setErr(e?.response?.data?.message || "Failed to load problems");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [query]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, String(value));
    if (key !== "page") next.set("page", "1");
    setSearchParams(next);
  }

  const page = data?.currentpage || query.page;
  const totalPages = data?.totalpages || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Problems</h1>
          <p className="text-base-content/70">Browse, filter and solve coding problems.</p>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <label className="input input-bordered flex items-center gap-2">
            <input
              value={query.search}
              onChange={(e) => updateParam("search", e.target.value)}
              className="grow"
              placeholder="Search title…"
            />
          </label>

          <select
            className="select select-bordered"
            value={query.difficulty}
            onChange={(e) => updateParam("difficulty", e.target.value)}
          >
            {difficulties.map((d) => (
              <option key={d} value={d}>
                {d || "All difficulties"}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered"
            value={query.sort}
            onChange={(e) => updateParam("sort", e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
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
                <th>Title</th>
                <th>Difficulty</th>
                <th>Tags</th>
                <th>Status</th>
                <th className="text-right">Open</th>
              </tr>
            </thead>
            <tbody>
              {(data?.problems || []).map((p) => (
                <tr key={p._id}>
                  <td className="font-medium">{p.title}</td>
                  <td>
                    <Badge value={p.difficulty} />
                  </td>
                  <td>
                    {p.tags && p.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {p.tags.map((tag, idx) => (
                          <span key={idx} className="badge badge-sm badge-neutral">{tag}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-base-content/50">None</span>
                    )}
                  </td>
                  <td>
                    {p.status && p.status !== "Not Attempted" ? (
                      <span
                        className={`badge ${
                          p.status === "Solved"
                            ? "badge-success"
                            : p.status === "Attempted"
                            ? "badge-warning"
                            : "badge-ghost"
                        }`}
                      >
                        {p.status}
                      </span>
                    ) : (
                      <span className="text-base-content/60">—</span>
                    )}
                  </td>
                  <td className="text-right">
                    <Link className="btn btn-sm btn-primary rounded-full px-4 shadow-sm" to={`/problems/${p.slug}`}>
                      Solve
                    </Link>
                  </td>
                </tr>
              ))}
              {(data?.problems || []).length === 0 && (
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

      {!loading && !err && (
        <div className="flex items-center justify-between">
          <button
            className="btn"
            disabled={page <= 1}
            onClick={() => updateParam("page", Math.max(1, page - 1))}
          >
            Prev
          </button>
          <div className="text-sm text-base-content/70">
            Page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </div>
          <button
            className="btn"
            disabled={page >= totalPages}
            onClick={() => updateParam("page", Math.min(totalPages, page + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

