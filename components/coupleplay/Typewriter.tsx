"use client";

import { useMemo, useState } from "react";

export function Typewriter({ text }: { text: string }) {
  const [shown, setShown] = useState("");

  // restart typing whenever text changes
  useMemo(() => {
    setShown("");
    return null;
  }, [text]);

  // typing effect
  useMemo(() => {
    if (!text) return null;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 14); // speed
    return () => window.clearInterval(id);
  }, [text]);

  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {shown}
      {shown.length < text.length ? (
        <span className="inline-block w-[8px] animate-pulse">▍</span>
      ) : null}
    </div>
  );
}
