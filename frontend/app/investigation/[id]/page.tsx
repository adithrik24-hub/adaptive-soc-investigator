"use client";

import { useEffect, useState } from "react";

type InvestigationResult = {
  incident_id: string;
  initial_hypothesis: string;
  hindsight_memory: any;
  updated_hypothesis: string;
  recommendation: string[];
};

export default function InvestigationPage() {
  const [result, setResult] = useState<InvestigationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decision, setDecision] = useState<string | null>(null);

  useEffect(() => {
    async function investigate() {
      try {
        setLoading(true);

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
                "A user has 47 failed login attempts followed by a successful login from a new endpoint. The source IP is unusual and PowerShell activity was observed. What previous security investigation experiences are relevant?",
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Investigation API returned ${response.status}`
          );
        }

        const data = await response.json();

        setResult(data);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to connect to the investigation service."
        );
      } finally {
        setLoading(false);
      }
    }

    investigate();
  }, []);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <header className="border-b border-white/10 bg-[#091524] px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
              AdaptiveSOC / Investigation
            </div>

            <h1 className="mt-2 text-2xl font-bold">
              INC-2026-0051
            </h1>
          </div>

          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-xs text-emerald-300">
            ● Hindsight connected
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-6 md:p-10">

        {/* CURRENT ALERT */}

        <section className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-red-400/10 px-3 py-1 text-xs font-bold text-red-300">
              CRITICAL
            </span>

            <span className="text-xs text-slate-500">
              CURRENT ALERT
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-bold">
            Suspicious Authentication Activity
          </h2>

          <p className="mt-2 text-slate-400">
            User{" "}
            <span className="font-semibold text-white">
              rahul
            </span>{" "}
            experienced repeated authentication failures followed
            by a successful login from a new endpoint.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Evidence label="Failed logins" value="47" />
            <Evidence label="Successful login" value="YES" />
            <Evidence label="New endpoint" value="YES" />
            <Evidence label="PowerShell" value="YES" />
            <Evidence label="Source IP" value="185.71.22.99" />
          </div>
        </section>

        {/* LOADING */}

        {loading && (
          <section className="mt-8 rounded-2xl border border-purple-400/20 bg-purple-400/5 p-8">
            <div className="flex items-center gap-4">
              <div className="h-3 w-3 animate-pulse rounded-full bg-purple-400" />

              <div>
                <div className="font-semibold text-purple-300">
                  Investigating with organizational memory…
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Hindsight is comparing this alert with previous
                  security investigations.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ERROR */}

        {error && (
          <section className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/5 p-6">
            <div className="font-semibold text-red-300">
              Investigation service unavailable
            </div>

            <p className="mt-2 text-sm text-slate-400">
              {error}
            </p>
          </section>
        )}

        {/* RESULTS */}

        {result && !loading && (
          <>
            {/* STEP 01 */}

            <div className="mt-8 grid gap-6 lg:grid-cols-2">

              <section className="rounded-2xl border border-white/10 bg-[#091524] p-6">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Step 01
                </div>

                <h2 className="mt-2 text-lg font-semibold">
                  Initial hypothesis
                </h2>

                <div className="mt-5 rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-5">
                  <div className="text-sm font-semibold text-yellow-300">
                    {result.initial_hypothesis}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    The initial assessment is based only on the
                    current alert evidence, before historical
                    investigation experience is considered.
                  </p>
                </div>
              </section>

              {/* STEP 02 */}

              <section className="rounded-2xl border border-purple-400/20 bg-purple-400/5 p-6">
                <div className="text-xs uppercase tracking-[0.2em] text-purple-300">
                  Step 02
                </div>

                <h2 className="mt-2 text-lg font-semibold">
                  Searching organizational memory
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Hindsight compared this alert with previous
                  investigation experiences.
                </p>

                <div className="mt-5 rounded-xl border border-purple-400/20 bg-[#0b1628] p-5">

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      Relevant experiences
                    </span>

                    <span className="rounded-full bg-purple-400/10 px-3 py-1 text-xs text-purple-300">
                      Hindsight
                    </span>
                  </div>

                  <MemoryList memory={result.hindsight_memory} />

                </div>
              </section>
            </div>

            {/* STEP 03 */}

            <section className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 md:p-8">
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                Step 03
              </div>

              <h2 className="mt-2 text-xl font-semibold">
                What changed because of memory?
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">

                <Comparison
                  title="Current evidence"
                  items={[
                    "47 failed login attempts",
                    "Successful login occurred",
                    "New endpoint observed",
                    "PowerShell activity observed",
                  ]}
                />

                <Comparison
                  title="Historical context"
                  items={[
                    "Previous credential compromises involved successful access after failures.",
                    "New-device context increased concern in previous investigations.",
                    "PowerShell activity can add endpoint context to an authentication alert.",
                    "Corporate VPN false positives had trusted infrastructure context.",
                  ]}
                />

              </div>
            </section>

            {/* UPDATED HYPOTHESIS */}

            <section className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 md:p-8">

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  HYPOTHESIS UPDATED
                </span>

                <span className="text-xs text-slate-500">
                  MEMORY-INFORMED
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-bold">
                {result.updated_hypothesis}
              </h2>

              <div className="mt-6 rounded-xl border border-white/10 bg-black/10 p-5">

                <div className="text-xs uppercase tracking-wider text-slate-500">
                  Recommended investigation
                </div>

                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {result.recommendation.map((item) => (
                    <li key={item}>
                      → {item}
                    </li>
                  ))}
                </ul>

              </div>
            </section>

            {/* ANALYST DECISION */}

            <section className="mt-6 rounded-2xl border border-white/10 bg-[#091524] p-6 md:p-8">

              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Step 04
              </div>

              <h2 className="mt-2 text-xl font-semibold">
                Analyst decision
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Human confirmation keeps the investigation in the loop.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <button
                  onClick={() => setDecision("Confirmed")}
                  className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-[#06101c] hover:bg-emerald-300"
                >
                  Confirm hypothesis
                </button>

                <button
                  onClick={() => setDecision("Rejected")}
                  className="rounded-xl border border-red-400/30 bg-red-400/5 px-5 py-3 text-sm font-semibold text-red-300 hover:bg-red-400/10"
                >
                  Reject
                </button>

                <button
                  onClick={() => setDecision("Modified")}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5"
                >
                  Modify
                </button>

              </div>

              {decision && (
                <div className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm text-cyan-300">
                  Analyst decision recorded:{" "}
                  <span className="font-bold">
                    {decision}
                  </span>
                </div>
              )}

            </section>
          </>
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
    <div className="rounded-xl border border-white/10 bg-black/10 p-4">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </div>

      <div className="mt-2 break-all font-mono text-sm font-semibold">
        {value}
      </div>
    </div>
  );
}


function MemoryList({
  memory,
}: {
  memory: any;
}) {
  if (!memory) {
    return (
      <div className="mt-4 text-sm text-slate-500">
        No historical memory returned.
      </div>
    );
  }

  const text =
    typeof memory === "string"
      ? memory
      : JSON.stringify(memory, null, 2);

  return (
    <div className="mt-4 max-h-80 overflow-auto rounded-lg border border-white/10 bg-black/20 p-4">
      <pre className="whitespace-pre-wrap text-xs leading-5 text-slate-400">
        {text}
      </pre>
    </div>
  );
}


function Comparison({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#091524] p-5">
      <h3 className="text-sm font-semibold">
        {title}
      </h3>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm text-slate-400"
          >
            <span className="text-cyan-400">
              •
            </span>

            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}