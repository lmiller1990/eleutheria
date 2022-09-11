export function debug(namespace: string) {
  return (...args: any[]) => {
    if (process.env.DEBUG && namespace.includes(process.env.DEBUG)) {
      console.log(`[${namespace}]:`, ...args);
    }
  };
}
