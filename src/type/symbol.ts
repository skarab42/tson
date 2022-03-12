import { Type } from "../types";
import { parse } from "../util";

export function symbolType(): Type<symbol> {
  return {
    parse(input: unknown): symbol {
      return parse<symbol>("symbol", input);
    },
  };
}
