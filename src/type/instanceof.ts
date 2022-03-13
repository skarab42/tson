import { ClassLike, Type } from "../types";
import { instanceOf } from "../util";
import { helpers } from "../helpers";

export function instanceofType<TType extends ClassLike>(
  type: TType,
): Type<TType> {
  return {
    ...helpers(),
    parse(input: unknown): TType {
      return instanceOf<TType>(type, input);
    },
  };
}
