// src/Pages/admins/Comments.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

// demo data — replace with API later
const seedComments = [
  { id: 1, blogTitle: "A detailed step by step guide to manage your lifestyle", author: "Alice",   content: "Great article! Helped me a lot.",                                date: new Date().toISOString(),                       status: "approved" },
  { id: 2, blogTitle: "Learning new technology to boost your career in software", author: "Bob",     content: "Can you also cover AI tools in the next blog?",             date: new Date(Date.now() - 86400000).toISOString(),  status: "pending"  },
  { id: 3, blogTitle: "How to create an effective startup roadmap or ideas",      author: "Charlie", content: "Not sure I agree with point 3.",                            date: new Date(Date.now() - 172800000).toISOString(), status: "rejected" },
];

// utils
const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState("all"); // all | approved | pending | rejected
  const [q, setQ] = useState("");
  const [workingId, setWorkingId] = useState(null);

  useEffect(() => {
    setComments(seedComments);
    // eslint-disable-next-line no-console
    console.log("Comments component loaded ✅");
  }, []);

  // filters + search
  const visible = useMemo(() => {
    let list = comments;
    if (filter !== "all") list = list.filter((c) => c.status === filter);
    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter((c) => {
        const author = (c.author || "").toLowerCase();
        const content = (c.content || "").toLowerCase();
        const blog = (c.blogTitle || "").toLowerCase();
        return author.includes(needle) || content.includes(needle) || blog.includes(needle);
      });
    }
    return list;
  }, [comments, filter, q]);

  const counts = useMemo(() => ({
    all: comments.length,
    approved: comments.filter((c) => c.status === "approved").length,
    pending: comments.filter((c) => c.status === "pending").length,
    rejected: comments.filter((c) => c.status === "rejected").length,
  }), [comments]);

  // approve/reject toggle (optimistic)
  const updateStatus = async (id, status) => {
    if (workingId) return;
    setWorkingId(id);

    const next = comments.map((c) => (c.id === id ? { ...c, status } : c));
    setComments(next);

    try {
      // await fetch(`/api/comments/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    } finally {
      setTimeout(() => setWorkingId(null), 500); // mimic API latency
    }
  };

  return (
    <motion.section
      className="px-0 py-4 sm:py-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      {/* Header */}
      <header className="px-4 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
          <h1 className="text-xl font-semibold tracking-tight">Comments</h1>
          <p className="text-sm text-[#0A241D]/60">Manage, approve, or reject comments across your blogs.</p>
        </motion.div>

        <motion.input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search comments…"
          className="w-72 max-w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#145A4F]/30"
          aria-label="Search comments"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, delay: 0.05 }}
        />
      </header>

      {/* Filters */}
      <motion.div className="px-4 mb-3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, delay: 0.05 }}>
        <div className="inline-flex rounded-lg border border-black/10 overflow-hidden">
          {[
            { key: "all", label: `All (${counts.all})` },
            { key: "approved", label: `Approved (${counts.approved})` },
            { key: "pending", label: `Pending (${counts.pending})` },
            { key: "rejected", label: `Rejected (${counts.rejected})` },
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
      </motion.div>

      {/* Table */}
      <div className="px-4">
        <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
          <table className="min-w-[800px] w-full text-sm">
            <thead className="bg-[#0A241D]/5 text-[#0A241D]/70">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Blog</th>
                <th className="px-4 py-3 text-left">Author</th>
                <th className="px-4 py-3 text-left">Comment</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <LayoutGroup>
              <tbody className="divide-y divide-black/10">
                <AnimatePresence initial={false}>
                  {visible.length === 0 ? (
                    <motion.tr
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={7} className="px-4 py-8 text-center text-[#0A241D]/60">
                        No comments found.
                      </td>
                    </motion.tr>
                  ) : (
                    visible.map((c, i) => {
                      const isWorking = workingId === c.id;
                      return (
                        <motion.tr
                          key={c.id}
                          layout
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18 }}
                          className="hover:bg-[#0A241D]/[0.03]"
                        >
                          <td className="px-4 py-3">{i + 1}</td>
                          <td className="px-4 py-3 font-medium">{c.blogTitle}</td>
                          <td className="px-4 py-3">{c.author}</td>
                          <td className="px-4 py-3 max-w-xs truncate">{c.content}</td>
                          <td className="px-4 py-3">{formatDate(c.date)}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                                c.status === "approved"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : c.status === "pending"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {/* APPROVE — personality */}
                              <motion.button
                                type="button"
                                onClick={() => updateStatus(c.id, "approved")}
                                disabled={isWorking}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 h-9 px-4 rounded-md text-xs sm:text-sm font-semibold
                                           bg-gradient-to-r from-emerald-500 to-emerald-600 text-white
                                           shadow-[0_6px_16px_-6px_rgba(16,185,129,0.6)]
                                           hover:from-emerald-600 hover:to-emerald-700 active:translate-y-[1px]
                                           disabled:opacity-60 transition-all"
                                aria-label="Approve comment"
                              >
                                <span aria-hidden="true">✅</span>
                                {isWorking ? "Approving…" : "Approve"}
                              </motion.button>

                              {/* REJECT — personality */}
                              <motion.button
                                type="button"
                                onClick={() => updateStatus(c.id, "rejected")}
                                disabled={isWorking}
                                whileHover={{ scale: 1.05, rotate: -1.5 }}
                                whileTap={{ scale: 0.95, rotate: 1.5 }}
                                className="inline-flex items-center gap-2 h-9 px-4 rounded-md text-xs sm:text-sm font-semibold
                                           bg-gradient-to-r from-rose-400 to-rose-500 text-white
                                           shadow-[0_6px_16px_-6px_rgba(244,63,94,0.5)]
                                           hover:from-rose-500 hover:to-rose-600 active:translate-y-[1px]
                                           disabled:opacity-60 transition-all"
                                aria-label="Reject comment"
                              >
                                <span aria-hidden="true">❌</span>
                                {isWorking ? "Rejecting…" : "Reject"}
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </LayoutGroup>
          </table>
        </div>
      </div>
    </motion.section>
  );
}
