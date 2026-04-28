"use client";

import { useEffect, useRef } from "react";

export function XssCard() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      const script = document.createElement("script");
      script.textContent = `alert("flag7{Z9fL2qX7wA}")`;
      ref.current.appendChild(script);
    }
  }, []);
  return <div ref={ref} />;
}
