// src/Pages/admins/CommentTableItem.jsx
import React from "react";
import { motion } from "framer-motion";

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Reusable animated row for the Comments table.
 * Must be used inside a <tbody>. Returns a <motion.tr>.
 */
export default function CommentTableItem({
  index,              // number (1-based)
  item,               // { id, blogTitle, author, content, date, status }
  workingId,          // number | null
  onUpdateStatus,     // (id, newStatus) => void
}) {
  const isWorking = workingId === item.id;

  return (
    <motion.tr
      key={item.id}
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className="hover:bg-[#0A241D]/[0.03]"
    >
      <td className="px-4 py-3">{index}</td>
      <td className="px-4 py-3 font-medium">{item.blogTitle}</td>
      <td className="px-4 py-3">{item.author}</td>
      <td className="px-4 py-3 max-w-xs truncate">{item.content}</td>
      <td className="px-4 py-3">{formatDate(item.date)}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
            item.status === "approved"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : item.status === "pending"
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {item.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Approve */}
          <motion.button
            type="button"
            onClick={() => onUpdateStatus(item.id, "approved")}
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

          {/* Reject */}
          <motion.button
            type="button"
            onClick={() => onUpdateStatus(item.id, "rejected")}
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
}
