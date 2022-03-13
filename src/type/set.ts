import { InferType, Type, UnwrapTuple, Writable } from "../types";
import { TypeParseError } from "../errors";
import { parse } from "../util";
import { tupleType } from "./tuple";
import { arrayType } from "./array";
import { helpers } from "../helpers";

export function setType<
  TType extends Type<InferType<TType>>,
  TReturn = Set<InferType<TType>>,
>(type: TType): Type<TReturn>;

export function setType<
  TKey extends Type<unknown>,
  TTypes extends readonly [TKey, ...TKey[]],
  TReturn = Set<UnwrapTuple<Writable<TTypes>>>,
>(types: TTypes): Type<TReturn>;

export function setType<
  TTypes extends Type<unknown>[],
  TReturn = Set<UnwrapTuple<TTypes>>,
>(...types: TTypes): Type<TReturn>;

export function setType<
  TTypesOrFirstType extends Type<unknown> | Type<unknown>[],
  TNextTypes extends Type<unknown>[],
>(typesOrFirstType: TTypesOrFirstType, ...nextTypes: TNextTypes) {
  let schema: Type<unknown>;

  if (Array.isArray(typesOrFirstType)) {
    schema = tupleType(...typesOrFirstType, ...nextTypes);
  } else if (nextTypes.length) {
    schema = tupleType(typesOrFirstType, ...nextTypes);
  } else {
    schema = arrayType(typesOrFirstType);
  }

  parse<typeof schema>("object", schema);

  return {
    ...helpers(),
    parse(input: unknown) {
      if (input instanceof Set) {
        schema.parse([...input]);

        return input;
      }

      throw new TypeParseError("Set", input);
    },
  };
}
