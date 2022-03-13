import { Type } from "../types";
import { parse } from "../util";
import { helpers } from "../helpers";

export function undefinedType(): Type<undefined> {
  return {
    ...helpers(),
    parse(input: unknown): undefined {
      return parse<undefined>("undefined", input);
    },
  };
}
