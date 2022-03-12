import { Type } from "../types";
import { parse } from "../util";

export function bigintType(): Type<bigint> {
  return {
    parse(input: unknown): bigint {
      return parse<bigint>("bigint", input);
    },
  };
}
