import { Type } from "../types";
import { parse } from "../util";
import { helpers } from "../helpers";

export function nullType(): Type<null> {
  return {
    ...helpers(),
    parse(input: unknown): null {
      return parse<null>("null", input);
    },
  };
}
