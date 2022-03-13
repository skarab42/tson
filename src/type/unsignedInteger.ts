import { TypeParseError } from "../errors";
import { helpers } from "../helpers";
import { Type } from "../types";

export function unsignedIntegerType(): Type<number> {
  return {
    ...helpers(),
    parse(input: unknown): number {
      const value = input as number;

      if (Number.isInteger(value) === false || value < 0) {
        throw new TypeParseError("unsigned integer", input);
      }

      return input as number;
    },
  };
}
