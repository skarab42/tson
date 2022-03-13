import { Type } from "../types";
import { parse } from "../util";
import { helpers } from "../helpers";

export function booleanType(): Type<boolean> {
  return {
    ...helpers(),
    parse(input: unknown): boolean {
      return parse<boolean>("boolean", input);
    },
  };
}
