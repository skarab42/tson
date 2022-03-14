import {
  ObjectTypeParseError,
  UnexpectedKeysError,
  TypeParseError,
} from "../errors";
import { ObjectType, ObjectTypeMode, Schema, UnwrapSchema } from "../types";
import { helpers } from "../helpers";
import { defaultSettings, parse } from "../util";

export function objectType<TInputSchema extends Schema>(
  schema: TInputSchema,
  mode: ObjectTypeMode = defaultSettings.objectTypeMode,
): ObjectType<UnwrapSchema<TInputSchema>> {
  const schemaPropertyNames = Object.getOwnPropertyNames(schema);
  let lastParsedKey = "?";

  return {
    schema,
    ...helpers(),
    strict() {
      return objectType(schema, ObjectTypeMode.STRICT);
    },
    strip() {
      return objectType(schema, ObjectTypeMode.STRIP);
    },
    passthrough() {
      return objectType(schema, ObjectTypeMode.PASSTHROUGH);
    },
    parse(input: unknown): UnwrapSchema<TInputSchema> {
      parse<UnwrapSchema<TInputSchema>>("object", input);

      const inputPropertyNames = Object.getOwnPropertyNames(input);

      if (
        mode === ObjectTypeMode.STRICT &&
        schemaPropertyNames.length !== inputPropertyNames.length
      ) {
        throw new UnexpectedKeysError(
          schemaPropertyNames,
          inputPropertyNames,
          input,
          [],
        );
      }

      try {
        const output = { ...(input as Record<string, unknown>) };

        Object.entries(schema).forEach(([key, val]) => {
          lastParsedKey = key;
          output[key] = val.parse(output[key]);
        });

        if (mode === ObjectTypeMode.STRIP) {
          inputPropertyNames
            .filter((x) => !schemaPropertyNames.includes(x))
            .forEach((key) => delete output[key]);
        }

        return output as UnwrapSchema<TInputSchema>;
      } catch (error) {
        if (error instanceof UnexpectedKeysError) {
          const path = [lastParsedKey, ...error.path];
          throw new UnexpectedKeysError(
            error.expectedKeys,
            error.receivedKeys,
            error.input,
            path,
          );
        }

        if (error instanceof TypeParseError) {
          const path = [lastParsedKey, ...error.path];
          throw new ObjectTypeParseError(error.expected, error.input, path);
        }

        throw error;
      }
    },
  };
}
