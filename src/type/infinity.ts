import { Type } from "../types";
import { parse } from "../util";
import { helpers } from "../helpers";

export function infinityType(): Type<number> {
  return {
    ...helpers(),
    parse(input: unknown): number {
      return parse<number>("Infinity", input);
    },
  };
}
