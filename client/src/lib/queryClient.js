import { QueryClient } from "@tanstack/react-query";

// Helper function to ensure API URLs work in both development and production
function getApiUrl(path) {
  // Check if path is already a full URL
  if (path.startsWith('http')) {
    return path;
  }
  
  // Use relative paths in development, and absolute paths in production
  // This ensures compatibility with Vercel deployment
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction 
    ? window.location.origin
    : '';
    
  // Make sure the path starts with /api
  const apiPath = path.startsWith('/api') ? path : `/api${path}`;
  return `${baseUrl}${apiPath}`;
}

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method,
  url,
  data,
) {
  // Use the helper function to ensure the URL works in all environments
  const apiUrl = getApiUrl(url);
  
  const res = await fetch(apiUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

export const getQueryFn = (options) => {
  const { on401: unauthorizedBehavior } = options;
  
  return async ({ queryKey }) => {
    // Use the helper function to ensure the URL works in all environments
    const apiUrl = getApiUrl(queryKey[0]);
    
    const res = await fetch(apiUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };
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