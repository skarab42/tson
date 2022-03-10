import {
  ArrayTypeCheckError,
  LengthMismatchError,
  ObjectTypeCheckError,
  TypeCheckError,
} from "./errors";
import {
  EnumKey,
  EnumLike,
  EnumOrFirstValue,
  EnumType,
  EnumValues,
  FakeEnum,
  InferTuple,
  InferType,
  ObjectType,
  Schema,
  Type,
  Unwrap,
  UnwrapSchema,
  UnwrapTuple,
} from "./types";
import { check } from "./util";

function unknownType(): Type<unknown> {
  return {
    check(input: unknown): unknown {
      return input;
    },
  };
}

function stringType(): Type<string> {
  return {
    check(input: unknown): string {
      return check<string>("string", input);
    },
  };
}

function numberType(): Type<number> {
  return {
    check(input: unknown): number {
      return check<number>("number", input);
    },
  };
}

function booleanType(): Type<boolean> {
  return {
    check(input: unknown): boolean {
      return check<boolean>("boolean", input);
    },
  };
}

function bigintType(): Type<bigint> {
  return {
    check(input: unknown): bigint {
      return check<bigint>("bigint", input);
    },
  };
}

function symbolType(): Type<symbol> {
  return {
    check(input: unknown): symbol {
      return check<symbol>("symbol", input);
    },
  };
}

function functionType(): Type<Function> {
  return {
    check<TType extends Function>(input: TType): TType {
      return check<TType>("function", input);
    },
  };
}

function nullType(): Type<null> {
  return {
    check(input: unknown): null {
      return check<null>("null", input);
    },
  };
}

function undefinedType(): Type<undefined> {
  return {
    check(input: unknown): undefined {
      return check<undefined>("undefined", input);
    },
  };
}

function arrayType<TType extends Type<unknown>>(
  type: TType,
): Type<InferType<TType>[]> {
  return {
    check(input: unknown[]): InferType<TType>[] {
      check<InferType<TType>[]>("array", input);

      let lastId = 0;

      try {
        input.forEach((value, id) => {
          lastId = id;
          type.check(value);
        });
      } catch (error) {
        if (error instanceof TypeCheckError) {
          const path = [lastId.toString(), ...error.path];
          throw new ArrayTypeCheckError(error.expected, error.input, path);
        }

        throw error;
      }

      return input as InferType<TType>[];
    },
  };
}

function tupleType<TTypes extends Type<unknown>[]>(
  ...types: TTypes
): Type<UnwrapTuple<TTypes>> {
  return {
    check(input: unknown[]): UnwrapTuple<TTypes> {
      check<UnwrapTuple<TTypes>>("array", input);

      if (types.length !== input.length) {
        throw new LengthMismatchError(types.length, input.length);
      }

      let lastId = 0;

      try {
        types.forEach((type, index) => {
          lastId = index;
          type.check(input[index]);
        });
      } catch (error) {
        if (error instanceof TypeCheckError) {
          const path = [lastId.toString(), ...error.path];
          throw new ArrayTypeCheckError(error.expected, error.input, path);
        }

        throw error;
      }

      return input as UnwrapTuple<TTypes>;
    },
  };
}

function objectType<TInputSchema extends Schema>(
  schema: TInputSchema,
): ObjectType<UnwrapSchema<TInputSchema>> {
  return {
    schema,
    check(input: unknown): UnwrapSchema<TInputSchema> {
      let lastCheckedKey = "?";

      try {
        const output = check<UnwrapSchema<TInputSchema>>("object", input);

        Object.entries(schema).forEach(([key, val]) => {
          lastCheckedKey = key;
          val.check((input as TInputSchema)[key]);
        });

        return output;
      } catch (error) {
        if (error instanceof TypeCheckError) {
          const path = [lastCheckedKey, ...error.path];
          throw new ObjectTypeCheckError(error.expected, error.input, path);
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
    check(input: unknown): InferType<TType> | undefined {
      if (typeof input === "undefined") {
        return undefined;
      }

      return type.check(input);
    },
  };
}

function unionType<TTypes extends Type<InferTuple<TTypes>>[]>(
  types: TTypes,
): Type<InferTuple<TTypes>> {
  return {
    check(input: unknown): InferTuple<TTypes> {
      const expectTypes: Set<string> = new Set();
      let errorCount = 0;

      types.forEach((type) => {
        try {
          type.check(input);
        } catch (error) {
          if (error instanceof TypeCheckError) {
            expectTypes.add(error.expected);
          }
          errorCount++;
        }
      });

      if (errorCount === types.length) {
        throw new TypeCheckError([...expectTypes].join("|"), input);
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
    throw new TypeCheckError("enum", enumOrFirstValue); // TODO better error
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
    check(input: unknown) {
      const value = schema.check(input);

      if (values.includes(value) === false) {
        throw new TypeCheckError(values.join("|"), input);
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

export const t = {
  unknown: unknownType,
  string: stringType,
  number: numberType,
  boolean: booleanType,
  bigint: bigintType,
  symbol: symbolType,
  function: functionType,
  null: nullType,
  undefined: undefinedType,
  array: arrayType,
  tuple: tupleType,
  object: objectType,
  optional: optionalType,
  union: unionType,
  enum: enumType,
  nativeEnum: nativeEnumType,
};
