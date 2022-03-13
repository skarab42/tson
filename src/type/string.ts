import { Type } from "../types";
import { parse } from "../util";
import { helpers } from "../helpers";

export function stringType(): Type<string> {
  return {
    ...helpers(),
    parse(input: unknown): string {
      return parse<string>("string", input);
    },
  };
}
