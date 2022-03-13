import { TypeParseError } from "../errors";
import { helpers } from "../helpers";
import { Type } from "../types";

export function neverType(): Type<never> {
  return {
    ...helpers(),
    parse(input: unknown): never {
      throw new TypeParseError("never", input);
    },
  };
}
