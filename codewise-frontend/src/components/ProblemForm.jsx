import { useState } from "react";

const languages = ["cpp", "java", "python", "javascript"];
const emptyExample = { input: "", output: "", explanation: "" };
const emptyTestcase = { input: "", expectedOutput: "", explanation: "" };

export default function ProblemForm({
  mode,
  initial,
  onSubmit,
  loading,
  error,
  success,
  header,
  actions,
}) {
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [difficulty, setDifficulty] = useState(initial.difficulty || "EASY");
  const [tagsInput, setTagsInput] = useState((initial.tags || []).join(", "));
  const [videoFile, setVideoFile] = useState(null);

  const [constraints, setConstraints] = useState(
    initial.constraints?.length ? initial.constraints : [""]
  );
  const [hints, setHints] = useState(initial.hints?.length ? initial.hints : ["" ]);
  const [examples, setExamples] = useState(
    initial.examples?.length ? initial.examples : [emptyExample]
  );
  const [visibleTestcases, setVisibleTestcases] = useState(
    initial.visibletestcases?.length ? initial.visibletestcases : [emptyTestcase]
  );
  const [hiddenTestcases, setHiddenTestcases] = useState(
    initial.hiddentestcases?.length ? initial.hiddentestcases : [emptyTestcase]
  );
  const [starterCode, setStarterCode] = useState(
    initial.starterCode || {
      cpp: "",
      java: "",
      python: "",
      javascript: "",
    }
  );
  const [referenceSolution, setReferenceSolution] = useState(
    initial.referenceSolution || {
      cpp: "",
      java: "",
      python: "",
      javascript: "",
    }
  );

  const [localError, setLocalError] = useState("");

  function parseTags() {
    return tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function normalizeStringArray(arr, fieldName) {
    const output = arr.map((v) => v.trim()).filter(Boolean);
    if (output.length === 0) throw new Error(`Add at least one "${fieldName}" value`);
    return output;
  }

  function normalizeExamples(arr) {
    const output = arr
      .map((e) => ({
        input: e.input.trim(),
        output: e.output.trim(),
        explanation: e.explanation?.trim() || "",
      }))
      .filter((e) => e.input && e.output);
    if (output.length === 0) throw new Error("Add at least one valid example (input + output)");
    return output;
  }

  function normalizeTestcases(arr, fieldName) {
    const output = arr
      .map((t) => ({
        input: t.input.trim(),
        expectedOutput: t.expectedOutput.trim(),
        explanation: t.explanation?.trim() || "",
      }))
      .filter((t) => t.input && t.expectedOutput);
    if (output.length === 0) throw new Error(`Add at least one valid ${fieldName} testcase`);
    return output;
  }

  function updateStringList(setter, index, value) {
    setter((prev) => prev.map((row, i) => (i === index ? value : row)));
  }

  function addStringListRow(setter) {
    setter((prev) => [...prev, ""]);
  }

  function removeStringListRow(setter, index) {
    setter((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  function updateObjectList(setter, index, key, value) {
    setter((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
  }

  function addObjectListRow(setter, emptyRow) {
    setter((prev) => [...prev, emptyRow]);
  }

  function removeObjectListRow(setter, index) {
    setter((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");
    const tags = parseTags();
    const normalizedConstraints = normalizeStringArray(constraints, "constraints");
    const normalizedHints = normalizeStringArray(hints, "hints");
    const normalizedExamples = normalizeExamples(examples);
    const normalizedVisible = normalizeTestcases(visibleTestcases, "visible");
    const normalizedHidden = normalizeTestcases(hiddenTestcases, "hidden");

    if (tags.length === 0) throw new Error("Add at least one tag");

    await onSubmit({
      title: title.trim(),
      description,
      difficulty,
      tags,
      constraints: normalizedConstraints,
      hints: normalizedHints,
      examples: normalizedExamples,
      visibletestcases: normalizedVisible,
      hiddentestcases: normalizedHidden,
      starterCode,
      referenceSolution,
      videoFile,
    });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {header}

      {!!error && <div className="alert alert-error">{error}</div>}
      {!!localError && <div className="alert alert-error">{localError}</div>}
      {!!success && <div className="alert alert-success">{success}</div>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e).catch((err) => {
            setLocalError(err?.message || "Validation failed");
          });
        }}
        className="space-y-6"
      >
        <section className="card bg-base-100 shadow">
          <div className="card-body space-y-4">
            <h2 className="card-title">Basic Details</h2>
            <input
              className="input input-bordered w-full"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="textarea textarea-bordered h-40"
              placeholder="Problem description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div className="grid gap-4 md:grid-cols-2">
              <select
                className="select select-bordered"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
              {mode === "create" && (
                <input
                  className="file-input file-input-bordered w-full"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                />
              )}
            </div>
            <input
              className="input input-bordered w-full"
              placeholder="Tags (comma-separated): array, hash-map, dp"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              required
            />
          </div>
        </section>

        <section className="card bg-base-100 shadow">
          <div className="card-body space-y-4">
            <h2 className="card-title">Examples</h2>
            {examples.map((row, index) => (
              <div key={`ex-${index}`} className="p-4 rounded-lg border border-base-300 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Example #{index + 1}</p>
                  <button
                    type="button"
                    className="btn btn-xs btn-error btn-outline"
                    onClick={() => removeObjectListRow(setExamples, index)}
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Input"
                  value={row.input}
                  onChange={(e) => updateObjectList(setExamples, index, "input", e.target.value)}
                />
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Output"
                  value={row.output}
                  onChange={(e) => updateObjectList(setExamples, index, "output", e.target.value)}
                />
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Explanation (optional)"
                  value={row.explanation}
                  onChange={(e) =>
                    updateObjectList(setExamples, index, "explanation", e.target.value)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => addObjectListRow(setExamples, emptyExample)}
            >
              + Add Example
            </button>
          </div>
        </section>

        <section className="card bg-base-100 shadow">
          <div className="card-body space-y-4">
            <h2 className="card-title">Constraints & Hints</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Constraints</h3>
                {constraints.map((value, index) => (
                  <div key={`constraint-${index}`} className="flex gap-2">
                    <input
                      className="input input-bordered w-full"
                      value={value}
                      onChange={(e) => updateStringList(setConstraints, index, e.target.value)}
                      placeholder="e.g. 1 <= n <= 10^5"
                    />
                    <button
                      type="button"
                      className="btn btn-error btn-outline"
                      onClick={() => removeStringListRow(setConstraints, index)}
                    >
                      x
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => addStringListRow(setConstraints)}
                >
                  + Add Constraint
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Hints</h3>
                {hints.map((value, index) => (
                  <div key={`hint-${index}`} className="flex gap-2">
                    <input
                      className="input input-bordered w-full"
                      value={value}
                      onChange={(e) => updateStringList(setHints, index, e.target.value)}
                      placeholder="e.g. Use two pointers"
                    />
                    <button
                      type="button"
                      className="btn btn-error btn-outline"
                      onClick={() => removeStringListRow(setHints, index)}
                    >
                      x
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => addStringListRow(setHints)}
                >
                  + Add Hint
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="card bg-base-100 shadow">
          <div className="card-body space-y-4">
            <h2 className="card-title">Testcases</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-semibold">Visible testcases</h3>
                {visibleTestcases.map((row, index) => (
                  <div key={`v-${index}`} className="p-3 rounded-lg border border-base-300 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Case #{index + 1}</span>
                      <button
                        type="button"
                        className="btn btn-xs btn-error btn-outline"
                        onClick={() => removeObjectListRow(setVisibleTestcases, index)}
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      placeholder="Input"
                      value={row.input}
                      onChange={(e) =>
                        updateObjectList(setVisibleTestcases, index, "input", e.target.value)
                      }
                    />
                    <textarea
                      className="textarea textarea-bordered w-full"
                      placeholder="Expected Output"
                      value={row.expectedOutput}
                      onChange={(e) =>
                        updateObjectList(
                          setVisibleTestcases,
                          index,
                          "expectedOutput",
                          e.target.value
                        )
                      }
                    />
                    <textarea
                      className="textarea textarea-bordered w-full"
                      placeholder="Explanation (optional)"
                      value={row.explanation}
                      onChange={(e) =>
                        updateObjectList(
                          setVisibleTestcases,
                          index,
                          "explanation",
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => addObjectListRow(setVisibleTestcases, emptyTestcase)}
                >
                  + Add Visible Case
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Hidden testcases</h3>
                {hiddenTestcases.map((row, index) => (
                  <div key={`h-${index}`} className="p-3 rounded-lg border border-base-300 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Case #{index + 1}</span>
                      <button
                        type="button"
                        className="btn btn-xs btn-error btn-outline"
                        onClick={() => removeObjectListRow(setHiddenTestcases, index)}
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      placeholder="Input"
                      value={row.input}
                      onChange={(e) =>
                        updateObjectList(setHiddenTestcases, index, "input", e.target.value)
                      }
                    />
                    <textarea
                      className="textarea textarea-bordered w-full"
                      placeholder="Expected Output"
                      value={row.expectedOutput}
                      onChange={(e) =>
                        updateObjectList(
                          setHiddenTestcases,
                          index,
                          "expectedOutput",
                          e.target.value
                        )
                      }
                    />
                    <textarea
                      className="textarea textarea-bordered w-full"
                      placeholder="Explanation (optional)"
                      value={row.explanation}
                      onChange={(e) =>
                        updateObjectList(
                          setHiddenTestcases,
                          index,
                          "explanation",
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => addObjectListRow(setHiddenTestcases, emptyTestcase)}
                >
                  + Add Hidden Case
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="card bg-base-100 shadow">
          <div className="card-body space-y-4">
            <h2 className="card-title">Starter Code & Reference Solution</h2>
            {languages.map((lang) => (
              <div key={lang} className="rounded-lg border border-base-300 p-4 space-y-2">
                <p className="font-semibold uppercase">{lang}</p>
                <div className="grid gap-3 lg:grid-cols-2">
                  <div>
                    <p className="text-sm mb-1 text-base-content/70">Starter code</p>
                    <textarea
                      className="textarea textarea-bordered w-full h-40 font-mono text-sm"
                      value={starterCode[lang]}
                      onChange={(e) =>
                        setStarterCode((prev) => ({ ...prev, [lang]: e.target.value }))
                      }
                      placeholder={`Starter code for ${lang}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm mb-1 text-base-content/70">Reference solution</p>
                    <textarea
                      className="textarea textarea-bordered w-full h-40 font-mono text-sm"
                      value={referenceSolution[lang]}
                      onChange={(e) =>
                        setReferenceSolution((prev) => ({ ...prev, [lang]: e.target.value }))
                      }
                      placeholder={`Reference solution for ${lang}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-between items-center">
          <div>{actions}</div>
          <button className="btn btn-primary" disabled={loading}>
            {mode === "create" ? (loading ? "Creating..." : "Create Problem") : loading ? "Updating..." : "Update Problem"}
          </button>
        </div>
      </form>
    </div>
  );
}

