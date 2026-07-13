// "use client";

// import { useEffect, useState } from "react";
// import DonationChart from "@/components/DonationChart";
// import CountChart from "@/components/CountChart";
// import { assistProApiFetch, coreApiFetch } from "@/helpers/httpClient";

// interface Student {
//   id: number | string;
//   name: string;
//   branch_id: number | string;
//   created_at?: string;
// }

// interface Donation {
//   id: number | string;
//   student_id: number | string;
//   date?: string;
//   amount: number | string;
//   mode_of_payment: "cash" | "bank";
//   created_at?: string;
// }

// interface Branch {
//   id: number | string;
//   name: string;
// }

// const AdminPage = () => {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [donations, setDonations] = useState<Donation[]>([]);
//   const [branches, setBranches] = useState<Branch[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       const [studentsRes, donationsRes, branchesRes] = await Promise.allSettled([
//         assistProApiFetch("students/all?limit=10000", { method: "GET" }),
//         assistProApiFetch("donations?limit=10000", { method: "GET" }),
//         coreApiFetch("po_branches/ajax_all_branch_info", { method: "GET" }),
//       ]);

//       if (studentsRes.status === "fulfilled") setStudents(studentsRes.value.data || []);
//       else console.error("Failed to load students:", studentsRes.reason);

//       if (donationsRes.status === "fulfilled") setDonations(donationsRes.value.data || []);
//       else console.error("Failed to load donations:", donationsRes.reason);

//       if (branchesRes.status === "fulfilled") {
//         setBranches(Array.isArray(branchesRes.value) ? branchesRes.value : []);
//       } else {
//         console.error("Failed to load branches:", branchesRes.reason);
//       }

//       setLoading(false);
//     }
//     load();
//   }, []);

//   const branchName = (id: number | string) =>
//     branches.find((b) => String(b.id) === String(id))?.name ?? "—";

//   const studentName = (id: number | string) =>
//     students.find((s) => String(s.id) === String(id))?.name ?? "Unknown";

//   const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);

//   const now = new Date();
//   const thisMonthTotal = donations
//     .filter((d) => {
//       const dt = new Date(d.date || d.created_at || "");
//       return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
//     })
//     .reduce((sum, d) => sum + Number(d.amount || 0), 0);

//   const recentDonations = [...donations]
//     .sort((a, b) => new Date(b.date || b.created_at || "").getTime() - new Date(a.date || a.created_at || "").getTime())
//     .slice(0, 8);

//   const currency = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

//   const stats = [
//     { label: "Students on record", value: students.length.toLocaleString(), suffix: "" },
//     { label: "Total raised, all time", value: currency(totalRaised), suffix: "৳" },
//     { label: "Raised this month", value: currency(thisMonthTotal), suffix: "৳" },
//     { label: "Branches reporting", value: branches.length.toLocaleString(), suffix: "" },
//   ];

//   return (
//     <div className="min-h-full w-full bg-paper">
//       <div className="px-2 pb-6 pt-1 md:px-4">
//         <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-dim">
//           Donation Ledger &middot; {now.toLocaleString("default", { month: "long", year: "numeric" })}
//         </p>
//         <h1 className="mt-1 font-display text-3xl font-semibold text-ink md:text-4xl">
//           The books, at a glance
//         </h1>
//         <p className="mt-1 text-sm text-ink/60">
//           Every entry below is pulled straight from the ledger — no rounding, no guesswork.
//         </p>
//       </div>

//       <div className="grid grid-cols-2 gap-3 px-2 md:grid-cols-4 md:gap-4 md:px-4">
//         {stats.map((s) => (
//           <div
//             key={s.label}
//             className="relative overflow-hidden rounded-md border border-paper-line bg-paper-card p-4 shadow-[0_1px_2px_rgba(20,52,43,0.06)]"
//           >
//             <span className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-gold via-gold-light to-transparent" />
//             <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">{s.label}</p>
//             <p className="mt-2 font-mono text-2xl font-semibold text-ink md:text-3xl">
//               {s.suffix}
//               {loading ? "···" : s.value}
//             </p>
//           </div>
//         ))}
//       </div>

//       <div className="mt-4 flex flex-col gap-4 px-2 md:flex-row md:px-4">
//         <div className="w-full md:w-2/5">
//           <CountChart />
//         </div>
//         <div className="w-full md:w-3/5">
//           <DonationChart />
//         </div>
//       </div>

