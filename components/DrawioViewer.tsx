"use client";

import { useEffect, useRef } from "react";

interface DrawioViewerProps {
  xml: string;
}

export default function DrawioViewer({ xml }: DrawioViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !xml) return;

    const container = containerRef.current;
    container.innerHTML = "";

    const div = document.createElement("div");
    div.className = "mxgraph";
    div.setAttribute("data-mxgraph", JSON.stringify({
      highlight: "#79a82d",
      nav: true,
      center: true,
      resize: true,
      toolbar: "zoom layers lightbox",
      edit: "_blank",
      xml: xml,
    }));
    container.appendChild(div);

    const existing = document.getElementById("drawio-viewer-script");
    if (existing) {
      existing.remove();
    }

    const script = document.createElement("script");
    script.id = "drawio-viewer-script";
    script.src = "https://viewer.diagrams.net/js/viewer-static.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const s = document.getElementById("drawio-viewer-script");
      if (s) s.remove();
    };
  }, [xml]);

  return (
    <div className="flex min-h-[400px] items-start justify-center rounded-xl border border-border-soft bg-white p-4">
      <div ref={containerRef} />
    </div>
  );
}
