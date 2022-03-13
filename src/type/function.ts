import { UnwrapTuple, TypeBase, InferType, AnyFunction, Type } from "../types";
import { undefinedType } from "./undefined";
import { tupleType } from "./tuple";

export function functionType<
  TKey extends TypeBase<unknown>,
  TReturns extends TypeBase<void>,
  TArgs extends readonly [TKey, ...TKey[]],
  TFunc = (...args: UnwrapTuple<TArgs>) => InferType<TReturns>,
>(args: TArgs, returns?: TReturns): TFunc;

export function functionType<
  TKey extends TypeBase<unknown>,
  TReturns extends TypeBase<void>,
  TArgs extends readonly [TKey, ...TKey[]],
  TFunc = (...args: UnwrapTuple<TArgs>) => InferType<TReturns>,
>(
  args: TArgs,
  returns: TReturns,
  implement?: (...args: UnwrapTuple<TArgs>) => InferType<TReturns>,
): TFunc;

export function functionType<TFunc = () => void>(...args: never): TFunc;

export function functionType(...input: unknown[]) {
  const argTypes: Type<unknown>[] = (input[0] as Type<unknown>[]) ?? [];
  const returnsType: Type<unknown> =
    (input[1] as Type<unknown>) ?? undefinedType();
  const implement: AnyFunction = (input[2] as AnyFunction) ?? (() => undefined);

  // TODO make a custom error for this case
  return (...args: unknown[]) => {
    if (argTypes.length > 0) {
      tupleType(...argTypes).parse(args);
    }

    return returnsType.parse(implement(...args));
  };
}
