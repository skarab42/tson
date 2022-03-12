import { Type } from "../types";
import { parse } from "../util";

export function booleanType(): Type<boolean> {
  return {
    parse(input: unknown): boolean {
      return parse<boolean>("boolean", input);
    },
  };
}
