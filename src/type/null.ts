import { Type } from "../types";
import { parse } from "../util";

export function nullType(): Type<null> {
  return {
    parse(input: unknown): null {
      return parse<null>("null", input);
    },
  };
}
