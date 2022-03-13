import { TypeParseError } from "./errors";
import { Type, TypeHelpers } from "./types";
import { optionalType } from "./type/optional";

export function helpers<TType>(): TypeHelpers<TType> {
  return {
    safeParse(this: Type<TType>, input: unknown) {
      try {
        return { success: true, data: this.parse(input) };
      } catch (error) {
        if (error instanceof TypeParseError) {
          return { success: false, error };
        }

        throw error;
      }
    },
    optional(this: Type<TType>) {
      return optionalType(this);
    },
  };
}
