import React, { useEffect } from "react";

const Loader = ({ size = 64 }) => {
  useEffect(() => {
    console.log("Loading...");
  }, []);

  const px = `${size}px`;

  return (
    <div className="flex items-center justify-center h-32" role="status" aria-live="polite">
      <div
        className="animate-spin rounded-full border-4 border-green-300 border-t-green-600"
        style={{ width: px, height: px }}
        aria-label="Loading"
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
};

export default Loader;
