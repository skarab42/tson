import { TypeParseError } from "../errors";
import { Literal, LiteralType } from "../types";
import { helpers } from "../helpers";
import { typeOf } from "../util";
import { stringType } from "./string";
import { numberType } from "./number";
import { booleanType } from "./boolean";
import { bigintType } from "./bigint";
import { symbolType } from "./symbol";
import { nullType } from "./null";
import { undefinedType } from "./undefined";
import { unionType } from "./union";

export function literalType<TType extends Literal>(
  value: TType,
): LiteralType<TType> {
  const schema = unionType([
    stringType(),
    numberType(),
    bigintType(),
    booleanType(),
    symbolType(),
    nullType(),
    undefinedType(),
  ]);

  schema.parse(value);

  return {
    value,
    ...helpers(),
    parse(input: unknown): TType {
      schema.parse(input);

      if (input !== value) {
        throw new TypeParseError(typeOf(value), input);
      }

      return input as TType;
    },
  };
}
