import { TypeParseError } from "./errors";
import { optionalType } from "./type/optional";
import { preprocessType } from "./type/preprocess";
import { postprocessType } from "./type/postprocess";
import { ProcessFilter, Type, TypeHelpers } from "./types";

function postprocess<TType>(this: Type<TType>, filter: ProcessFilter<TType>) {
  return postprocessType(filter, this);
}

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
    preprocess(this: Type<TType>, filter: ProcessFilter) {
      return preprocessType(filter, this);
    },
    postprocess,
    transform: postprocess,
  };
}
