import { Type } from "../types";
import { parse } from "../util";

export function infinityType(): Type<number> {
  return {
    parse(input: unknown): number {
      return parse<number>("Infinity", input);
    },
  };
}
