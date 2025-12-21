import { useScrapedPages, useDeletePage } from "@/hooks/use-pages";
import { Link } from "wouter";
import { Trash2, Code, Clock } from "lucide-react";
import { format } from "date-fns";

export function PagesList() {
  const { data: pages, isLoading } = useScrapedPages();
  const deletePageMutation = useDeletePage();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!pages || pages.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No pages yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {pages.map((page) => (
        <div key={page.id} className="p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors group">
          <Link href={`/page/${page.id}`} className="block font-medium text-sm text-gray-900 hover:text-primary mb-1">
            {page.title || "Untitled"}
          </Link>
          <p className="text-xs text-muted-foreground truncate mb-2">{page.url}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {page.createdAt && format(new Date(page.createdAt), "MMM d, h:mm a")}
            </span>
            <div className="flex gap-1">
              <Link href={`/page/${page.id}`} className="p-1.5 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary">
                <Code className="w-3 h-3" />
              </Link>
              <button
                onClick={() => {
                  if (confirm("Delete this page?")) {
                    deletePageMutation.mutate(page.id);
                  }
                }}
                className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
