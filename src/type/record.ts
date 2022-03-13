import { InferType, Schema, Type } from "../types";
import { objectType } from "./object";
import { helpers } from "../helpers";
import { parse } from "../util";

export function recordType<
  TType extends Type<unknown>,
  TReturn = Record<string, InferType<TType>>,
>(type: TType): Type<TReturn> {
  parse<object>("object", type);

  return {
    ...helpers(),
    parse(input: unknown) {
      const schema: Schema = {};
      const inputObj = parse<TReturn>("object", input);

      Object.keys(inputObj).forEach((key) => (schema[key] = type));

      return objectType(schema).parse(input) as TReturn;
    },
  };
}
