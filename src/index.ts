import { dateType } from "./type/date";
import { instanceofType } from "./type/instanceof";
import { unsignedNumberType } from "./type/unsignedNumber";
import { unsignedIntegerType } from "./type/unsignedInteger";
import { integerType } from "./type/integer";
import { finiteType } from "./type/finite";
import { infinityType } from "./type/infinity";
import { nanType } from "./type/nan";
import { literalType } from "./type/literal";
import { nativeEnumType } from "./type/nativeEnum";
import { enumType } from "./type/enum";
import { unionType } from "./type/union";
import { nullableType } from "./type/nullable";
import { optionalType } from "./type/optional";
import { recordType } from "./type/record";
import { objectType } from "./type/object";
import { tupleType } from "./type/tuple";
import { mapType } from "./type/map";
import { setType } from "./type/set";
import { arrayType } from "./type/array";
import { undefinedType } from "./type/undefined";
import { nullType } from "./type/null";
import { functionType } from "./type/function";
import { symbolType } from "./type/symbol";
import { bigintType } from "./type/bigint";
import { booleanType } from "./type/boolean";
import { numberType } from "./type/number";
import { stringType } from "./type/string";
import { unknownType } from "./type/unknown";
import { neverType } from "./type/never";

export const t = {
  never: neverType,
  unknown: unknownType,
  any: unknownType,
  string: stringType,
  number: numberType,
  boolean: booleanType,
  bigint: bigintType,
  symbol: symbolType,
  function: functionType,
  null: nullType,
  undefined: undefinedType,
  void: undefinedType,
  literal: literalType,
  array: arrayType,
  tuple: tupleType,
  set: setType,
  map: mapType,
  object: objectType,
  optional: optionalType,
  nullable: nullableType,
  union: unionType,
  enum: enumType,
  nativeEnum: nativeEnumType,
  nan: nanType,
  infinity: infinityType,
  finite: finiteType,
  integer: integerType,
  int: integerType,
  unsignedInteger: unsignedIntegerType,
  uinteger: unsignedIntegerType,
  uint: unsignedIntegerType,
  unsignedNumber: unsignedNumberType,
  unumber: unsignedNumberType,
  instanceof: instanceofType,
  date: dateType,
  record: recordType,
};
