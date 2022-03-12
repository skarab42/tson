import { InferType, Schema, Type } from "../types";
import { parse } from "../util";
import { objectType } from "./object";

export function recordType<
  TType extends Type<unknown>,
  TReturn = Record<string, InferType<TType>>,
>(type: TType): Type<TReturn> {
  parse<object>("object", type);

  return {
    parse(input: unknown) {
      const schema: Schema = {};
      const inputObj = parse<TReturn>("object", input);

      Object.keys(inputObj).forEach((key) => (schema[key] = type));

      return objectType(schema).parse(input) as TReturn;
    },
  };
}
