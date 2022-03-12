import { TypeParseError } from "../errors";
import { Type } from "../types";

export function neverType(): Type<never> {
  return {
    parse(input: unknown): never {
      throw new TypeParseError("never", input);
    },
  };
}
