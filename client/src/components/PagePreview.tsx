import { useEffect, useRef } from "react";

interface PagePreviewProps {
  htmlContent: string;
  cssContent?: string;
  baseUrl?: string;
}

export function PagePreview({ htmlContent, cssContent, baseUrl }: PagePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    try {
      // Create a blob with the combined HTML and CSS
      let fullHtml = htmlContent;
      
      // Inject base tag for relative URL resolution
      let headContent = '';
      if (baseUrl) {
        headContent += `<base href="${baseUrl}" />`;
      }
      
      // Inject CSS into head if available
      if (cssContent) {
        headContent += `<style data-injected="true">${cssContent}</style>`;
      }

      // Insert into head
      if (headContent) {
        if (fullHtml.includes('</head>')) {
          fullHtml = fullHtml.replace('</head>', `${headContent}</head>`);
        } else if (fullHtml.includes('<head')) {
          fullHtml = fullHtml.replace('<head>', `<head>${headContent}`);
        } else {
          // If no head tag, create one
          fullHtml = `<head>${headContent}</head>${fullHtml}`;
        }
      }

      // Create blob and set as iframe src
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      iframeRef.current.src = blobUrl;

      // Cleanup
      return () => {
        URL.revokeObjectURL(blobUrl);
      };
    } catch (error) {
      console.error('Error setting up page preview:', error);
    }
  }, [htmlContent, cssContent, baseUrl]);

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
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
}
