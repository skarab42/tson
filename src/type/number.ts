import { Type } from "../types";
import { parse } from "../util";

export function numberType(): Type<number> {
  return {
    parse(input: unknown): number {
      return parse<number>("number", input);
    },
  };
}
