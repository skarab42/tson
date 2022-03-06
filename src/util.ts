export function typeOf(input: unknown): string {
  if (input === undefined) {
    return "undefined";
  }

  if (input === null) {
    return "null";
  }

  if (Array.isArray(input)) {
    return "array";
  }

  return typeof input;
}
