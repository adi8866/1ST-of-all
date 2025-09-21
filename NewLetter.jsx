import React, { useState } from "react";

const NewLetter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // 'ok' | 'err' | null

  const onSubmit = (e) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) return setStatus("err");
    setStatus("ok");
    // hook up API here
  };

  return (
    <section className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 my-10 sm:my-14">
      {/* card */}
      <div className="mx-auto max-w-4xl rounded-2xl bg-white ring-1 ring-black/10 shadow-sm px-6 sm:px-8 py-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[1.35rem] sm:text-[1.6rem] font-extrabold tracking-tight text-[#0E3A2D]">
            Updates so good, you’ll brag about knowing first.
          </h2>

          <p className="mt-2 text-sm sm:text-base text-[#0A241D]/70">
            Think of it as a gym for your brain—minus the sweat.
          </p>

          {/* Mobile: stacked input + button */}
          <form
            onSubmit={onSubmit}
            aria-label="Newsletter signup"
            className="mt-5 sm:hidden"
          >
            <div className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus(null);
                }}
                placeholder="Pop in your email"
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base outline-none placeholder-gray-400 text-gray-900 focus:ring-2 focus:ring-[#0E3A2D]/20"
                aria-invalid={status === "err"}
                required
              />
              <button
                type="submit"
                className="w-full rounded-md bg-[#0E3A2D] px-4 py-3 text-white font-semibold hover:bg-[#0c2f25] transition"
              >
                Subscribe
              </button>
            </div>

            <div
              className={`mt-2 rounded-md border px-3 py-2 text-xs ${
                status === "err"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-gray-200 bg-gray-50 text-gray-600"
              }`}
              aria-live="polite"
            >
              {status === "err"
                ? "Please enter a valid email."
                : "No spam. Unsubscribe anytime."}
            </div>

            {status === "ok" && (
              <div
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-emerald-700 text-sm"
                role="status"
                aria-live="assertive"
              >
                ✅ Subscribed! Watch your inbox.
              </div>
            )}
          </form>

          {/* Desktop: single rectangular bar */}
          <form
            onSubmit={onSubmit}
            aria-label="Newsletter signup"
            className="mt-6 hidden sm:block"
          >
            <div className="mx-auto max-w-2xl overflow-hidden rounded-md border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-[#0E3A2D]/15">
              <div className="flex items-stretch">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setStatus(null);
                  }}
                  placeholder="Pop in your email"
                  className="flex-1 px-4 py-3 text-base outline-none placeholder-gray-400 text-gray-900"
                  aria-invalid={status === "err"}
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0E3A2D] text-white font-semibold hover:bg-[#0c2f25] transition border-l border-gray-300"
                  title="Subscribe"
                >
                  Subscribe
                </button>
              </div>
            </div>

            <div
              className={`mx-auto max-w-2xl mt-2 rounded-md border px-3 py-2 text-xs ${
                status === "err"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-gray-200 bg-gray-50 text-gray-600"
              }`}
              aria-live="polite"
            >
              {status === "err"
                ? "Please enter a valid email."
                : "No spam. Unsubscribe anytime."}
            </div>

            {status === "ok" && (
              <div
                className="mx-auto max-w-2xl mt-3 inline-flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-emerald-700 text-sm"
                role="status"
                aria-live="assertive"
              >
                ✅ Subscribed! Watch your inbox.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewLetter;
