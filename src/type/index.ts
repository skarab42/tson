export { arrayType as array } from "./array";
export { bigintType as bigint } from "./bigint";
export { booleanType as boolean } from "./boolean";
export { dateType as date } from "./date";
export { enumType as enum } from "./enum";
export { finiteType as finite } from "./finite";
export { infinityType as infinity } from "./infinity";
export { functionType as function } from "./function";
export { instanceofType as instanceof } from "./instanceof";
export { integerType as integer } from "./integer";
export { literalType as literal } from "./literal";
export { mapType as map } from "./map";
export { nanType as nan } from "./nan";
export { nativeEnumType as nativeEnum } from "./nativeEnum";
export { neverType as never } from "./never";
export { nullType as null } from "./null";
export { nullableType as nullable } from "./nullable";
export { numberType as number } from "./number";
export { objectType as object } from "./object";
export { optionalType as optional } from "./optional";
export { postprocessType as postprocess } from "./postprocess";
export { preprocessType as preprocess } from "./preprocess";
export { promiseType as promise } from "./promise";
export { recordType as record } from "./record";
export { setType as set } from "./set";
export { stringType as string } from "./string";
export { symbolType as symbol } from "./symbol";
export { tupleType as tuple } from "./tuple";
export { undefinedType as undefined } from "./undefined";
export { unionType as union } from "./union";
export { unknownType as unknown } from "./unknown";
export { unsignedIntegerType as unsignedInteger } from "./unsignedInteger";
export { unsignedNumberType as unsignedNumber } from "./unsignedNumber";

// Alias
import { integerType } from "./integer";
import { undefinedType } from "./undefined";
import { unknownType } from "./unknown";
import { unsignedIntegerType } from "./unsignedInteger";
import { unsignedNumberType } from "./unsignedNumber";

export {
  integerType as int,
  undefinedType as void,
  unknownType as any,
  unsignedIntegerType as uinteger,
  unsignedIntegerType as uint,
  unsignedNumberType as unumber,
};
