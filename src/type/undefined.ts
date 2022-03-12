import { Type } from "../types";
import { parse } from "../util";

export function undefinedType(): Type<undefined> {
  return {
    parse(input: unknown): undefined {
      return parse<undefined>("undefined", input);
    },
  };
}