//       <div className="mt-4 px-2 pb-6 md:px-4">
//         <div className="overflow-hidden rounded-md border border-paper-line bg-paper-card shadow-[0_1px_2px_rgba(20,52,43,0.06)]">
//           <div className="flex items-center justify-between border-b border-paper-line px-5 py-3">
//             <h2 className="font-display text-lg font-semibold text-ink">Recent entries</h2>
//             <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">
//               Latest {recentDonations.length} of {donations.length}
//             </span>
//           </div>

//           {loading ? (
//             <div className="px-5 py-8 text-center text-sm text-ink/40">Reading the ledger…</div>
//           ) : recentDonations.length === 0 ? (
//             <div className="px-5 py-8 text-center text-sm text-ink/40">
//               No entries yet. The first donation you record will appear here.
//             </div>
//           ) : (
//             <table className="w-full text-left text-sm">
//               <thead>
//                 <tr className="border-b border-paper-line font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">
//                   <th className="px-5 py-2 font-normal">Student</th>
//                   <th className="hidden px-5 py-2 font-normal md:table-cell">Branch</th>
//                   <th className="px-5 py-2 font-normal">Mode</th>
//                   <th className="px-5 py-2 font-normal">Date</th>
//                   <th className="px-5 py-2 text-right font-normal">Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentDonations.map((d, i) => {
//                   const student = students.find((s) => String(s.id) === String(d.student_id));
//                   return (
//                     <tr
//                       key={d.id}
//                       className={`border-b border-paper-line/60 last:border-0 ${i % 2 === 1 ? "bg-paper/40" : ""}`}
//                     >
//                       <td className="px-5 py-3 font-medium text-ink">{studentName(d.student_id)}</td>
//                       <td className="hidden px-5 py-3 text-ink/60 md:table-cell">
//                         {student ? branchName(student.branch_id) : "—"}
//                       </td>
//                       <td className="px-5 py-3">
//                         <span
//                           className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${
//                             d.mode_of_payment === "bank" ? "bg-ink/5 text-ink-light" : "bg-gold/10 text-gold-dim"
//                           }`}
//                         >
//                           {d.mode_of_payment}
//                         </span>
//                       </td>
//                       <td className="px-5 py-3 text-ink/60">
//                         {d.date
//                           ? new Date(d.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
//                           : "—"}
//                       </td>
//                       <td className="px-5 py-3 text-right font-mono font-semibold text-ink">
//                         ৳{currency(Number(d.amount || 0))}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminPage;

"use client";

import { useEffect, useMemo, useState } from "react";
import DonationChart from "@/components/DonationChart";
import CountChart from "@/components/CountChart";
import { assistProApiFetch, coreApiFetch } from "@/helpers/httpClient";

interface Student {
  id: number | string;
  name: string;
  branch_id: number | string;
  created_at?: string;
}

interface Donation {
  id: number | string;
  student_id: number | string;
  date?: string;
  amount: number | string;
  mode_of_payment: "cash" | "bank";
  created_at?: string;
}

interface Branch {
  id: number | string;
  name: string;
}

// ---- Local UI-only data structures (no backend endpoint yet) ----
// TODO: replace with real API calls once task/volunteer endpoints exist.

interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: "high" | "medium" | "low";
  done: boolean;
}

interface Volunteer {
  id: string;
  name: string;
  hours: number;
  target: number;
  color: "indigo" | "emerald" | "sky" | "rose";
}

const initialTasks: Task[] = [
  { id: "t1", title: "Verify new student intake forms", assignee: "Rina", priority: "high", done: false },
  { id: "t2", title: "Reconcile bank donations for the week", assignee: "Karim", priority: "high", done: false },
  { id: "t3", title: "Call branch coordinators re: monthly report", assignee: "Nabila", priority: "medium", done: false },
  { id: "t4", title: "Update sponsor thank-you letters", assignee: "Sajid", priority: "low", done: true },
  { id: "t5", title: "Prepare volunteer orientation slides", assignee: "Rina", priority: "medium", done: false },
];

const initialVolunteers: Volunteer[] = [
  { id: "v1", name: "Rina Akter", hours: 34, target: 40, color: "indigo" },
  { id: "v2", name: "Karim Hasan", hours: 18, target: 30, color: "emerald" },
  { id: "v3", name: "Nabila Rahman", hours: 27, target: 25, color: "sky" },
  { id: "v4", name: "Sajid Islam", hours: 9, target: 20, color: "rose" },
];

const priorityStyles: Record<Task["priority"], string> = {
  high: "bg-rose-100 text-rose-600",
  medium: "bg-amber-100 text-amber-600",
  low: "bg-emerald-100 text-emerald-600",
};

