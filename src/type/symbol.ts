import { Type } from "../types";
import { parse } from "../util";
import { helpers } from "../helpers";

export function symbolType(): Type<symbol> {
  return {
    ...helpers(),
    parse(input: unknown): symbol {
      return parse<symbol>("symbol", input);
    },
  };
}
