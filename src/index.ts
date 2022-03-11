import {
  ArrayTypeParseError,
  LengthMismatchError,
  ObjectTypeParseError,
  TypeParseError,
} from "./errors";
import {
  ClassLike,
  EnumKey,
  EnumLike,
  EnumOrFirstValue,
  EnumType,
  EnumValues,
  FakeEnum,
  InferTuple,
  InferType,
  Literal,
  LiteralType,
  ObjectType,
  Schema,
  Type,
  Unwrap,
  UnwrapSchema,
  UnwrapTuple,
  Writable,
} from "./types";
import { instanceOf, parse, typeOf } from "./util";

function neverType(): Type<never> {
  return {
    parse(input: unknown): never {
      throw new TypeParseError("never", input);
    },
  };
}

function unknownType(): Type<unknown> {
  return {
    parse(input: unknown): unknown {
      return input;
    },
  };
}

function stringType(): Type<string> {
  return {
    parse(input: unknown): string {
      return parse<string>("string", input);
    },
  };
}

function numberType(): Type<number> {
  return {
    parse(input: unknown): number {
      return parse<number>("number", input);
    },
  };
}

function booleanType(): Type<boolean> {
  return {
    parse(input: unknown): boolean {
      return parse<boolean>("boolean", input);
    },
  };
}

function bigintType(): Type<bigint> {
  return {
    parse(input: unknown): bigint {
      return parse<bigint>("bigint", input);
    },
  };
}

function symbolType(): Type<symbol> {
  return {
    parse(input: unknown): symbol {
      return parse<symbol>("symbol", input);
    },
  };
}

function functionType(): Type<Function> {
  return {
    parse<TType extends Function>(input: TType): TType {
      return parse<TType>("function", input);
    },
  };
}

function nullType(): Type<null> {
  return {
    parse(input: unknown): null {
      return parse<null>("null", input);
    },
  };
}

function undefinedType(): Type<undefined> {
  return {
    parse(input: unknown): undefined {
      return parse<undefined>("undefined", input);
    },
  };
}

function arrayType<TType extends Type<unknown>>(
  type: TType,
): Type<InferType<TType>[]> {
  return {
    parse(input: unknown[]): InferType<TType>[] {
      parse<InferType<TType>[]>("array", input);

      let lastId = 0;

      try {
        input.forEach((value, id) => {
          lastId = id;
          type.parse(value);
        });
      } catch (error) {
        if (error instanceof TypeParseError) {
          const path = [lastId.toString(), ...error.path];
          throw new ArrayTypeParseError(error.expected, error.input, path);
        }

        throw error;
      }

      return input as InferType<TType>[];
    },
  };
}

function tupleType<
  TKey extends Type<unknown>,
  TTypes extends readonly [TKey, ...TKey[]],
>(types: TTypes): Type<UnwrapTuple<Writable<TTypes>>>;

function tupleType<TTypes extends Type<unknown>[]>(
  ...types: TTypes
): Type<UnwrapTuple<TTypes>>;

function tupleType<
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

function objectType<TInputSchema extends Schema>(
  schema: TInputSchema,
): ObjectType<UnwrapSchema<TInputSchema>> {
  return {
    schema,
    parse(input: unknown): UnwrapSchema<TInputSchema> {
      let lastParsedKey = "?";

      try {
        const output = parse<UnwrapSchema<TInputSchema>>("object", input);

        Object.entries(schema).forEach(([key, val]) => {
          lastParsedKey = key;
          val.parse((input as TInputSchema)[key]);
        });

        return output;
      } catch (error) {
        if (error instanceof TypeParseError) {
          const path = [lastParsedKey, ...error.path];
          throw new ObjectTypeParseError(error.expected, error.input, path);
        }

        throw error;
      }
    },
  };
}

function optionalType<TType extends Type<InferType<TType>>>(
  type: TType,
): Type<InferType<TType> | undefined> {
  return {
    ...type,
    parse(input: unknown): InferType<TType> | undefined {
      if (typeof input === "undefined") {
        return undefined;
      }

      try {
        return type.parse(input);
      } catch (error) {
        if (error instanceof TypeParseError) {
          throw new TypeParseError(`${error.expected}|undefined`, input);
        }

        throw error;
      }
    },
  };
}

