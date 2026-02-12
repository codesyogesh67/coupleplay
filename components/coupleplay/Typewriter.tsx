"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  text: string;
  speed?: number; // ms per character
  startDelay?: number; // ms before typing starts
};

export function Typewriter({
  text,
  speed = 40,
  startDelay = 150,
}: TypewriterProps) {
  const [shown, setShown] = useState("");

  // restart typing whenever text changes
  useEffect(() => {
    setShown("");
  }, [text]);

  // typing effect
  useEffect(() => {
    if (!text) return;

    let i = 0;
    let intervalId: number | null = null;

    const start = () => {
      intervalId = window.setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length && intervalId) window.clearInterval(intervalId);
      }, speed);
    };

    const timeoutId = window.setTimeout(start, startDelay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {shown}
      {shown.length < text.length ? (
        <span className="inline-block w-[8px] animate-pulse">▍</span>
      ) : null}
    </div>
  );
}
