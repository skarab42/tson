import { Type } from "../types";
import { parse } from "../util";
import { helpers } from "../helpers";

export function bigintType(): Type<bigint> {
  return {
    ...helpers(),
    parse(input: unknown): bigint {
      return parse<bigint>("bigint", input);
    },
  };
}
