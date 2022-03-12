import { TypeParseError } from "../errors";
import { InferType, Type } from "../types";

export function optionalType<TType extends Type<InferType<TType>>>(
  type: TType,
): Type<InferType<TType> | undefined> {
  return {
    ...type,
    parse(input: unknown): InferType<TType> | undefined {
      if (typeof input === "undefined") {
        return undefined;
      }

      try {
        return type.parse(input);
      } catch (error) {
        if (error instanceof TypeParseError) {
          throw new TypeParseError(`${error.expected}|undefined`, input);
        }

        throw error;
      }
    },
  };
}
