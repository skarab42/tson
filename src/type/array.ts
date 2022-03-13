import { ArrayTypeParseError, TypeParseError } from "../errors";
import { InferType, Type } from "../types";
import { helpers } from "../helpers";
import { parse } from "../util";

export function arrayType<TType extends Type<unknown>>(
  type: TType,
): Type<InferType<TType>[]> {
  return {
    ...helpers(),
    parse(input: unknown[]): InferType<TType>[] {
      parse<InferType<TType>[]>("array", input);

      let lastId = 0;

      try {
        input.forEach((value, id) => {
          lastId = id;
          type.parse(value);
        });
      } catch (error) {
        if (error instanceof TypeParseError) {
          const path = [lastId.toString(), ...error.path];
          throw new ArrayTypeParseError(error.expected, error.input, path);
        }

        throw error;
      }

      return input as InferType<TType>[];
    },
  };
}
