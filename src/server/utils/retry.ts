export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  baseMs = 300,
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < retries; i += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const delay = baseMs * 2 ** i + Math.floor(Math.random() * 100);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}
