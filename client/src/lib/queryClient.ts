import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Get the API base URL based on the environment
// This ensures API calls work in both local and production environments
const getApiBaseUrl = (): string => {
  // For local development - direct everything to the appropriate port
  // Express server is set to run on port 5000 (server/index.ts)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  // For other environments (Replit, production), use the same origin
  return '';
};

// Resolve a URL to include the API base URL if needed
const resolveApiUrl = (url: string): string => {
  // If the URL is already absolute (starts with http:// or https://), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative URL that starts with /api, prepend the base URL
  if (url.startsWith('/api')) {
    return `${getApiBaseUrl()}${url}`;
  }
  
  // Otherwise return as is
  return url;
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Resolve the URL before making the request
  const resolvedUrl = resolveApiUrl(url);
  console.log(`Making ${method} request to: ${resolvedUrl}`);
  
  try {
    const res = await fetch(resolvedUrl, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error(`API request error (${method} ${resolvedUrl}):`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Resolve the URL before making the request
    const url = queryKey[0] as string;
    const resolvedUrl = resolveApiUrl(url);
    console.log(`Making query request to: ${resolvedUrl}`);
    
    try {
      const res = await fetch(resolvedUrl, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      console.error(`Query error (${resolvedUrl}):`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
