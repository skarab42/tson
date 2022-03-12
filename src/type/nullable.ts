import { TypeParseError } from "../errors";
import { InferType, Type } from "../types";

export function nullableType<TType extends Type<InferType<TType>>>(
  type: TType,
): Type<InferType<TType> | null> {
  return {
    ...type,
    parse(input: unknown): InferType<TType> | null {
      if (input === null) {
        return null;
      }

      try {
        return type.parse(input);
      } catch (error) {
        if (error instanceof TypeParseError) {
          throw new TypeParseError(`${error.expected}|null`, input);
        }

        throw error;
      }
    },
  };
}
