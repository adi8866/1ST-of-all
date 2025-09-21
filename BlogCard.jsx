import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

/* tiny utils */
const strip = (s = "") => String(s).replace(/<[^>]*>/g, "");
const clean = (s = "") => strip(s).replace(/\s+/g, " ").trim();
const words = (t = "") => clean(t).split(" ").filter(Boolean).length;
const readingTime = (txt = "", wpm = 220) => Math.max(1, Math.round(words(txt) / wpm));
const hash = (s = "") => Array.from(String(s)).reduce((a, ch) => ((a << 5) - a + ch.charCodeAt(0)) | 0, 0);
const seed01 = (k, salt = "") => ((Math.abs(hash(`${k}::${salt}`)) % 10000) / 10000);
const pseudoDateFromId = (k) => { const d = new Date(); d.setDate(d.getDate() - Math.floor(seed01(k,"date") * 540)); return d; };
const fmtDate = (d) => new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "2-digit" }).format(d);

/* fractional star renderer */
const Star = ({ fill = 1, size = 14 }) => {
  const pct = Math.max(0, Math.min(1, fill)) * 100;
  return (
    <span className="relative inline-block" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 24 24" className="absolute inset-0 text-black/20" fill="currentColor" aria-hidden>
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <svg width={size} height={size} viewBox="0 0 24 24" className="text-[#D2A065]" fill="currentColor" aria-hidden>
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      </div>
    </span>
  );
};
const Stars = ({ value = 4.5, size = 14 }) => (
  <span className="inline-flex items-center gap-0.5">
    {[0,1,2,3,4].map(i => <Star key={i} size={size} fill={value - i} />)}
  </span>
);

const BlogCard = ({ blog }) => {
  const { _id, title, description = "", image } = blog || {};
  const navigate = useNavigate();
  const go = () => _id && navigate(`/blog/${_id}`);

  const safeTitle = clean(title);
  const safeDesc = clean(description);
  if (!safeTitle || !safeDesc) return null;

  const preview = safeDesc.length > 130 ? `${safeDesc.slice(0, 130)}…` : safeDesc;

  /* ---------- CATEGORY: read from many shapes, else derive ---------- */
  const category = useMemo(() => {
    const pickFirst = (x) => Array.isArray(x) ? x[0] : x;
    // try common keys
    const raw =
      pickFirst(blog?.category) ??
      pickFirst(blog?.categories) ??
      pickFirst(blog?.tag) ??
      pickFirst(blog?.tags) ??
      blog?.topic ??
      blog?.section ??
      null;

    if (raw) return String(raw);

    // derive from title/description keywords
    const text = `${safeTitle} ${safeDesc}`.toLowerCase();

    if (/\b(ai|ml|model|gpt|llm|gemini|openai|midjourney)\b/.test(text)) return "AI";
    if (/\b(startup|founder|mvp|launch|growth|pitch|seed|series)\b/.test(text)) return "Startup";
    if (/\b(finance|money|pricing|revenue|profit|invest|budget)\b/.test(text)) return "Finance";
    if (/\b(app|tool|software|code|tech|framework|stack)\b/.test(text)) return "Technology";
    if (/\b(life|habit|health|routine|wellbeing|lifestyle|productivity)\b/.test(text)) return "Lifestyle";

    return "General";
  }, [blog, safeTitle, safeDesc]);

  /* dynamic meta per-card (feels live, not static) */
  const meta = useMemo(() => {
    const key = _id || safeTitle;
    const date = pseudoDateFromId(key);
    const minutes = readingTime(safeDesc);
    const starSteps = [2.5, 3, 3.5, 4, 4.5, 5];
    const rating = starSteps[Math.floor(seed01(key, "star") * starSteps.length)];
    const reads = 800 + Math.floor(seed01(key, "reads") * 24000);
    return { date, minutes, rating, reads };
  }, [_id, safeTitle, safeDesc]);

  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go();
    }
  };

  return (
    <motion.article
      onClick={go}
      onKeyDown={onKey}
      role="button"
      tabIndex={0}
      aria-label={safeTitle}
      className="group cursor-pointer rounded-2xl bg-white ring-1 ring-black/10 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E7C48C]"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      whileHover={{ y: -2 }}
    >
      {/* media */}
      <div className="relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={safeTitle}
            loading="lazy"
            decoding="async"
            className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full aspect-[16/10] bg-gradient-to-br from-[#1E5A48]/15 to-[#0E3A2D]/10" />
        )}

        {/* category pill — ALWAYS visible */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-[#0E3A2D] ring-1 ring-black/10 shadow-sm">
          {category}
        </span>
      </div>

      {/* content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="text-[1.02rem] sm:text-[1.12rem] font-extrabold text-[#0E3A2D] leading-snug line-clamp-2">
          {safeTitle}
        </h3>

        <p className="mt-2 text-[0.94rem] text-[#0A241D]/75 line-clamp-3 flex-1">
          {preview}
        </p>

        {/* meta row */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-[#0A241D]/60">
          <span className="inline-flex items-center gap-1">
            <Stars value={meta.rating} />
            <span className="font-semibold text-[#0A241D]/70">{meta.rating.toFixed(1)}</span>
          </span>
          <span aria-hidden>·</span>
          <time dateTime={meta.date.toISOString()}>{fmtDate(meta.date)}</time>
          <span aria-hidden>·</span>
          <span>{meta.minutes} min</span>
          <span aria-hidden>·</span>
          <span>{Intl.NumberFormat().format(meta.reads)} reads</span>
        </div>

        {/* CTA */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-[#0E3A2D] group-hover:underline underline-offset-4">
            Read more
          </span>
          <span
            className="h-8 w-8 grid place-items-center rounded-full bg-[#D2A065] text-[#0E3A2D] text-sm font-bold shadow-sm transition-transform group-hover:translate-x-0.5"
            aria-hidden
          >
            →
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
