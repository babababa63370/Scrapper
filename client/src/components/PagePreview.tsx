import { useEffect, useRef } from "react";

interface PagePreviewProps {
  htmlContent: string;
  cssContent?: string;
}

export function PagePreview({ htmlContent, cssContent }: PagePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentDocument) {
      const doc = iframeRef.current.contentDocument;
      
      // Clear and write the HTML
      doc.open();
      doc.write(htmlContent);
      
      // Inject CSS if available
      if (cssContent) {
        const styleTag = doc.createElement('style');
        styleTag.textContent = cssContent;
        doc.head.appendChild(styleTag);
      }
      
      doc.close();
    }
  }, [htmlContent, cssContent]);

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-700 bg-white">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2f33] border-b border-gray-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs font-mono text-gray-400">page-preview</span>
      </div>
      <iframe
        ref={iframeRef}
        className="w-full h-[600px] border-0"
        title="Page Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
}
