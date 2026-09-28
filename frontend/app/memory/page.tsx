"use client";

import { useEffect, useState } from "react";

export default function MemoryPage() {
  const [memory, setMemory] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(
      "http://127.0.0.1:8000/api/memories?query=credential%20compromise%20PowerShell%20new%20endpoint"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setMemory(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load Hindsight memory.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
          Organizational Memory
        </p>

        <h1 className="mt-2 text-4xl font-semibold">
          Memory Explorer
        </h1>

        <p className="mt-3 text-slate-400">
          Investigation experiences recalled from Hindsight.
        </p>

        {loading && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            Searching Hindsight...
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/5 p-6 text-red-300">
            {error}
          </div>
        )}

        {memory && !loading && (
          <div className="mt-8">
            <div className="mb-5 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-sm text-emerald-300">
              Hindsight connected
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="mb-4 text-xl font-semibold">
                Retrieved investigation experience
              </h2>

              <pre className="overflow-auto rounded-xl bg-[#050d18] p-5 text-sm leading-6 text-slate-300">
                {JSON.stringify(memory, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}