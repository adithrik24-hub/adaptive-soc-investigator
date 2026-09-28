"use client";

import { useEffect, useState } from "react";

type InvestigationResult = {
  incident_id: string;
  initial_hypothesis: string;
  hindsight_memory: {
    [key: string]: unknown;
  };
  updated_hypothesis: string;
  recommendation: string[];
};

type Decision = "Confirmed" | "Rejected" | "Modified" | null;

const memoryExperiences = [
  {
    title: "Credential compromise",
    severity: "High",
    description:
      "Repeated failed logins followed by successful access from a new device and unusual location.",
    relevance:
      "Strong match: successful authentication after repeated failures plus a new endpoint.",
  },
  {
    title: "Corporate VPN false positive",
    severity: "Medium",
    description:
      "High authentication failure volume originated from known corporate VPN infrastructure.",
    relevance:
      "Partial match: authentication failures are similar, but this alert includes additional endpoint evidence.",
  },
  {
    title: "Password spraying",
    severity: "Medium",
    description:
      "One source IP attempted authentication against multiple user accounts.",
    relevance:
      "Possible relationship: check whether the same source targeted additional accounts.",
  },
  {
    title: "Suspicious PowerShell",
    severity: "High",
    description:
      "PowerShell execution became concerning because of command characteristics and execution context.",
    relevance:
      "Strong supporting evidence: PowerShell activity increases concern beyond authentication anomalies alone.",
  },
];

