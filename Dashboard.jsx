// src/Pages/admins/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { assets, dashboard_data } from "../../assets/assets";

const authorsFallback = [
  "Michael Brown",
  "Ava Kapoor",
  "Noah Singh",
  "Sofia Alvarez",
  "Ethan Park",
  "Layla Rahman",
];

// --- utils (same spirit as Blog.jsx) ---
const stripTags = (html = "") => html.replace(/<\/?[^>]+(>|$)/g, "");
const hash = (s = "") =>
  Array.from(String(s)).reduce((a, ch) => ((a << 5) - a + ch.charCodeAt(0)) | 0, 0);
const pickAuthor = (key) => {
  const idx = Math.abs(hash(String(key))) % authorsFallback.length;
  return authorsFallback[idx];
};
const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};
const seedDate = (idx) => {
  const d = new Date();
  d.setDate(d.getDate() - (idx * 2 + 1)); // 1,3,5,7,... days ago
  return d.toISOString();
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    Blogs: 0,
    Comments: 0,
    drafts: 0,
    recentBlogs: [],
  });

  const [filter, setFilter] = useState("all"); // all | published | draft
  const [workingId, setWorkingId] = useState(null); // for button spinners

  // --- mock fetch (replace with real API call) ---
  const fetchDashboardData = async () => {
    const source = dashboard_data?.recentBlogs || [];
    const list = source.map((b, i) => {
      const id = b.id ?? i + 1;
      const title = stripTags(b.title ?? `Untitled #${i + 1}`);
      const status = b.status === "published" ? "published" : "draft";
      const author =
        stripTags(b.author || "") ||
        pickAuthor(b._id || b.id || title || i); // deterministic fallback

      // Only published items show a date; seed if missing
      const date = status === "published" ? (b.date || seedDate(i)) : null;

      return { id, title, status, author, date };
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
  }, []);

  // --- derived counts for filters / header ---
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

  // --- optimistic toggle publish/unpublish ---
  const togglePublish = async (id) => {
    if (workingId) return;
    setWorkingId(id);

    const prev = dashboardData;
    const next = structuredClone(prev);
    const idx = next.recentBlogs.findIndex((b) => b.id === id);
    if (idx === -1) {
      setWorkingId(null);
      return;
    }

    const wasPublished = next.recentBlogs[idx].status === "published";
    next.recentBlogs[idx].status = wasPublished ? "draft" : "published";
    // stamp date when publishing; clear when unpublishing
    next.recentBlogs[idx].date = wasPublished ? null : new Date().toISOString();

    next.Blogs = next.recentBlogs.filter((b) => b.status === "published").length;
    next.drafts = next.recentBlogs.filter((b) => b.status !== "published").length;

    setDashboardData(next);

    try {
      // await fetch(`/api/admin/blogs/${id}/status`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ status: next.recentBlogs[idx].status }),
      // });
    } catch (e) {
      setDashboardData(prev); // revert
    } finally {
      setWorkingId(null);
    }
  };

  const cards = [
    { key: "Blogs", label: "Published", value: stats.published, icon: assets?.Dashboard_icon_1 },
    { key: "Comments", label: "Comments", value: dashboardData.Comments ?? 0, icon: assets?.Dashboard_icon_2 || assets?.comment_icon },
    { key: "drafts", label: "Drafts", value: stats.draft, icon: assets?.Dashboard_icon_3 || assets?.draft_icon },
  ];

  return (
    <section className="px-0 py-6">
      {/* Page title */}
      <header className="px-4 mb-4">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#0A241D]/60">
          Overview of published posts, drafts, comments — and quick actions.
        </p>
      </header>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {cards.map((c) => (
          <div
            key={c.key}
            className="group relative overflow-hidden rounded-2xl bg-white
                       border border-black/10 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)]
                       transition-transform hover:-translate-y-0.5"
          >
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
            <span
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: "linear-gradient(120deg, transparent 0%, rgba(20,90,79,.07) 45%, transparent 60%)",
                transform: "translateX(-120%)",
                animation: "dash-sheen 2.3s linear infinite",
              }}
            />
          </div>
        ))}
      </div>

      {/* Recent blogs with status + actions */}
      <div className="mt-8 px-4">
        <div className="rounded-2xl bg-white border border-black/10 overflow-hidden">
          {/* Header + filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-b border-black/10">
            <h2 className="text-base font-semibold">
              Recent Blogs <span className="text-[#0A241D]/60">({stats.total})</span>
            </h2>

            <div className="inline-flex rounded-lg border border-black/10 overflow-hidden">
              {[
                { key: "all", label: `All (${stats.total})` },
                { key: "published", label: `Published (${stats.published})` },
                { key: "draft", label: `Drafts (${stats.draft})` },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key)}
                  className={`px-3 py-1.5 text-sm transition ${
                    filter === t.key ? "bg-[#145A4F] text-white" : "bg-white text-[#0A241D] hover:bg-[#0A241D]/5"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <ul className="divide-y divide-black/10">
            {filteredBlogs.length === 0 ? (
              <li className="px-4 py-6 text-sm text-[#0A241D]/60">
                {filter === "published" ? "No published posts yet." : filter === "draft" ? "No drafts found." : "No recent posts yet."}
              </li>
            ) : (
              filteredBlogs.slice(0, 10).map((b) => {
                const isPublished = b.status === "published";
                return (
                  <li key={b.id} className="px-4 py-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[#145A4F]" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{b.title}</p>
                          <p className="text-xs text-[#0A241D]/60">
                            {isPublished ? formatDate(b.date) : "—"} · {b.author}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Status pill */}
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isPublished
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                          title={isPublished ? "Published" : "Draft"}
                        >
                          {isPublished ? "Published" : "Draft"}
                        </span>

                        {/* Action button: Publish / Unpublish */}
                        <button
                          onClick={() => togglePublish(b.id)}
                          disabled={workingId === b.id}
                          className={`inline-flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-semibold transition
                            ${isPublished ? "bg-[#F2C9CA] text-[#0E3A2D] hover:bg-[#EDB6B8]" : "bg-[#145A4F] text-white hover:opacity-95"}
                            disabled:opacity-60`}
                        >
                          {workingId === b.id ? (
                            <>
                              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                              </svg>
                              Working…
                            </>
                          ) : isPublished ? (
                            <>Unpublish</>
                          ) : (
                            <>
                              Publish
                              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14" />
                                <path d="M13 6l6 6-6 6" />
                              </svg>
                            </>
                          )}
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

      {/* local keyframes once */}
      <style>{`
        @keyframes dash-sheen {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
      `}</style>
    </section>
  );
}
