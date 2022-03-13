import { InferType, Type } from "../types";

export function preprocessType<
  TFunc extends (input: unknown) => unknown,
  TType extends Type<InferType<TType>>,
>(filter: TFunc, type: TType): TType {
  return {
    ...type,
    parse(input: unknown) {
      return type.parse(filter(input));
    },
  };
}
