import { TypeParseError } from "../errors";
import { Type } from "../types";

export function finiteType(): Type<number> {
  return {
    parse(input: unknown): number {
      if (Number.isFinite(input) === false) {
        throw new TypeParseError("finite number", input);
      }

      return input as number;
    },
  };
}
