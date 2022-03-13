import { TypeParseError } from "../errors";
import {
  EnumKey,
  EnumLike,
  EnumOrFirstValue,
  EnumType,
  EnumValues,
  FakeEnum,
  Unwrap,
} from "../types";
import { stringType } from "./string";
import { numberType } from "./number";
import { unionType } from "./union";
import { helpers } from "../helpers";

export function enumType<
  TKey extends string,
  TValues extends [TKey, ...TKey[]],
  TUnion = TValues[number],
>(values: TValues): EnumType<FakeEnum<TValues>, TValues, TUnion>;

export function enumType<
  TKey extends string,
  TValues extends Readonly<[TKey, ...TKey[]]>,
  TUnion = TValues[number],
>(values: TValues): EnumType<FakeEnum<TValues>, TValues, TUnion>;

export function enumType<TValues extends EnumValues, TUnion = TValues[number]>(
  ...values: TValues
): EnumType<FakeEnum<TValues>, TValues, TUnion>;

export function enumType<
  Key extends string,
  Value extends EnumKey,
  TEnum extends Record<Key, Value>,
  TUnion = TEnum[keyof TEnum],
>(anEnum: TEnum): EnumType<Unwrap<TEnum>, TEnum, TUnion>;

export function enumType<
  TEnumOrFirstValue extends EnumOrFirstValue,
  TNextValues extends string[] | EnumValues,
>(
  enumOrFirstValue: TEnumOrFirstValue,
  ...nextValues: TNextValues
): EnumType<unknown, unknown, unknown> {
  let enumObj: EnumLike = {};
  let values: (string | number)[] = [];

  if (typeof enumOrFirstValue === "string") {
    values = [enumOrFirstValue, ...nextValues];
  } else if (Array.isArray(enumOrFirstValue)) {
    values = [...enumOrFirstValue, ...nextValues];
  } else if (typeof enumOrFirstValue === "object") {
    enumObj = { ...enumOrFirstValue } as EnumLike;
    Object.entries(enumObj).forEach(([, value]) => {
      if (typeof enumObj[value] !== "number") {
        values.push(value);
      }
    });
  }

  if (values.length === 0) {
    throw new TypeParseError("enum", enumOrFirstValue); // TODO better error
  }

  if (Object.keys(enumObj).length === 0) {
    values.forEach((value) => {
      enumObj[value] = value;
    });
  }

  const schema = unionType([stringType(), numberType()]);

  return {
    ...helpers(),
    enum: Object.freeze(enumObj),
    options: Object.freeze(values),
    parse(input: unknown) {
      const value = schema.parse(input);

      if (values.includes(value) === false) {
        throw new TypeParseError(values.join("|"), input);
      }

      return value;
    },
  };
}
