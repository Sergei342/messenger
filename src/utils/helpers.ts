export function debounce<T extends (
  ...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function debounced(this: any, ...args: Parameters<T>) { // ← Добавьте имя "debounced"
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

export function throttle<T extends (
  ...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return function throttled(this: any, ...args: Parameters<T>) { // ← Добавьте имя "throttled"
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}
