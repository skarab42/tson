import { TypeParseError } from "./errors";
import { ClassLike, ObjectTypeMode, ParseType } from "./types";

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

  if (typeof input === "number") {
    if (Number.isNaN(input)) {
      return "NaN";
    }

    if (Number.isFinite(input) === false) {
      return "Infinity";
    }
  }

  return typeof input;
}

export function parse<TReturn>(type: ParseType, input: unknown): TReturn {
  if (typeOf(input) === type) {
    return input as TReturn;
  }

  throw new TypeParseError(type, input);
}

export function instanceOf<TType extends ClassLike>(
  type: TType,
  input: unknown,
): TType {
  if (input instanceof type) {
    return input as TType;
  }

  throw new TypeParseError(type.name, input);
}

export const defaultSettings = {
  objectTypeMode: ObjectTypeMode.STRICT,
};
