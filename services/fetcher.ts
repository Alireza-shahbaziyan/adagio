type FetcherOptions = {
  revalidate?: number;
  cache?: RequestCache;
  headers?: HeadersInit;
};

export async function fetcher<T>(
  url: string,
  options?: FetcherOptions,
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options?.headers,
    },
    cache: options?.cache,
    next: options?.revalidate
      ? {
          revalidate: options.revalidate,
        }
      : undefined,
  });

  if (!response.ok) {
    throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