const volunteerBar: Record<Volunteer["color"], string> = {
  indigo: "bg-indigo-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  rose: "bg-rose-500",
};

const volunteerChip: Record<Volunteer["color"], string> = {
  indigo: "bg-indigo-100 text-indigo-600",
  emerald: "bg-emerald-100 text-emerald-600",
  sky: "bg-sky-100 text-sky-600",
  rose: "bg-rose-100 text-rose-600",
};

const AdminPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [volunteers] = useState<Volunteer[]>(initialVolunteers);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    async function load() {
      const [studentsRes, donationsRes, branchesRes] = await Promise.allSettled([
        assistProApiFetch("students/all?limit=10000", { method: "GET" }),
        assistProApiFetch("donations?limit=10000", { method: "GET" }),
        coreApiFetch("po_branches/ajax_all_branch_info", { method: "GET" }),
      ]);

      if (studentsRes.status === "fulfilled") setStudents(studentsRes.value.data || []);
      else console.error("Failed to load students:", studentsRes.reason);

      if (donationsRes.status === "fulfilled") setDonations(donationsRes.value.data || []);
      else console.error("Failed to load donations:", donationsRes.reason);

      if (branchesRes.status === "fulfilled") {
        setBranches(Array.isArray(branchesRes.value) ? branchesRes.value : []);
      } else {
        console.error("Failed to load branches:", branchesRes.reason);
      }

      setLoading(false);
    }
    load();
  }, []);

  // Live clock, ticks every second
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const branchName = (id: number | string) =>
    branches.find((b) => String(b.id) === String(id))?.name ?? "—";

  const studentName = (id: number | string) =>
    students.find((s) => String(s.id) === String(id))?.name ?? "Unknown";

  const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);

  const thisMonthTotal = donations
    .filter((d) => {
      const dt = new Date(d.date || d.created_at || "");
      return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
    })
    .reduce((sum, d) => sum + Number(d.amount || 0), 0);

  const recentDonations = [...donations]
    .sort((a, b) => new Date(b.date || b.created_at || "").getTime() - new Date(a.date || a.created_at || "").getTime())
    .slice(0, 8);

  const currency = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  const stats = [
    { label: "Students on record", value: students.length.toLocaleString(), suffix: "", icon: "fa-user-graduate", accent: "indigo" },
    { label: "Total raised, all time", value: currency(totalRaised), suffix: "৳", icon: "fa-sack-dollar", accent: "emerald" },
    { label: "Raised this month", value: currency(thisMonthTotal), suffix: "৳", icon: "fa-chart-line", accent: "amber" },
    { label: "Branches reporting", value: branches.length.toLocaleString(), suffix: "", icon: "fa-sitemap", accent: "rose" },
  ] as const;

  const statAccent: Record<string, { chip: string; bar: string }> = {
    indigo: { chip: "bg-indigo-50 text-indigo-600", bar: "from-indigo-500 to-indigo-300" },
    emerald: { chip: "bg-emerald-50 text-emerald-600", bar: "from-emerald-500 to-emerald-300" },
    amber: { chip: "bg-amber-50 text-amber-600", bar: "from-amber-500 to-amber-300" },
    rose: { chip: "bg-rose-50 text-rose-600", bar: "from-rose-500 to-rose-300" },
  };

  // ---- Mini calendar for the current month ----
  const calendarDays = useMemo(() => {
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [now]);

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <div className="min-h-full w-full bg-slate-50">
      <div className="px-2 pb-6 pt-1 md:px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-indigo-500">
              Dashboard &middot; {now.toLocaleString("default", { month: "long", year: "numeric" })}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-slate-900 md:text-4xl">
              Welcome back 👋
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Here&apos;s what&apos;s happening across your students, donations, and volunteers today.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 shadow-sm px-4 py-2.5">
            <i className="fa-solid fa-clock text-indigo-500"></i>
            <div className="leading-tight">
              <p className="font-mono text-lg font-bold text-slate-900">
                {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                {now.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short" })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Colorful stat cards */}
      <div className="grid grid-cols-2 gap-3 px-2 md:grid-cols-4 md:gap-4 md:px-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <span className={`absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r ${statAccent[s.accent].bar}`} />
            <div className="flex items-start justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">{s.label}</p>
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${statAccent[s.accent].chip}`}>
                <i className={`fa-solid ${s.icon}`}></i>
              </span>
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-slate-900 md:text-3xl">
              {s.suffix}
              {loading ? "···" : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Calendar / Task Assignment / Volunteer Tracker */}
      <div className="mt-4 grid grid-cols-1 gap-4 px-2 md:px-4 lg:grid-cols-3">
        {/* Mini calendar */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm font-bold text-slate-900">
              {now.toLocaleString("default", { month: "long" })} {now.getFullYear()}
            </h3>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600 text-xs">
              <i className="fa-solid fa-calendar-days"></i>
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 mb-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {calendarDays.map((d, i) =>
              d === null ? (
                <span key={i} />
              ) : (
                <span
                  key={i}
                  className={`flex h-7 w-7 items-center justify-center rounded-full mx-auto ${
                    d === now.getDate()
                      ? "bg-indigo-500 text-white font-bold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {d}
                </span>
              )
            )}
          </div>
        </div>

        {/* Task assignment tracker */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm font-bold text-slate-900">Task Assignments</h3>
            <span className="text-[10px] font-mono uppercase tracking-wide text-slate-400">
              {completedCount}/{tasks.length} done
            </span>
          </div>
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-2 rounded-lg border border-slate-100 px-2.5 py-2 hover:bg-slate-50 transition"
              >
                <button
                  onClick={() => toggleTask(t.id)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                    t.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"
                  }`}
                >
                  {t.done && <i className="fa-solid fa-check text-[10px]"></i>}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${t.done ? "line-through text-slate-400" : "text-slate-800"}`}>
                    {t.title}
                  </p>
                  <p className="text-[10px] text-slate-400">Assigned to {t.assignee}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${priorityStyles[t.priority]}`}>
                  {t.priority}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Volunteer tracker */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm font-bold text-slate-900">Volunteer Tracker</h3>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600 text-xs">
              <i className="fa-solid fa-people-group"></i>
            </span>
          </div>
          <ul className="space-y-3">
            {volunteers.map((v) => {
              const pct = Math.min(100, Math.round((v.hours / v.target) * 100));
              return (
                <li key={v.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${volunteerChip[v.color]}`}>
                      {v.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {v.hours}h / {v.target}h
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${volunteerBar[v.color]} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-4 flex flex-col gap-4 px-2 md:flex-row md:px-4">
        <div className="w-full md:w-2/5 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <CountChart />
        </div>
        <div className="w-full md:w-3/5 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <DonationChart />
        </div>
      </div>

      {/* Recent entries */}
      <div className="mt-4 px-2 pb-6 md:px-4">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">Recent entries</h2>
              <p className="text-xs text-slate-400 mt-0.5">Latest donations recorded in the ledger</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
              {recentDonations.length} of {donations.length}
            </span>
          </div>

          {loading ? (
            <div className="px-5 py-10 text-center text-sm text-slate-400">Loading recent activity…</div>
          ) : recentDonations.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-slate-400">
              No entries yet. The first donation you record will appear here.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentDonations.map((d) => {
                const student = students.find((s) => String(s.id) === String(d.student_id));
                const name = studentName(d.student_id);
                const initials = name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                const palette = ["bg-indigo-100 text-indigo-600", "bg-emerald-100 text-emerald-600", "bg-amber-100 text-amber-600", "bg-sky-100 text-sky-600", "bg-rose-100 text-rose-600"];
                const colorClass = palette[Math.abs(name.charCodeAt(0) || 0) % palette.length];
                const isBank = d.mode_of_payment === "bank";

                return (
                  <li
                    key={d.id}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                  >
                    {/* Avatar */}
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm ${colorClass}`}>
                      {initials || "?"}
                    </span>

                    {/* Name + branch */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {student ? branchName(student.branch_id) : "—"} branch
                      </p>
                    </div>

                    {/* Mode badge */}
                    <span
                      className={`hidden sm:inline-flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        isBank ? "bg-sky-50 text-sky-600" : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <i className={`fa-solid ${isBank ? "fa-building-columns" : "fa-money-bill-wave"} text-[10px]`}></i>
                      {d.mode_of_payment}
                    </span>

                    {/* Date */}
                    <span className="hidden md:block shrink-0 text-xs text-slate-400 w-24 text-right">
                      {d.date
                        ? new Date(d.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                        : "—"}
                    </span>

                    {/* Amount */}
                    <span className="shrink-0 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 font-mono text-sm font-bold text-emerald-600">
                      <i className="fa-solid fa-arrow-up text-[10px]"></i>
                      ৳{currency(Number(d.amount || 0))}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;