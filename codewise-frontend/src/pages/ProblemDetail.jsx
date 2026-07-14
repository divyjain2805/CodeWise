import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import Editor from "@monaco-editor/react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AskAI from "../components/AskAI";

const langOptions = [
  { key: "cpp", label: "C++" },
  { key: "java", label: "Java" },
  { key: "python", label: "Python" },
  { key: "javascript", label: "JavaScript" },
];

const execConfig = {
  cpp: { language: "cpp", versionindex: "4" },
  java: { language: "java", versionindex: "5" },
  python: { language: "python3", versionindex: "4" },
  javascript: { language: "nodejs", versionindex: "4" },
};

function Section({ title, children }) {
  return (
    <section className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function ProblemDetail() {
  const { slug } = useParams();
  const { isAuthed } = useAuth();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [lang, setLang] = useState("javascript");
  const [code, setCode] = useState("");
  const [runResult, setRunResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  
  const [activeTab, setActiveTab] = useState("description");
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);

  const starter = useMemo(() => {
    const s = problem?.starterCode?.[lang];
    return typeof s === "string" ? s : "";
  }, [problem, lang]);

  const alertClass = useMemo(() => {
    if (!runResult) return "";
    if (!runResult.ok) return "alert-error";
    
    if (runResult.submitted || runResult.isTest) {
      const isAccepted = runResult.data?.verdict === "Accepted" || runResult.data?.message === "Accepted" || runResult.data?.message === "All visible testcases passed!";
      return isAccepted ? "alert-success" : "alert-error";
    }
    
    const hasError = runResult.data?.result?.error || runResult.data?.error || (runResult.data?.result?.statusCode && runResult.data?.result?.statusCode != 200);
    return hasError ? "alert-error" : "bg-base-200 text-base-content border border-base-300";
  }, [runResult]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await api.get(`/prob/problems/${slug}`);
        if (!cancelled) setProblem(res.data);
      } catch (e) {
        if (!cancelled) setErr(e?.response?.data?.message || "Failed to load problem");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!code) setCode(starter || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [starter]);

  useEffect(() => {
    if (activeTab === "submissions" && isAuthed) {
      let cancelled = false;
      async function loadSubmissions() {
        setLoadingSubmissions(true);
        try {
          const res = await api.get(`/submission/problem/${slug}`);
          if (!cancelled) setSubmissions(res.data?.submissions || []);
        } catch (e) {
          console.error(e);
        } finally {
          if (!cancelled) setLoadingSubmissions(false);
        }
      }
      loadSubmissions();
      return () => { cancelled = true; };
    }
  }, [activeTab, isAuthed, slug]);

  async function onRun() {
    if (!isAuthed) {
      setRunResult({ ok: false, error: "Please login or register first to run code." });
      return;
    }
    setRunning(true);
    setRunResult(null);
    try {
      const res = await api.post(`/code/test/${slug}`, {
        code,
        language: lang,
      });
      setRunResult({ ok: true, data: res.data, isTest: true });
    } catch (e) {
      setRunResult({
        ok: false,
        error: e?.response?.data?.message || "Run failed",
        raw: e?.response?.data,
      });
    } finally {
      setRunning(false);
    }
  }

  async function onSubmit() {
    if (!isAuthed) return;
    setSubmitting(true);
    setRunResult(null);
    try {
      const res = await api.post(`/submission/submit/${slug}`, { language: lang, code });
      setRunResult({ ok: true, data: res.data, submitted: true });
    } catch (e) {
      setRunResult({
        ok: false,
        error: e?.response?.data?.message || "Submit failed",
        raw: e?.response?.data,
      });
    } finally {
      setSubmitting(false);
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
  if (!problem) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{problem.title}</h1>
            <div className="mt-2 flex flex-wrap gap-2 items-center">
              <span className="badge badge-outline">{problem.difficulty}</span>
              {problem.tags && problem.tags.map((tag, idx) => (
                <span key={idx} className="badge badge-sm badge-neutral">{tag}</span>
              ))}
              <span className="text-sm text-base-content/60 ml-2">/{problem.slug}</span>
            </div>
          </div>
          <Link className="btn btn-ghost" to="/problems">
            Back
          </Link>
        </div>

        <div className="tabs tabs-boxed mb-6 bg-base-200/50 p-2 border border-base-300 rounded-xl flex gap-2">
          <button 
            className={`tab tab-lg flex-1 transition-all duration-300 rounded-lg ${activeTab === 'description' ? '!bg-primary !text-primary-content shadow-[0_0_15px_rgba(253,224,71,0.6)] font-bold scale-[1.02]' : 'hover:bg-base-300'}`} 
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`tab tab-lg flex-1 transition-all duration-300 rounded-lg ${activeTab === 'editorial' ? '!bg-primary !text-primary-content shadow-[0_0_15px_rgba(253,224,71,0.6)] font-bold scale-[1.02]' : 'hover:bg-base-300'}`} 
            onClick={() => setActiveTab('editorial')}
          >
            Editorial
          </button>
          <button 
            className={`tab tab-lg flex-1 transition-all duration-300 rounded-lg ${activeTab === 'submissions' ? '!bg-primary !text-primary-content shadow-[0_0_15px_rgba(253,224,71,0.6)] font-bold scale-[1.02]' : 'hover:bg-base-300'}`} 
            onClick={() => setActiveTab('submissions')}
          >
            Submissions
          </button>
          <button 
            className={`tab tab-lg flex-1 transition-all duration-300 rounded-lg ${activeTab === 'askai' ? '!bg-[linear-gradient(45deg,#8B5CF6,#EC4899)] !text-white shadow-[0_0_15px_rgba(139,92,246,0.6)] font-bold scale-[1.02] border-0' : 'hover:bg-base-300 text-purple-500 font-semibold'}`} 
            onClick={() => setActiveTab('askai')}
          >
            Ask AI ✨
          </button>
        </div>

        {activeTab === 'description' && (
          <div className="space-y-6 animate-fade-in">
            <Section title="Description">
              <div className="prose prose-sm md:prose-base max-w-none text-base-content whitespace-pre-wrap leading-relaxed">
                {problem.description}
              </div>
            </Section>

            {!!problem.examples?.length && (
              <Section title="Examples">
                <div className="space-y-4">
                  {problem.examples.map((ex, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-base-200">
                      <div className="text-sm font-semibold">Example {idx + 1}</div>
                      <div className="mt-2 grid gap-2">
                        <div>
                          <div className="text-xs text-base-content/60">Input</div>
                          <pre className="text-sm whitespace-pre-wrap">{ex.input}</pre>
                        </div>
                        <div>
                          <div className="text-xs text-base-content/60">Output</div>
                          <pre className="text-sm whitespace-pre-wrap">{ex.output}</pre>
                        </div>
                        {ex.explanation && (
                          <div>
                            <div className="text-xs text-base-content/60">Explanation</div>
                            <p className="text-sm whitespace-pre-wrap">{ex.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {!!problem.constraints?.length && (
              <Section title="Constraints">
                <ul className="list-disc pl-5 space-y-1">
                  {problem.constraints.map((c, idx) => (
                    <li key={idx} className="whitespace-pre-wrap">
                      {c}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>
        )}

        {activeTab === 'editorial' && (
          <div className="space-y-6 animate-fade-in">
            <Section title="Editorial / Solution">
              {problem.videoSolution?.videoUrl ? (
                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg mb-6 relative group cursor-pointer" onClick={() => setShowVideo(true)}>
                  {!showVideo ? (
                    <>
                      <img src={problem.videoSolution.thumbnailUrl || 'https://via.placeholder.com/640x360?text=Video+Solution'} alt="Thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                           <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={problem.videoSolution.videoUrl.replace("watch?v=", "embed/") + "?autoplay=1"} 
                      title="Video Solution" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              ) : (
                <p className="text-base-content/70 italic mb-4">No video solution available for this problem.</p>
              )}

              {problem.referenceSolution?.[lang] ? (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Reference Solution ({langOptions.find(o => o.key === lang)?.label || lang}):</h3>
                  <div className="bg-base-200 p-4 rounded-lg overflow-x-auto shadow-inner">
                    <pre className="text-sm"><code>{problem.referenceSolution[lang]}</code></pre>
                  </div>
                </div>
              ) : (
                <p className="text-base-content/70 italic mt-4">Reference solution may not be provided for {lang}.</p>
              )}
            </Section>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="space-y-6 animate-fade-in">
            <Section title="Your Submissions">
              {!isAuthed ? (
                <p className="text-base-content/70 italic">Please log in to view your submissions.</p>
              ) : loadingSubmissions ? (
                <div className="flex justify-center p-6"><span className="loading loading-spinner loading-md"></span></div>
              ) : submissions.length === 0 ? (
                <p className="text-base-content/70 italic">You have no submissions for this problem yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-base-200">
                  <table className="table table-sm table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Language</th>
                        <th>Date</th>
                        <th className="text-right">Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((sub) => (
                        <tr key={sub._id}>
                          <td>
                            <span className={`badge ${sub.status === 'Accepted' ? 'badge-success' : 'badge-error'}`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="uppercase text-xs font-semibold">{sub.language}</td>
                          <td className="text-xs text-base-content/70">{new Date(sub.createdAt).toLocaleString()}</td>
                          <td className="text-right">
                            <button className="btn btn-xs btn-outline" onClick={() => setSelectedCode(sub.code)}>View Code</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>
          </div>
        )}

        <div className={activeTab === 'askai' ? "space-y-6 animate-fade-in h-[600px]" : "hidden"}>
          <AskAI problemId={problem._id} code={code} language={lang} />
        </div>
      </div>

      <div className="space-y-6">
        <section className="card bg-base-100 shadow">
          <div className="card-body gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="card-title">Editor</h2>
              <select
                className="select select-bordered max-w-xs"
                value={lang}
                onChange={(e) => {
                  setLang(e.target.value);
                  setCode("");
                }}
              >
                {langOptions.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-[500px] border border-base-300 rounded-lg overflow-hidden shadow-inner">
              <Editor
                height="100%"
                language={lang}
                theme={document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'vs-dark'}
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                  fontFamily: 'monospace',
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  padding: { top: 16 },
                  automaticLayout: true,
                  wordWrap: 'on'
                }}
              />
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
              <button className="btn btn-outline" onClick={onRun} disabled={running}>
                {running ? "Running…" : "Run"}
              </button>
              <button
                className="btn btn-primary"
                onClick={onSubmit}
                disabled={!isAuthed || submitting}
                title={!isAuthed ? "Login to submit" : ""}
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>

            {!!runResult && (
              <div className={`alert ${alertClass}`}>
                <div className="w-full">
                  {runResult.ok ? (
                    <div className="space-y-2">
                      {runResult.submitted || runResult.isTest ? (
                        <div className="font-semibold">
                           {runResult.data?.verdict || runResult.data?.message || "OK"}
                        </div>
                      ) : (
                        <div className="font-semibold">Execution Output</div>
                      )}

                      {runResult.data?.result?.output && (
                        <pre className="whitespace-pre-wrap text-sm">
                          {runResult.data.result.output}
                        </pre>
                      )}
                      {runResult.data?.error && (
                        <pre className="whitespace-pre-wrap text-sm">{runResult.data.error}</pre>
                      )}
                      {runResult.data?.result?.error && (
                        <pre className="whitespace-pre-wrap text-sm">{runResult.data.result.error}</pre>
                      )}
                      {(runResult.data?.output || runResult.data?.expected) && (
                        <div className="grid gap-2 mt-2">
                          {runResult.data.input && (
                            <div className="bg-base-200/50 p-2 rounded border border-base-300">
                              <span className="text-xs font-bold text-base-content/70 uppercase">Input:</span>
                              <pre className="text-sm mt-1 whitespace-pre-wrap">{runResult.data.input}</pre>
                            </div>
                          )}
                          {runResult.data.expected && (
                            <div className="bg-base-200/50 p-2 rounded border border-base-300">
                              <span className="text-xs font-bold text-base-content/70 uppercase">Expected Output:</span>
                              <pre className="text-sm mt-1 whitespace-pre-wrap">{runResult.data.expected}</pre>
                            </div>
                          )}
                          {runResult.data.output && (
                            <div className="bg-base-200/50 p-2 rounded border border-base-300">
                              <span className="text-xs font-bold text-base-content/70 uppercase">Your Output:</span>
                              <pre className="text-sm mt-1 whitespace-pre-wrap">{runResult.data.output}</pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="font-semibold">{runResult.error}</div>
                      {runResult.raw && (
                        <pre className="whitespace-pre-wrap text-sm">
                          {JSON.stringify(runResult.raw, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {!isAuthed && (
              <div className="alert alert-warning">
                Login to submit solutions and view your submissions.
                <Link className="btn btn-sm ml-auto" to="/login">
                  Login
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      {selectedCode !== null && (
        <dialog className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-lg mb-4">Submission Code</h3>
            <div className="bg-base-200 p-4 rounded-lg overflow-x-auto shadow-inner max-h-[60vh]">
              <pre className="text-sm"><code>{selectedCode}</code></pre>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedCode(null)}>Close</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

