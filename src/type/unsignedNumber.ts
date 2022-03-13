import { TypeParseError } from "../errors";
import { helpers } from "../helpers";
import { Type } from "../types";

export function unsignedNumberType(): Type<number> {
  return {
    ...helpers(),
    parse(input: unknown): number {
      const value = input as number;

      if (Number.isFinite(value) === false || value < 0) {
        throw new TypeParseError("unsigned number", input);
      }

      return input as number;
    },
  };
}
