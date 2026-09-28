import Link from "next/link";
const incidents = [
  {
    id: "INC-2026-0051",
    title: "Suspicious Authentication Activity",
    severity: "CRITICAL",
    user: "rahul",
    evidence: "47 failed logins → successful login → new endpoint → PowerShell",
    status: "Needs investigation",
  },
  {
    id: "INC-2026-0048",
    title: "Unusual PowerShell Execution",
    severity: "HIGH",
    user: "meera",
    evidence: "Encoded PowerShell + unusual parent process",
    status: "Investigating",
  },
  {
    id: "INC-2026-0042",
    title: "Multiple Authentication Failures",
    severity: "MEDIUM",
    user: "anita",
    evidence: "Corporate VPN source + repeated failures",
    status: "Resolved",
  },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-white/10 bg-[#091524] p-6 md:block">
          <div className="mb-10">
            <div className="text-xl font-bold tracking-tight">
              Adaptive<span className="text-cyan-400">SOC</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Investigator
            </div>
          </div>

          <nav className="space-y-2">
            <div className="rounded-xl bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-300">
              ◈ Investigation Queue
            </div>

            <div className="rounded-xl px-4 py-3 text-sm text-slate-400 hover:bg-white/5">
              ◉ Memory Explorer
            </div>

            <div className="rounded-xl px-4 py-3 text-sm text-slate-400 hover:bg-white/5">
              ◷ Investigation Timeline
            </div>
          </nav>

          <div className="mt-auto pt-20">
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
              <div className="text-xs text-emerald-400">
                MEMORY SYSTEM
              </div>
              <div className="mt-2 text-lg font-semibold">
                Online
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Hindsight connected
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="flex-1">
          {/* Header */}
          <header className="border-b border-white/10 bg-[#091524]/80 px-6 py-5 backdrop-blur md:px-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
                  Security Operations Center
                </p>
                <h1 className="mt-2 text-2xl font-bold">
                  Investigation Queue
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-xs text-emerald-300 sm:block">
                  ● Hindsight online
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-bold text-cyan-300">
                  SA
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 md:p-10">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Stat label="Open investigations" value="12" />
              <Stat label="Critical alerts" value="3" />
              <Stat label="Memory experiences" value="9" />
              <Stat label="Analyst decisions" value="27" />
            </div>

            {/* Hero */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-[#0b1b2d] to-[#091524]">
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-red-400/10 px-3 py-1 text-xs font-bold text-red-300">
                    CRITICAL
                  </span>
                  <span className="text-xs text-slate-500">
                    NEW INVESTIGATION
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-bold md:text-3xl">
                  INC-2026-0051
                </h2>

                <p className="mt-2 max-w-2xl text-slate-400">
                  Suspicious authentication activity involving repeated
                  failures followed by a successful login from a new
                  endpoint.
                </p>

                <div className="mt-6 grid gap-3 md:grid-cols-4">
                  <Evidence label="Failed logins" value="47" />
                  <Evidence label="Successful login" value="YES" />
                  <Evidence label="New endpoint" value="YES" />
                  <Evidence label="PowerShell" value="YES" />
                </div>

                <Link
  href="/investigation/INC-2026-0051"
  className="inline-flex items-center rounded-xl bg-cyan-300 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-200"
>
  Investigate with Memory →
</Link>
              </div>
            </div>

            {/* Queue */}
            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    Recent investigations
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Alerts waiting for analyst review
                  </p>
                </div>

                <span className="text-xs text-slate-500">
                  Updated just now
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#091524]">
                {incidents.map((incident, index) => (
                  <div
                    key={incident.id}
                    className={`p-5 transition hover:bg-white/[0.03] ${
                      index !== incidents.length - 1
                        ? "border-b border-white/10"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm text-cyan-300">
                            {incident.id}
                          </span>

                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                              incident.severity === "CRITICAL"
                                ? "bg-red-400/10 text-red-300"
                                : incident.severity === "HIGH"
                                  ? "bg-orange-400/10 text-orange-300"
                                  : "bg-yellow-400/10 text-yellow-300"
                            }`}
                          >
                            {incident.severity}
                          </span>
                        </div>

                        <h3 className="mt-2 font-medium">
                          {incident.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {incident.evidence}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500">
                          {incident.user}
                        </span>

                        <button className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5">
                          Open
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Memory message */}
            <div className="mt-8 rounded-2xl border border-purple-400/20 bg-purple-400/5 p-6">
              <div className="flex gap-4">
                <div className="text-2xl">🧠</div>
                <div>
                  <h3 className="font-semibold">
                    Your investigations become organizational memory
                  </h3>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">
                    Adaptive SOC compares new alerts with previous
                    investigations, analyst decisions, and outcomes.
                    The goal is not simply to retrieve old cases —
                    it is to change how the next investigation is performed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#091524] p-5">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
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
      <div className="mt-2 font-mono text-sm font-semibold text-white">
        {value}
      </div>
    </div>
  );
}