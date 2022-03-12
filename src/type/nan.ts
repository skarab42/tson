import { Type } from "../types";
import { parse } from "../util";

export function nanType(): Type<number> {
  return {
    parse(input: unknown): number {
      return parse<number>("NaN", input);
    },
  };
}
