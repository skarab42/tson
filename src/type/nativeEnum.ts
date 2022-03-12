import { EnumKey, EnumType, Unwrap } from "../types";
import { enumType } from "./enum";

export function nativeEnumType<
  Key extends string,
  Value extends EnumKey,
  TEnum extends Record<Key, Value>,
  TUnion = TEnum[keyof TEnum],
>(anEnum: TEnum): EnumType<Unwrap<TEnum>, TEnum, TUnion> {
  return enumType(anEnum);
}
