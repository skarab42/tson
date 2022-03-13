import { TypeParseError } from "../errors";
import { helpers } from "../helpers";
import { Type } from "../types";

export function integerType(): Type<number> {
  return {
    ...helpers(),
    parse(input: unknown): number {
      if (Number.isInteger(input) === false) {
        throw new TypeParseError("integer", input);
      }

      return input as number;
    },
  };
}
