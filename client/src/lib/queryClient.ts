import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// API base URL defaults to the current host in production
// or localhost:5000 in development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function apiRequest<T>(method: string, endpoint: string, data?: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Send cookies if present
  });

  await throwIfResNotOk(response);
  return response.json() as Promise<T>;
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn =
  <T>({ on401 }: { on401: UnauthorizedBehavior }): any =>
  async ({ queryKey }: { queryKey: string[] }) => {
    let url;
    if (queryKey.length > 1) {
      // Handle array-based queryKey where first element is the endpoint and subsequent elements are path params
      url = `${API_BASE_URL}${queryKey[0]}/${queryKey[1]}`;
    } else {
      // Handle single-string queryKey
      url = `${API_BASE_URL}${queryKey[0]}`;
    }
    
    const res = await fetch(url, { credentials: "include" });

    if (on401 === "returnNull" && res.status === 401) {
      return null as T;
    }

    await throwIfResNotOk(res);
    return res.json() as Promise<T>;
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
