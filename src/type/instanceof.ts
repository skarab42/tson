import { ClassLike, Type } from "../types";
import { instanceOf } from "../util";

export function instanceofType<TType extends ClassLike>(
  type: TType,
): Type<TType> {
  return {
    parse(input: unknown): TType {
      return instanceOf<TType>(type, input);
    },
  };
}
