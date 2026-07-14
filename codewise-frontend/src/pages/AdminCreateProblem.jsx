import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios";
import ProblemForm from "../components/ProblemForm";

export default function AdminCreateProblem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(payload) {
    setError("");
    setSuccess("");
    try {
      setLoading(true);
      const form = new FormData();
      form.append("title", payload.title);
      form.append("description", payload.description);
      form.append("difficulty", payload.difficulty);
      form.append("tags", JSON.stringify(payload.tags));
      form.append("examples", JSON.stringify(payload.examples));
      form.append("constraints", JSON.stringify(payload.constraints));
      form.append("hints", JSON.stringify(payload.hints));
      form.append("visibletestcases", JSON.stringify(payload.visibletestcases));
      form.append("hiddentestcases", JSON.stringify(payload.hiddentestcases));
      form.append("starterCode", JSON.stringify(payload.starterCode));
      form.append("referenceSolution", JSON.stringify(payload.referenceSolution));
      if (payload.videoFile) {
        form.append("videosolution", payload.videoFile);
      }
      const res = await api.post("/prob/problems-create", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const createdSlug = res?.data?.problem?.slug;
      setSuccess("Problem created successfully.");
      if (createdSlug) {
        setTimeout(() => navigate(`/problems/${createdSlug}`), 700);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to create problem");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProblemForm
      mode="create"
      initial={{
        title: "",
        description: "",
        difficulty: "EASY",
        tags: ["array", "hash-map"],
      }}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      success={success}
      header={
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create Problem</h1>
            <p className="text-base-content/70">
              Admin tool for adding coding problems with test cases and starter code.
            </p>
          </div>
          <button className="btn btn-outline" onClick={() => navigate("/admin/dashboard")}>
            Back to Admin
          </button>
        </div>
      }
    />
  );
}

