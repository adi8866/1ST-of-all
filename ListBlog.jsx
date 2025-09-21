// src/Pages/admins/ListBlog.jsx
import React, { useEffect, useMemo, useState } from "react";
import { dashboard_data } from "../../assets/assets";

// ----- shared-style helpers (match Blog/Dashboard logic) -----
const authorsFallback = [
  "Michael Brown",
  "Ava Kapoor",
  "Noah Singh",
  "Sofia Alvarez",
  "Ethan Park",
  "Layla Rahman",
];

const stripTags = (html = "") => html.replace(/<\/?[^>]+(>|$)/g, "");
const hash = (s = "") =>
  Array.from(String(s)).reduce((a, ch) => ((a << 5) - a + ch.charCodeAt(0)) | 0, 0);

const pickAuthor = (key) =>
  authorsFallback[Math.abs(hash(String(key))) % authorsFallback.length];

// seed a “nice looking” ISO date: 1,3,5,7… days ago
const seedDate = (idx) => {
  const d = new Date();
  d.setDate(d.getDate() - (idx * 2 + 1));
  return d.toISOString();
};

// ordinal + long-month format (e.g., 19 September, 2025)
const ordinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${ordinal(d.getDate())} ${d.toLocaleString(undefined, { month: "long" })}, ${d.getFullYear()}`;
};

export default function ListBlog() {
  const [blogs, setBlogs] = useState([]);
  const [filter, setFilter] = useState("all"); // all | published | draft
  const [q, setQ] = useState("");
  const [workingId, setWorkingId] = useState(null);

  // Load same shape the Dashboard uses, but fix author/date with our fallbacks
  const fetchBlogs = async () => {
    const src = dashboard_data?.recentBlogs ?? [];
    const list = src.map((b, i) => {
      const id = b.id ?? i + 1;
      const title = stripTags(b.title ?? `Untitled #${i + 1}`);
      const status = b.status === "published" ? "published" : "draft";

      // author: honor provided, else deterministic fallback
      const author =
        stripTags(b.author || "") ||
        pickAuthor(b._id || b.id || title || i);

      // date: show only for published; seed if missing
      const date = status === "published" ? (b.date || seedDate(i)) : null;

      return { id, title, author, status, date };
    });
    setBlogs(list);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // filters + search
  const visible = useMemo(() => {
    let list = blogs;
    if (filter === "published") list = list.filter((b) => b.status === "published");
    if (filter === "draft") list = list.filter((b) => b.status !== "published");
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(needle) ||
          (b.author ?? "").toLowerCase().includes(needle)
      );
    }
    return list;
  }, [blogs, filter, q]);

  const counts = useMemo(() => {
    const published = blogs.filter((b) => b.status === "published").length;
    return { all: blogs.length, published, draft: blogs.length - published };
  }, [blogs]);

  // Publish/Unpublish — stamp/clear date (optimistic)
  const togglePublish = async (id) => {
    if (workingId) return;
    setWorkingId(id);

    const next = blogs.map((b) =>
      b.id === id
        ? {
            ...b,
            status: b.status === "published" ? "draft" : "published",
            date: b.status === "published" ? null : new Date().toISOString(),
          }
        : b
    );
    setBlogs(next);

    try {
      // await fetch(`/api/admin/blogs/${id}/status`, {...});
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <section className="px-0 py-4 sm:py-6">
      {/* Header */}
      <header className="px-4 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">All Blogs</h1>
          <p className="text-sm text-[#0A241D]/60">
            Search, filter, and manage publish state.
          </p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title or author…"
          className="w-72 max-w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#145A4F]/30"
        />
      </header>

      {/* Filters */}
      <div className="px-4 mb-3">
        <div className="inline-flex rounded-lg border border-black/10 overflow-hidden">
          {[
            { key: "all", label: `All (${counts.all})` },
            { key: "published", label: `Published (${counts.published})` },
            { key: "draft", label: `Drafts (${counts.draft})` },
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

      {/* Table */}
      <div className="px-4">
        <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="bg-[#0A241D]/5 text-[#0A241D]/70">
              <tr>
                <th className="text-left px-4 py-3 w-12">#</th>
                <th className="text-left px-4 py-3">Blog Title</th>
                <th className="text-left px-4 py-3 w-48">Date</th>
                <th className="text-left px-4 py-3 w-32">Status</th>
                <th className="text-left px-4 py-3 w-44">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#0A241D]/60">
                    Nothing to show.
                  </td>
                </tr>
              ) : (
                visible.map((b, i) => {
                  const isPublished = b.status === "published";
                  const hasDate = Boolean(b.date);
                  return (
                    <tr key={b.id} className="hover:bg-[#0A241D]/[0.03]">
                      <td className="px-4 py-3 tabular-nums">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-[#145A4F]" />
                          <div className="min-w-0">
                            <div className="font-medium truncate">{b.title}</div>
                            <div className="text-xs text-[#0A241D]/60">
                              {isPublished && hasDate ? <>Published on {formatDate(b.date)} · </> : null}
                              {b.author ?? "Unknown"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#0A241D]/80 tabular-nums">
                        {isPublished ? (hasDate ? formatDate(b.date) : "just now") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isPublished
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
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
                          <button className="h-9 px-3 rounded-md border border-black/10 text-[#0A241D]/80 hover:bg-[#0A241D]/5">
                            Edit
                          </button>
                          <button className="h-9 px-3 rounded-md border border-[#F2C9CA] bg-[#F2C9CA]/30 text-[#7A2B2E] hover:bg-[#F2C9CA]/50">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
