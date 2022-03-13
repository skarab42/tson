import {
  ArrayTypeParseError,
  LengthMismatchError,
  TypeParseError,
} from "../errors";
import { helpers } from "../helpers";
import { Type, UnwrapTuple, Writable } from "../types";
import { parse } from "../util";

export function tupleType<
  TKey extends Type<unknown>,
  TTypes extends readonly [TKey, ...TKey[]],
>(types: TTypes): Type<UnwrapTuple<Writable<TTypes>>>;

export function tupleType<TTypes extends Type<unknown>[]>(
  ...types: TTypes
): Type<UnwrapTuple<TTypes>>;

export function tupleType<
  TTypesOrFirstType extends Type<unknown> | Type<unknown>[],
  TNextTypes extends Type<unknown>[],
>(typesOrFirstType: TTypesOrFirstType, ...nextTypes: TNextTypes) {
  let types: Type<unknown>[] = [];

  if (Array.isArray(typesOrFirstType)) {
    types = [...typesOrFirstType, ...nextTypes];
  } else {
    types = [typesOrFirstType, ...nextTypes];
  }

  return {
    ...helpers<unknown[]>(),
    parse(input: unknown[]) {
      parse<typeof types>("array", input);

      if (types.length !== input.length) {
        throw new LengthMismatchError(types.length, input.length);
      }

      let lastId = 0;

      try {
        types.forEach((type, index) => {
          lastId = index;
          type.parse(input[index]);
        });
      } catch (error) {
        if (error instanceof TypeParseError) {
          const path = [lastId.toString(), ...error.path];
          throw new ArrayTypeParseError(error.expected, error.input, path);
        }

        throw error;
      }

      return input;
    },
  };
}
