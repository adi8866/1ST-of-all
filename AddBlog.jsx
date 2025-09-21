// src/Pages/admins/AddBlog.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const CATS = ["Productivity", "AI", "Tech", "Lifestyle", "Career", "Startups"];

const toSlug = (s = "") =>
  s
    .toLowerCase()
    .trim()
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const wordCount = (html = "") => {
  const text = html.replace(/<\/?[^>]+(>|$)/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.split(" ").length : 0;
};

const QUILL_FORMATS = ["header", "bold", "italic", "underline", "clean", "link", "list"];
const QUILL_MODULES = {
  toolbar: { container: "#editor-toolbar" },
  clipboard: { matchVisual: false },
};

function EditorToolbar() {
  return (
    <div id="editor-toolbar" className="ql-toolbar ql-snow !border-black/10 !rounded-md !mb-2">
      <span className="ql-formats">
        <select className="ql-header" defaultValue="">
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="">Normal</option>
        </select>
      </span>
      <span className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-clean" />
      </span>
      <span className="ql-formats">
        <button className="ql-link" />
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
      </span>
    </div>
  );
}

export default function AddBlog() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(CATS[0]);
  const [tags, setTags] = useState([]);
  const [tagDraft, setTagDraft] = useState("");
  const [status, setStatus] = useState("draft");
  const [publishAt, setPublishAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [content, setContent] = useState("");
  const [thumb, setThumb] = useState(null);
  const [thumbUrl, setThumbUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const editorElRef = useRef(null);
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    console.log("AddBlog component loaded ✅");
  }, []);

  const userEditedSlug = useRef(false);
  useEffect(() => {
    if (!userEditedSlug.current) setSlug(toSlug(title));
  }, [title]);

  useEffect(() => {
    if (!thumb) {
      setThumbUrl("");
      return;
    }
    const url = URL.createObjectURL(thumb);
    setThumbUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [thumb]);

  useEffect(() => {
    const handler = (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Init Quill
  useEffect(() => {
    if (!editorElRef.current || quillRef.current) return;
    const q = new Quill(editorElRef.current, {
      theme: "snow",
      modules: QUILL_MODULES,
      formats: QUILL_FORMATS,
      placeholder:
        "Write a clear intro, a helpful middle, and a crisp ending. Keep paragraphs short.",
    });
    quillRef.current = q;

    if (content) q.clipboard.dangerouslyPasteHTML(content);

    const onChange = () => {
      const html = q.root.innerHTML;
      setContent(html);
      setDirty(true);
    };
    q.on("text-change", onChange);

    return () => {
      q.off("text-change", onChange);
      quillRef.current = null;
    };
  }, []); // run once

  const contentWords = useMemo(() => wordCount(content), [content]);
  const canPublish = useMemo(
    () => title.trim().length >= 4 && contentWords >= 50,
    [title, contentWords]
  );

  const addTag = () => {
    const t = tagDraft.trim().replace(/\s+/g, " ");
    if (!t) return;
    if (!tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagDraft("");
    setDirty(true);
  };
  const removeTag = (t) => {
    setTags((prev) => prev.filter((x) => x !== t));
    setDirty(true);
  };

  const onPick = () => fileInputRef.current?.click();
  const onFile = (file) => {
    if (!file) return;
    if (!file.type?.startsWith("image/")) return;
    setThumb(file);
    setDirty(true);
  };

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const prevent = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const onDrop = (e) => {
      prevent(e);
      const f = e.dataTransfer.files?.[0];
      onFile(f);
    };
    ["dragenter", "dragover", "dragleave", "drop"].forEach((ev) =>
      el.addEventListener(ev, prevent)
    );
    el.addEventListener("drop", onDrop);
    return () => {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((ev) =>
        el.removeEventListener(ev, prevent)
      );
      el.removeEventListener("drop", onDrop);
    };
  }, []);

  const saveDraft = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setStatus("draft");
    setDirty(false);
    setSaving(false);
    console.log("Saved as draft:", {
      title,
      subtitle,
      slug,
      category,
      tags,
      status: "draft",
      publishAt,
      content,
      thumb,
    });
  };

  const publish = async () => {
    if (!canPublish) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setStatus("published");
    setDirty(false);
    setSaving(false);
    console.log("Published:", {
      title,
      subtitle,
      slug,
      category,
      tags,
      status: "published",
      publishAt,
      content,
      thumb,
    });
  };

  const onInput = (setter) => (e) => {
    setter(e.target.value);
    setDirty(true);
  };

  const insertAI = () => {
    const q = quillRef.current;
    if (!q) return;
    const sample = `<h2>Quick outline</h2>
<ul>
  <li>Why this matters</li>
  <li>Actionable steps</li>
  <li>Common pitfalls</li>
  <li>Wrap-up & next steps</li>
</ul>
<p>Here’s a concise intro that frames the reader’s problem and sets a clear promise for what they’ll learn. Keep sentences short, verbs active, and examples concrete.</p>`;
    q.clipboard.dangerouslyPasteHTML(q.getLength() - 1, sample);
    q.focus();
  };

  return (
    <section className="px-0 py-4 sm:py-6">
      {/* Page header */}
      <header className="px-4 mb-4">
        <h1 className="text-xl font-semibold tracking-tight">Add Blog</h1>
        <p className="text-sm text-[#0A241D]/60">Create a new post. Keep the tone clear, useful, and human.</p>
      </header>

      {/* Wider page container */}
      <div className="mx-auto w-full max-w-screen-xl px-4">
        {/* More editor width vs sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr),300px] xl:grid-cols-[minmax(0,1.4fr),300px] 2xl:grid-cols-[minmax(0,1.6fr),300px] gap-6">
          {/* LEFT — Main form */}
          <div className="space-y-6">
            {/* Thumbnail */}
            <div className="rounded-2xl bg-white border border-black/10 p-6">
              <label className="block text-sm font-medium mb-3">Thumbnail</label>
              <div
                ref={dropRef}
                className="relative rounded-xl border border-dashed border-black/15 bg-[#F7F7F5] text-[#0A241D]/70 p-4 sm:p-6 grid place-items-center"
              >
                {thumbUrl ? (
                  <img src={thumbUrl} alt="Preview" className="w-full max-h-64 object-cover rounded-lg shadow-sm" />
                ) : (
                  <div className="text-center">
                    <p className="text-sm mb-2">Drag & drop an image here</p>
                    <p className="text-xs mb-3">PNG, JPG, or GIF (max ~5MB)</p>
                    <button
                      type="button"
                      onClick={onPick}
                      className="rounded-full px-4 py-2 text-sm font-semibold bg-white text-[#0A241D] ring-1 ring-black/10 shadow-sm hover:bg-white/95 active:translate-y-px"
                    >
                      Choose file
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />
              </div>
            </div>

            {/* Title / Subtitle / Slug */}
            <div className="rounded-2xl bg-white border border-black/10 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Blog title</label>
                  <input
                    value={title}
                    onChange={onInput(setTitle)}
                    placeholder="A precise, helpful headline"
                    className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[#145A4F]/30"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Subtitle</label>
                  <input
                    value={subtitle}
                    onChange={onInput(setSubtitle)}
                    placeholder="Add a short supporting line"
                    className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[#145A4F]/30"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                  <input
                    value={slug}
                    onChange={(e) => {
                      userEditedSlug.current = true;
                      onInput(setSlug)(e);
                    }}
                    placeholder="auto-generated-from-title"
                    className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[#145A4F]/30"
                  />
                </div>
              </div>
            </div>

            {/* Content — Quill with custom toolbar + AI button */}
            <div className="rounded-2xl bg-white border border-black/10 p-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Blog description</label>
                <span className="text-xs text-[#0A241D]/60">{contentWords} words</span>
              </div>

              <EditorToolbar />

              <div className="relative">
                <div
  ref={editorElRef}
  className="
    [&_.ql-container]:rounded-md [&_.ql-container]:border-black/10
    [&_.ql-container]:min-h-[640px] lg:[&_.ql-container]:min-h-[720px] xl:[&_.ql-container]:min-h-[800px]
    [&_.ql-editor]:min-h-[600px] lg:[&_.ql-editor]:min-h-[720px] xl:[&_.ql-editor]:min-h-[760px]
  "
/>

                
                <button
                  type="button"
                  onClick={insertAI}
                  className="absolute bottom-2 right-2 rounded-md px-3 py-1.5 text-xs font-semibold bg-[#0A241D] text-white hover:opacity-90 active:translate-y-px shadow-sm"
                  title="Generate with AI"
                >
                  Generate with AI
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT — Meta / controls (slightly slimmer) */}
          <aside className="lg:sticky lg:top-[88px] space-y-6 h-max">
            <div className="rounded-2xl bg-white border border-black/10 p-6">
              <h3 className="text-sm font-semibold mb-4">Meta</h3>

              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={onInput(setCategory)}
                className="w-full mb-4 rounded-lg border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[#145A4F]/30"
              >
                {CATS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Press Enter to add"
                  className="flex-1 rounded-lg border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[#145A4F]/30"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="rounded-lg px-3 py-2 text-sm font-semibold bg-white text-[#0A241D] ring-1 ring-black/10 hover:bg-[#0A241D]/5"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold bg-[#145A4F]/10 text-[#0A241D] ring-1 ring-[#145A4F]/20"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        title="Remove tag"
                        className="ml-1 rounded-full px-1.5 hover:bg-black/10"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Status</label>
                <div className="inline-flex rounded-lg border border-black/10 overflow-hidden">
                  {[
                    { key: "draft", label: "Draft" },
                    { key: "published", label: "Publish" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setStatus(opt.key);
                        setDirty(true);
                      }}
                      className={`px-3 py-1.5 text-sm transition ${
                        status === opt.key ? "bg-[#145A4F] text-white" : "bg-white text-[#0A241D] hover:bg-[#0A241D]/5"
                      }`}
                      type="button"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Publish date</label>
                <input
                  type="datetime-local"
                  value={publishAt}
                  onChange={onInput(setPublishAt)}
                  className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[#145A4F]/30"
                />
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-black/10 p-6">
              <div className="flex items-center justify-between">
                <span className={`text-xs ${dirty ? "text-amber-700" : "text-[#0A241D]/50"}`}>
                  {dirty ? "Unsaved changes" : "All changes saved"}
                </span>

                <div className="flex items-center gap-2">
                  <motion.button
                    type="button"
                    disabled={saving}
                    onClick={saveDraft}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-semibold
                               bg-white text-[#0A241D] ring-1 ring-black/10 hover:bg-[#0A241D]/5
                               disabled:opacity-60"
                  >
                    <span aria-hidden="true">📝</span>
                    {saving ? "Saving…" : "Save draft"}
                  </motion.button>

                  <motion.button
                    type="button"
                    disabled={saving || !canPublish}
                    onClick={publish}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-semibold text-white
                      ${canPublish ? "bg-[#145A4F] hover:opacity-95" : "bg-[#145A4F]/50"}
                      shadow-[0_10px_20px_-10px_rgba(20,90,79,0.6)] disabled:cursor-not-allowed`}
                  >
                    <span aria-hidden="true">{status === "published" ? "🚀" : "✨"}</span>
                    {saving ? "Publishing…" : "Publish"}
                  </motion.button>
                </div>
              </div>

              {!canPublish && (
                <p className="mt-3 text-xs text-[#0A241D]/60">
                  Add at least a 4-character title and ~50+ words to enable publishing.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
