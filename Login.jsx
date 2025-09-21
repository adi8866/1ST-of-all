import React, { useEffect, useMemo, useState } from "react";
import { assets, dashboard_data } from "../../assets/assets";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    Blogs: 0,
    Comments: 0,
    drafts: 0,
    recentBlogs: [],
  });

  const [filter, setFilter] = useState("all");
  const [workingId, setWorkingId] = useState(null);

  // ---------- utils ----------
  const ordinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    const day = ordinal(d.getDate());
    const month = d.toLocaleString(undefined, { month: "long" });
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  // seed different dates for demo only
  const seedDate = (idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (idx * 2 + 1));
    return d.toISOString();
  };

  // ---------- load data (mock) ----------
  const fetchDashboardData = async () => {
    const list = (dashboard_data?.recentBlogs || []).map((b, i) => {
      const status =
        b.status === "published" || b.status === "draft" ? b.status : "draft";
      return {
        id: b.id ?? i + 1,
        title: b.title ?? `Untitled #${i + 1}`,
        author: b.author ?? "Unknown",
        status,
        // only published items carry a date at load
        date: status === "published" ? (b.date ?? seedDate(i)) : null,
      };
    });

    setDashboardData({
      ...dashboard_data,
      recentBlogs: list,
      Blogs: list.filter((x) => x.status === "published").length,
      drafts: list.filter((x) => x.status !== "published").length,
    });
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- derived ----------
  const stats = useMemo(() => {
    const list = dashboardData.recentBlogs || [];
    const published = list.filter((b) => b.status === "published").length;
    const draft = list.filter((b) => b.status !== "published").length;
    return { total: list.length, published, draft };
  }, [dashboardData.recentBlogs]);

  const filteredBlogs = useMemo(() => {
    const list = dashboardData.recentBlogs || [];
    if (filter === "published") return list.filter((b) => b.status === "published");
    if (filter === "draft") return list.filter((b) => b.status !== "published");
    return list;
  }, [dashboardData.recentBlogs, filter]);

  // ---------- actions ----------
  const togglePublish = async (id) => {
    if (workingId) return;
    setWorkingId(id);

    const prev = dashboardData;
    const next = structuredClone(prev);
    const idx = next.recentBlogs.findIndex((b) => b.id === id);
    if (idx === -1) { setWorkingId(null); return; }

    const wasPublished = next.recentBlogs[idx].status === "published";
    next.recentBlogs[idx].status = wasPublished ? "draft" : "published";

    // stamp when publishing; clear when unpublishing
    if (!wasPublished) {
      next.recentBlogs[idx].date = new Date().toISOString();
    } else {
      next.recentBlogs[idx].date = null;
    }

    next.Blogs  = next.recentBlogs.filter((b) => b.status === "published").length;
    next.drafts = next.recentBlogs.filter((b) => b.status !== "published").length;

    setDashboardData(next);

    try {
      // await fetch(`/api/admin/blogs/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: next.recentBlogs[idx].status })});
    } catch {
      setDashboardData(prev); // revert on failure
    } finally {
      setWorkingId(null);
    }
  };

  const cards = [
    { key: "Blogs",    label: "Published", value: stats.published, icon: assets?.Dashboard_icon_1 },
    { key: "Comments", label: "Comments",  value: dashboardData.Comments ?? 0, icon: assets?.Dashboard_icon_2 || assets?.comment_icon },
    { key: "drafts",   label: "Drafts",    value: stats.draft,     icon: assets?.Dashboard_icon_3 || assets?.draft_icon },
  ];

  return (
    <section className="px-0 py-6">
      <header className="px-4 mb-4">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#0A241D]/60">
          Overview of published posts, drafts, comments — and quick actions.
        </p>
      </header>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {cards.map((c) => (
          <div key={c.key}
               className="group relative overflow-hidden rounded-2xl bg-white border border-black/10 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)] transition-transform hover:-translate-y-0.5">
            <span className="absolute left-0 top-0 h-full" style={{ width: 4, background: "#145A4F", opacity: 0.9 }} />
            <div className="flex items-center gap-4 p-4">
              <div className="grid place-items-center h-12 w-12 rounded-xl bg-[#145A4F]/10 border border-[#145A4F]/20">
                {c.icon ? <img src={c.icon} alt="" className="h-6 w-6 object-contain" /> : <span className="h-2 w-2 rounded-full bg-[#145A4F]" />}
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-extrabold tracking-tight text-[#0A241D]">{c.value}</p>
                <p className="text-sm text-[#0A241D]/60">{c.label}</p>
              </div>
            </div>
            <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(120deg, transparent 0%, rgba(20,90,79,.07) 45%, transparent 60%)",
                           transform: "translateX(-120%)", animation: "dash-sheen 2.3s linear infinite" }} />
          </div>
        ))}
      </div>

      {/* Recent Blogs */}
      <div className="mt-8 px-4">
        <div className="rounded-2xl bg-white border border-black/10 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-b border-black/10">
            <h2 className="text-base font-semibold">
              Recent Blogs <span className="text-[#0A241D]/60">({stats.total})</span>
            </h2>
            <div className="inline-flex rounded-lg border border-black/10 overflow-hidden">
              {[
                { key: "all",       label: `All (${stats.total})` },
                { key: "published", label: `Published (${stats.published})` },
                { key: "draft",     label: `Drafts (${stats.draft})` },
              ].map(t => (
                <button key={t.key} onClick={() => setFilter(t.key)}
                        className={`px-3 py-1.5 text-sm transition ${filter === t.key ? "bg-[#145A4F] text-white" : "bg-white text-[#0A241D] hover:bg-[#0A241D]/5"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <ul className="divide-y divide-black/10">
            {filteredBlogs.length === 0 ? (
              <li className="px-4 py-6 text-sm text-[#0A241D]/60">
                {filter === "published" ? "No published posts yet."
                  : filter === "draft" ? "No drafts found."
                  : "No recent posts yet."}
              </li>
            ) : (
              filteredBlogs.slice(0, 10).map((b) => {
                const isPublished = b.status === "published";
                const hasDate = Boolean(b.date);
                return (
                  <li key={b.id} className="px-4 py-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[#145A4F]" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{b.title}</p>
                          <p className="text-xs text-[#0A241D]/60">
                            {isPublished
                              ? (hasDate
                                  ? <>Published on {formatDate(b.date)} · {b.author ?? "Unknown"}</>
                                  : <>Published — just now · {b.author ?? "Unknown"}</>)
                              : <>{b.author ?? "Unknown"}</>}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Optional right-side date slot on sm+ */}
                        <div className="hidden sm:block w-44 text-xs text-[#0A241D]/70 tabular-nums">
                          {isPublished ? (hasDate ? formatDate(b.date) : "just now") : "—"}
                        </div>

                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isPublished
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {isPublished ? "Published" : "Draft"}
                        </span>

                        <button
                          onClick={() => togglePublish(b.id)}
                          disabled={workingId === b.id}
                          className="inline-flex items-center justify-center h-9 px-3 rounded-md text-sm font-semibold
                                     border border-black/10 bg-white text-[#0A241D]
                                     hover:bg-[#0A241D]/5 active:translate-y-px transition
                                     disabled:opacity-60"
                        >
                          {workingId === b.id ? "Working…" : isPublished ? "Unpublish" : "Publish"}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes dash-sheen {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
      `}</style>
    </section>
  );
}
