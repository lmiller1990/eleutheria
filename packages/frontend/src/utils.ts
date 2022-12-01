export function assert(value: unknown, message?: string | Error): asserts value;
export function assert(val: any) {
  if (!val) throw Error("Uh oh");
  return val;
}
