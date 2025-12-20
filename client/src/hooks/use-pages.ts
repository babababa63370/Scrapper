import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// Shared Zod schema imports are assumed to be handled by the route definitions
// but we need to match the return types exactly.

export function useScrapedPages() {
  return useQuery({
    queryKey: [api.pages.list.path],
    queryFn: async () => {
      const res = await fetch(api.pages.list.path);
      if (!res.ok) throw new Error("Failed to fetch pages");
      const data = await res.json();
      return api.pages.list.responses[200].parse(data);
    },
  });
}

export function useScrapedPage(id: number) {
  return useQuery({
    queryKey: [api.pages.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.pages.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch page details");
      const data = await res.json();
      return api.pages.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.pages.delete.path, { id });
      const res = await fetch(url, { method: api.pages.delete.method });
      if (!res.ok) throw new Error("Failed to delete page");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.pages.list.path] });
    },
  });
}
