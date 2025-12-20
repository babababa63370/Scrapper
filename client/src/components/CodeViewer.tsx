import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Dark theme for code
import "prismjs/components/prism-markup"; // HTML support

interface CodeViewerProps {
  code: string;
  language?: string;
}

export function CodeViewer({ code, language = "markup" }: CodeViewerProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-700 bg-[#1d1f21]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2f33] border-b border-gray-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs font-mono text-gray-400">view-source:generated.html</span>
      </div>
      <div className="overflow-auto max-h-[600px] text-sm custom-scrollbar">
        <pre className="!m-0 !bg-transparent">
          <code ref={codeRef} className={`language-${language}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
