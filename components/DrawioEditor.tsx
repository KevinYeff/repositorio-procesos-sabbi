"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface DrawioEditorProps {
  initialXml?: string;
  onSave: (xml: string) => void;
}

export default function DrawioEditor({ initialXml, onSave }: DrawioEditorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== "https://embed.diagrams.net") return;

      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      if (data.event === "init") {
        setReady(true);
        if (initialXml) {
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ action: "load", xml: initialXml }),
            "https://embed.diagrams.net"
          );
        }
      }

      if (data.event === "save") {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({
            action: "export",
            format: "xml",
            xml: data.xml,
            spinKey: "saving",
          }),
          "https://embed.diagrams.net"
        );
      }

      if (data.event === "export") {
        onSave(data.data || data.xml);
      }
    },
    [initialXml, onSave]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  return (
    <div className="relative">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
          <p className="text-sm text-gray-500">Cargando editor de diagramas...</p>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src="https://embed.diagrams.net/?embed=1&proto=json&spin=1&saveAndExit=0&noExitBtn=1&noSaveBtn=0"
        className="h-[500px] w-full rounded-md border border-gray-300"
        style={{ border: "none" }}
      />
    </div>
  );
}
