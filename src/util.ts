import { TypeCheckError } from "./errors";
import { CheckType } from "./types";

export function typeOf(input: unknown): string {
  if (typeof input === "undefined") {
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

export function check<TReturn>(type: CheckType, input: unknown): TReturn {
  if (typeOf(input) === type) {
    return input as TReturn;
  }

  throw new TypeCheckError(type, input);
}
