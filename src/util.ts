import { TypeParseError } from "./errors";
import { ParseType } from "./types";

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

export function parse<TReturn>(type: ParseType, input: unknown): TReturn {
  if (typeOf(input) === type) {
    return input as TReturn;
  }

  throw new TypeParseError(type, input);
}
