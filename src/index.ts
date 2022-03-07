import {
  ArrayTypeCheckError,
  LengthMismatchError,
  ObjectTypeCheckError,
  TypeCheckError,
} from "./errors";
import {
  CheckType,
  InferTuple,
  InferType,
  ObjectType,
  Schema,
  Type,
  UnwrapSchema,
  UnwrapTuple,
} from "./types";
import { typeOf } from "./util";

function check<TReturn>(type: CheckType, input: unknown): TReturn {
  if (typeOf(input) === type) {
    return input as TReturn;
  }

  throw new TypeCheckError(type, input);
}

export function unknown(): Type<unknown> {
  return {
    check(input: unknown): unknown {
      return input;
    },
  };
}

export function string(): Type<string> {
  return {
    check(input: unknown): string {
      return check<string>("string", input);
    },
  };
}

export function number(): Type<number> {
  return {
    check(input: unknown): number {
      return check<number>("number", input);
    },
  };
}

export function boolean(): Type<boolean> {
  return {
    check(input: unknown): boolean {
      return check<boolean>("boolean", input);
    },
  };
}

export function bigint(): Type<bigint> {
  return {
    check(input: unknown): bigint {
      return check<bigint>("bigint", input);
    },
  };
}

export function symbol(): Type<symbol> {
  return {
    check(input: unknown): symbol {
      return check<symbol>("symbol", input);
    },
  };
}

export function func(): Type<Function> {
  return {
    check<TType extends Function>(input: TType): TType {
      return check<TType>("function", input);
    },
  };
}

export function nul(): Type<null> {
  return {
    check(input: unknown): null {
      return check<null>("null", input);
    },
  };
}

export function undef(): Type<undefined> {
  return {
    check(input: unknown): undefined {
      return check<undefined>("undefined", input);
    },
  };
}

export function array<TType extends Type<unknown>>(
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

export function tuple<TTypes extends Type<unknown>[]>(
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

export function object<TInputSchema extends Schema>(
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

export function optional<TType extends Type<InferType<TType>>>(
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

export function union<TTypes extends Type<InferTuple<TTypes>>[]>(
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
        throw new Error(
          `expected '${[...expectTypes].join("|")}' got '${typeOf(input)}'`,
        );
      }

      return input as InferTuple<TTypes>;
    },
  };
}
