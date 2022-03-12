import { TypeParseError } from "../errors";
import { Type } from "../types";

export function integerType(): Type<number> {
  return {
    parse(input: unknown): number {
      if (Number.isInteger(input) === false) {
        throw new TypeParseError("integer", input);
      }

      return input as number;
    },
  };
}
