import { TypeParseError } from "../errors";
import { Type } from "../types";

export function unsignedNumberType(): Type<number> {
  return {
    parse(input: unknown): number {
      const value = input as number;

      if (Number.isFinite(value) === false || value < 0) {
        throw new TypeParseError("unsigned number", input);
      }

      return input as number;
    },
  };
}