function nullableType<TType extends Type<InferType<TType>>>(
  type: TType,
): Type<InferType<TType> | null> {
  return {
    ...type,
    parse(input: unknown): InferType<TType> | null {
      if (input === null) {
        return null;
      }

      try {
        return type.parse(input);
      } catch (error) {
        if (error instanceof TypeParseError) {
          throw new TypeParseError(`${error.expected}|null`, input);
        }

        throw error;
      }
    },
  };
}

function unionType<TTypes extends Type<InferTuple<TTypes>>[]>(
  types: TTypes,
): Type<InferTuple<TTypes>> {
  return {
    parse(input: unknown): InferTuple<TTypes> {
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

      return input as InferTuple<TTypes>;
    },
  };
}

function enumType<
  TKey extends string,
  TValues extends [TKey, ...TKey[]],
  TUnion = TValues[number],
>(values: TValues): EnumType<FakeEnum<TValues>, TValues, TUnion>;

function enumType<
  TKey extends string,
  TValues extends Readonly<[TKey, ...TKey[]]>,
  TUnion = TValues[number],
>(values: TValues): EnumType<FakeEnum<TValues>, TValues, TUnion>;

function enumType<TValues extends EnumValues, TUnion = TValues[number]>(
  ...values: TValues
): EnumType<FakeEnum<TValues>, TValues, TUnion>;

function enumType<
  Key extends string,
  Value extends EnumKey,
  TEnum extends Record<Key, Value>,
  TUnion = TEnum[keyof TEnum],
>(anEnum: TEnum): EnumType<Unwrap<TEnum>, TEnum, TUnion>;

function enumType<
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

function nativeEnumType<
  Key extends string,
  Value extends EnumKey,
  TEnum extends Record<Key, Value>,
  TUnion = TEnum[keyof TEnum],
>(anEnum: TEnum): EnumType<Unwrap<TEnum>, TEnum, TUnion> {
  return enumType(anEnum);
}

function literalType<TType extends Literal>(value: TType): LiteralType<TType> {
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
    parse(input: unknown): TType {
      schema.parse(input);

      if (input !== value) {
        throw new TypeParseError(typeOf(value), input);
      }

      return input as TType;
    },
  };
}

function nanType(): Type<number> {
  return {
    parse(input: unknown): number {
      return parse<number>("NaN", input);
    },
  };
}

function infinityType(): Type<number> {
  return {
    parse(input: unknown): number {
      return parse<number>("Infinity", input);
    },
  };
}

function finiteType(): Type<number> {
  return {
    parse(input: unknown): number {
      if (Number.isFinite(input) === false) {
        throw new TypeParseError("finite number", input);
      }

      return input as number;
    },
  };
}

function integerType(): Type<number> {
  return {
    parse(input: unknown): number {
      if (Number.isInteger(input) === false) {
        throw new TypeParseError("integer", input);
      }

      return input as number;
    },
  };
}

function unsignedIntegerType(): Type<number> {
  return {
    parse(input: unknown): number {
      const value = input as number;

      if (Number.isInteger(value) === false || value < 0) {
        throw new TypeParseError("unsigned integer", input);
      }

      return input as number;
    },
  };
}

function unsignedNumberType(): Type<number> {
  return {
    parse(input: unknown): number {
      const value = input as number;

      if (Number.isFinite(value) === false || value < 0) {
        throw new TypeParseError("unsigned number", input);
      }

      return input as number;
    },
  };
}

function instanceOfType<TType extends ClassLike>(type: TType): Type<TType> {
  return {
    parse(input: unknown): TType {
      return instanceOf<TType>(type, input);
    },
  };
}

function dateType(): Type<DateConstructor | string> {
  return {
    parse(input: unknown): DateConstructor | string {
      if (typeof input === "string") {
        const maybeDate = new Date(input);

        if (Number.isNaN(input) || maybeDate.toString() === "Invalid Date") {
          throw new TypeParseError("Date", input);
        }

        return input;
      }

      return instanceOf<DateConstructor>(Date, input);
    },
  };
}

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
  instanceof: instanceOfType,
  date: dateType,
};
