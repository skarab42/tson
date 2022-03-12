import { Type } from "../types";

export function unknownType(): Type<unknown> {
  return {
    parse(input: unknown): unknown {
      return input;
    },
  };
}
