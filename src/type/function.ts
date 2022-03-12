import { Type } from "../types";
import { parse } from "../util";

export function functionType(): Type<Function> {
  return {
    parse<TType extends Function>(input: TType): TType {
      return parse<TType>("function", input);
    },
  };
}