export default function InvestigationPage() {
  const [result, setResult] = useState<InvestigationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [decision, setDecision] = useState<Decision>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => {
    async function investigate() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://127.0.0.1:8000/api/investigate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              incident_id: "INC-2026-0051",
              query:
                "47 failed logins followed by a successful login for rahul, new endpoint, unusual source IP, and PowerShell activity. Investigate whether this is brute force, credential compromise, password spraying, VPN false positive, or another attack pattern.",
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Investigation request failed with status ${response.status}`
          );
        }

        const data = await response.json();
        setResult(data);
      } catch (err) {
        console.error(err);
        setError(
          "Could not connect to the investigation backend. Make sure FastAPI and Hindsight are running."
        );
      } finally {
        setLoading(false);
      }
    }

    investigate();
  }, []);

  async function submitDecision(selectedDecision: Decision) {
    if (!selectedDecision) {
      return;
    }

    const defaultReasons: Record<string, string> = {
      Confirmed:
        "Confirmed after reviewing the historical evidence and current incident indicators.",
      Rejected:
        "Rejected after reviewing the current evidence and historical investigation context.",
      Modified:
        "Modified after reviewing the historical evidence and current incident indicators.",
    };

    const finalReason =
      reason.trim() || defaultReasons[selectedDecision];

    try {
      setSubmitting(true);
      setFeedbackError("");
      setFeedbackSaved(false);

      const response = await fetch(
        "http://127.0.0.1:8000/api/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            incident_id: "INC-2026-0051",
            decision: selectedDecision,
            reason: finalReason,
            outcome:
              selectedDecision === "Confirmed"
                ? "Credential compromise investigation confirmed."
                : selectedDecision === "Rejected"
                ? "Initial investigation hypothesis rejected after analyst review."
                : "Investigation hypothesis modified after analyst review.",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Feedback request failed with status ${response.status}`
        );
      }

      await response.json();

      setDecision(selectedDecision);
      setReason(finalReason);
      setFeedbackSaved(true);
    } catch (err) {
      console.error(err);
      setFeedbackError(
        "The analyst decision could not be saved. Check that FastAPI and Hindsight are running."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">

        <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-7 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <a
                href="/"
                className="text-sm text-slate-400 hover:text-white"
              >
                ← Investigation Queue
              </a>

              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                Hindsight online
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Adaptive Investigation
            </h1>

            <p className="mt-2 text-slate-400">
              INC-2026-0051 · Authentication anomaly
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Incident
            </p>

            <p className="mt-1 font-mono text-lg text-cyan-300">
              INC-2026-0051
            </p>
          </div>
        </header>

        <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Current evidence
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Suspicious authentication activity
              </h2>
            </div>

            <span className="rounded-full border border-red-400/30 bg-red-400/10 px-3 py-1 text-xs font-medium text-red-300">
              High Risk
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            <Evidence label="User" value="rahul" />
            <Evidence label="Failed logins" value="47" />
            <Evidence label="Successful login" value="YES" />
            <Evidence label="New endpoint" value="YES" />
            <Evidence label="PowerShell" value="YES" />
            <Evidence label="Source IP" value="185.x.x.x" />
          </div>
        </section>

        {loading && (
          <section className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-10 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-300" />

            <h2 className="text-xl font-semibold">
              Searching organizational memory…
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Hindsight is retrieving relevant investigation experiences.
            </p>
          </section>
        )}

        {!loading && error && (
          <section className="rounded-3xl border border-red-400/20 bg-red-400/[0.05] p-8">
            <h2 className="text-lg font-semibold text-red-300">
              Investigation unavailable
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {error}
            </p>
          </section>
        )}

        {!loading && !error && result && (
          <div className="space-y-6">

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <StepHeader
                number="01"
                title="Initial hypothesis"
                subtitle="What the investigator would conclude without historical context"
              />

              <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-amber-300/70">
                  Initial assessment
                </p>

                <p className="mt-2 text-lg font-medium text-amber-100">
                  {result.initial_hypothesis}
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.035] p-6">
              <StepHeader
                number="02"
                title="Searching organizational memory"
                subtitle="Hindsight retrieves previous investigation experiences"
              />

              <div className="mt-6 flex items-center gap-3">
                <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-sm font-medium text-cyan-300">
                  {memoryExperiences.length} relevant experiences found
                </div>

                <span className="text-sm text-slate-500">
                  Memory retrieval complete
                </span>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {memoryExperiences.map((memory) => (
                  <Memory
                    key={memory.title}
                    title={memory.title}
                    severity={memory.severity}
                    description={memory.description}
                    relevance={memory.relevance}
                  />
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-400/10 bg-slate-950/40 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/50" />

                  <p className="text-sm text-slate-300">
                    Hindsight response received. Historical evidence is now
                    influencing the investigation.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <StepHeader
                number="03"
                title="What changed because of memory?"
                subtitle="The investigation compares remembered patterns with current evidence"
              />

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Comparison
                  title="Similarities remembered"
                  items={[
                    "Repeated failed authentication attempts",
                    "Successful authentication after failures",
                    "Potential relationship to credential abuse",
                    "PowerShell activity appears in prior investigations",
                  ]}
                />

                <Comparison
                  title="Differences that changed the investigation"
                  items={[
                    "A successful login occurred",
                    "The endpoint is new for the user",
                    "PowerShell activity adds endpoint evidence",
                    "Source reputation and device history need verification",
                  ]}
                  positive
                />
              </div>

              <div className="mt-5 rounded-2xl border border-purple-400/20 bg-purple-400/[0.05] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-purple-300/70">
                  Updated hypothesis
                </p>

                <p className="mt-2 text-lg font-medium leading-7 text-purple-100">
                  {result.updated_hypothesis}
                </p>
              </div>
            </section>
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <StepHeader
                number="04"
                title="Recommended investigation steps"
                subtitle="Human analyst remains in control"
              />

              <div className="mt-5 space-y-3">
                {result.recommendation.map((item, index) => (
                  <div
                    key={item}
                    className="flex gap-4 rounded-2xl border border-white/5 bg-slate-950/30 p-4"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-slate-300">
                      {index + 1}
                    </div>

                    <p className="text-sm leading-6 text-slate-300">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.035] p-6">
              <StepHeader
                number="05"
                title="Analyst decision"
                subtitle="Your decision becomes organizational experience"
              />

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <button
                  onClick={() => submitDecision("Confirmed")}
                  disabled={submitting}
                  className={`rounded-2xl border px-5 py-4 text-left transition ${
                    decision === "Confirmed"
                      ? "border-emerald-300 bg-emerald-300/15"
                      : "border-emerald-400/20 bg-emerald-400/[0.04] hover:bg-emerald-400/[0.09]"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <p className="font-semibold text-emerald-200">
                    Confirmed
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Confirm the investigation conclusion.
                  </p>
                </button>

                <button
                  onClick={() => submitDecision("Rejected")}
                  disabled={submitting}
                  className={`rounded-2xl border px-5 py-4 text-left transition ${
                    decision === "Rejected"
                      ? "border-red-300 bg-red-300/15"
                      : "border-red-400/20 bg-red-400/[0.04] hover:bg-red-400/[0.09]"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <p className="font-semibold text-red-200">
                    Rejected
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Reject the investigation conclusion.
                  </p>
                </button>

                <button
                  onClick={() => submitDecision("Modified")}
                  disabled={submitting}
                  className={`rounded-2xl border px-5 py-4 text-left transition ${
                    decision === "Modified"
                      ? "border-amber-300 bg-amber-300/15"
                      : "border-amber-400/20 bg-amber-400/[0.04] hover:bg-amber-400/[0.09]"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <p className="font-semibold text-amber-200">
                    Modified
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Change the investigation conclusion.
                  </p>
                </button>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="reason"
                  className="text-sm font-medium text-slate-300"
                >
                  Analyst reasoning
                </label>

                <textarea
                  id="reason"
                  value={reason}
                  onChange={(event) => {
                    setReason(event.target.value);
                    setFeedbackSaved(false);
                  }}
                  placeholder="Explain why you confirmed, rejected, or modified the investigation..."
                  className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                />
              </div>

              {decision && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Current decision
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {decision}
                  </p>
                </div>
              )}

              {feedbackError && (
                <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-4">
                  <p className="text-sm text-red-300">
                    {feedbackError}
                  </p>
                </div>
              )}

              {feedbackSaved && (
                <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-lg shadow-emerald-300/40" />

                    <div>
                      <p className="font-semibold text-emerald-200">
                        Decision recorded
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        The analyst decision and reasoning were added to
                        organizational memory. Future investigations can now
                        learn from this outcome.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => submitDecision(decision)}
                  disabled={!decision || submitting}
                  className="rounded-xl bg-cyan-300 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting
                    ? "Teaching Hindsight…"
                    : "Save decision to memory →"}
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-purple-400/20 bg-purple-400/[0.04] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-purple-300/70">
                Adaptive learning loop
              </p>

              <div className="mt-4 flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
                <span className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  Current alert
                </span>

                <span className="text-purple-300">→</span>

                <span className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  Hindsight recall
                </span>

                <span className="text-purple-300">→</span>

                <span className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  Analyst decision
                </span>

                <span className="text-purple-300">→</span>

                <span className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] px-4 py-3 text-emerald-200">
                  Hindsight retain
                </span>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
function Evidence({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-mono text-sm text-slate-200">
        {value}
      </p>
    </div>
  );
}


function StepHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] font-mono text-sm text-cyan-300">
        {number}
      </div>

      <div>
        <h2 className="text-xl font-semibold">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}


function Memory({
  title,
  severity,
  description,
  relevance,
}: {
  title: string;
  severity: string;
  description: string;
  relevance: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-slate-950/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold text-slate-100">
          {title}
        </h3>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
            severity === "High"
              ? "bg-red-400/10 text-red-300"
              : "bg-amber-400/10 text-amber-300"
          }`}
        >
          {severity}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <div className="mt-4 border-t border-white/5 pt-4">
        <p className="text-xs uppercase tracking-wider text-cyan-300/70">
          Why it matters
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-300">
          {relevance}
        </p>
      </div>
    </div>
  );
}


function Comparison({
  title,
  items,
  positive = false,
}: {
  title: string;
  items: string[];
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-slate-950/40 p-5">
      <h3
        className={`font-semibold ${
          positive
            ? "text-emerald-200"
            : "text-slate-200"
        }`}
      >
        {title}
      </h3>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex gap-3"
          >
            <span
              className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                positive
                  ? "bg-emerald-300"
                  : "bg-cyan-300"
              }`}
            />

            <p className="text-sm leading-6 text-slate-400">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}