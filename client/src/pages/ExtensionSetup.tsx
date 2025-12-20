import { Download, Terminal, Puzzle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ExtensionSetup() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 mb-12">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto rotate-3">
          <Puzzle className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Install the Firefox Extension</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Enable your browser to seamlessly capture page content and send it directly to this dashboard.
        </p>
      </div>

      <div className="grid gap-8 relative">
        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-border hidden md:block"></div>

        {/* Step 1 */}
        <div className="relative pl-0 md:pl-24 group">
          <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 bg-white border-2 border-primary rounded-full items-center justify-center text-xl font-bold text-primary shadow-lg shadow-primary/10 z-10">
            1
          </div>
          <div className="glass-card p-8 hover:border-primary/40">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Locate Extension Files</h3>
                <p className="text-gray-600 mb-4">
                  The extension source code has been generated in your project root under the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-200">/extension</code> directory.
                </p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Terminal className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative pl-0 md:pl-24 group">
          <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 bg-white border-2 border-gray-200 group-hover:border-primary transition-colors rounded-full items-center justify-center text-xl font-bold text-gray-400 group-hover:text-primary z-10">
            2
          </div>
          <div className="glass-card p-8 hover:border-primary/40">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Open Firefox Debugging</h3>
                <p className="text-gray-600 mb-4">
                  Open Firefox and navigate to the debugging page by typing this in your address bar:
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm inline-flex items-center gap-3 shadow-inner">
                  <span>about:debugging#/runtime/this-firefox</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText("about:debugging#/runtime/this-firefox")}
                    className="text-gray-400 hover:text-white"
                    title="Copy to clipboard"
                  >
                    <CopyIcon />
                  </button>
                </div>
              </div>
              <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                <Puzzle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative pl-0 md:pl-24 group">
          <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 bg-white border-2 border-gray-200 group-hover:border-primary transition-colors rounded-full items-center justify-center text-xl font-bold text-gray-400 group-hover:text-primary z-10">
            3
          </div>
          <div className="glass-card p-8 hover:border-primary/40">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Load Temporary Add-on</h3>
                <p className="text-gray-600 mb-4">
                  Click <span className="font-semibold text-gray-900">"Load Temporary Add-on..."</span> and select the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">manifest.json</code> file from the extension directory.
                </p>
                <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3 text-green-800">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">Once loaded, navigate to any website and click the extension icon to scrape content!</p>
                </div>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <Download className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  );
}
