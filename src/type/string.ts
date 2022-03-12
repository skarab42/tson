import { Type } from "../types";
import { parse } from "../util";

export function stringType(): Type<string> {
  return {
    parse(input: unknown): string {
      return parse<string>("string", input);
    },
  };
}
