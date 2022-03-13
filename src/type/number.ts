import { Type } from "../types";
import { parse } from "../util";
import { helpers } from "../helpers";

export function numberType(): Type<number> {
  return {
    ...helpers(),
    parse(input: unknown): number {
      return parse<number>("number", input);
    },
  };
}
