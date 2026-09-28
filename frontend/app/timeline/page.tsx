
"use client";

const events = [
  {
    step: "01",
    title: "Alert received",
    time: "09:41",
    color: "border-red-400/30 bg-red-400/5",
    label: "CRITICAL",
    description:
      "47 failed logins were followed by a successful login for rahul from a new endpoint.",
    evidence: [
      "47 failed logins",
      "Successful authentication",
      "New endpoint",
      "PowerShell activity",
    ],
  },
  {
    step: "02",
    title: "Initial hypothesis",
    time: "09:42",
    color: "border-amber-400/30 bg-amber-400/5",
    label: "INITIAL",
    description:
      "The investigation initially considered a possible brute-force attack.",
    evidence: [
      "Repeated authentication failures",
      "Single affected account",
    ],
  },
  {
    step: "03",
    title: "Hindsight recalled",
    time: "09:42",
    color: "border-cyan-400/30 bg-cyan-400/5",
    label: "MEMORY",
    description:
      "Previous credential-compromise, VPN false-positive, password-spraying, and PowerShell investigations were recalled.",
    evidence: [
      "Historical credential compromise",
      "VPN false positive",
      "Password spraying",
      "Suspicious PowerShell",
    ],
  },
  {
    step: "04",
    title: "Hypothesis evolved",
    time: "09:43",
    color: "border-purple-400/30 bg-purple-400/5",
    label: "UPDATED",
    description:
      "The hypothesis changed from simple brute force to potential credential compromise because successful access was followed by new-endpoint and PowerShell evidence.",
    evidence: [
      "Successful login after failures",
      "New endpoint",
      "PowerShell activity",
    ],
  },
  {
    step: "05",
    title: "Analyst decision",
    time: "09:45",
    color: "border-emerald-400/30 bg-emerald-400/5",
    label: "CONFIRMED",
    description:
      "The analyst reviewed the evidence and confirmed the credential-compromise investigation.",
    evidence: [
      "Analyst confirmation",
      "Evidence reviewed",
      "Investigation outcome recorded",
    ],
  },
  {
    step: "06",
    title: "Experience retained",
    time: "09:45",
    color: "border-blue-400/30 bg-blue-400/5",
    label: "LEARNED",
    description:
      "The analyst's decision, reasoning, and outcome were added to organizational memory for future investigations.",
    evidence: [
      "Decision retained",
      "Reason retained",
      "Outcome retained",
    ],
  },
];

export default function TimelinePage() {
  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
            Investigation history
          </p>

         <h1>Investigation Timeline</h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Follow how evidence, organizational memory, and analyst feedback
            changed the investigation from the first alert to a learned
            experience.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                Incident
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                INC-2026-0051
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Adaptive SOC investigation · Rahul authentication anomaly
              </p>
            </div>

            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-sm text-emerald-300">
              Memory loop completed
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-[25px] top-0 hidden h-full w-px bg-white/10 md:block" />

          <div className="space-y-6">
            {events.map((event) => (
              <div
                key={event.step}
                className="relative flex gap-5"
              >
                <div className="relative z-10 flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#0b1728] text-xs font-bold text-cyan-300">
                  {event.step}
                </div>

                <div
                  className={`flex-1 rounded-2xl border p-6 ${event.color}`}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold">
                          {event.title}
                        </h3>

                        <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-slate-300">
                          {event.label}
                        </span>
                      </div>

                      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        {event.description}
                      </p>
                    </div>

                    <span className="text-xs font-medium text-slate-500">
                      {event.time}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {event.evidence.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-xs text-slate-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            The adaptive loop
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-lg bg-white/5 px-4 py-3">
              Alert
            </span>

            <span className="text-slate-600">→</span>

            <span className="rounded-lg bg-cyan-400/10 px-4 py-3 text-cyan-300">
              Recall
            </span>

            <span className="text-slate-600">→</span>

            <span className="rounded-lg bg-purple-400/10 px-4 py-3 text-purple-300">
              Reason
            </span>

            <span className="text-slate-600">→</span>

            <span className="rounded-lg bg-emerald-400/10 px-4 py-3 text-emerald-300">
              Analyst
            </span>

            <span className="text-slate-600">→</span>

            <span className="rounded-lg bg-blue-400/10 px-4 py-3 text-blue-300">
              Retain
            </span>

            <span className="text-slate-600">→</span>

            <span className="rounded-lg bg-cyan-400/10 px-4 py-3 text-cyan-300">
              Future investigation
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}