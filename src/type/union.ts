import { InferTuple, Type, Writable } from "../types";
import { TypeParseError } from "../errors";
import { helpers } from "../helpers";

export function unionType<
  TKey extends Type<unknown>,
  TTypes extends readonly [TKey, ...TKey[]],
>(types: TTypes): Type<InferTuple<Writable<TTypes>>>;

export function unionType<TTypes extends Type<unknown>[]>(
  ...types: TTypes
): Type<InferTuple<TTypes>>;

export function unionType<
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
    ...helpers(),
    parse(input: unknown) {
      const expectTypes: Set<string> = new Set();
      let errorCount = 0;

      types.forEach((type) => {
        try {
          type.parse(input);
        } catch (error) {
          if (error instanceof TypeParseError) {
            expectTypes.add(error.expected);
          }
          errorCount++;
        }
      });

      if (errorCount === types.length) {
        throw new TypeParseError([...expectTypes].join("|"), input);
      }

      return input;
    },
  };
}
