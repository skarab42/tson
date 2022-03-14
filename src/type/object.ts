import {
  ObjectTypeParseError,
  TypeParseError,
  UnexpectedKeysError,
} from "../errors";
import { ObjectType, ObjectTypeMode, Schema, UnwrapSchema } from "../types";
import { helpers } from "../helpers";
import { defaultSettings, parse } from "../util";

export function objectType<TInputSchema extends Schema>(
  schema: TInputSchema,
  mode: ObjectTypeMode = defaultSettings.objectTypeMode,
): ObjectType<UnwrapSchema<TInputSchema>> {
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
      let lastParsedKey = "?";

      try {
        const output = parse<UnwrapSchema<TInputSchema>>("object", input);
        const reducedOutput = { ...(output as Record<string, unknown>) };
        const stripedOutput: Record<string, unknown> = {};

        Object.entries(schema).forEach(([key, val]) => {
          lastParsedKey = key;
          val.parse((input as TInputSchema)[key]);
          stripedOutput[key] = (input as TInputSchema)[key];
          delete reducedOutput[key];
        });

        if (mode === ObjectTypeMode.STRICT) {
          const unknownKeys = Object.keys(reducedOutput);

          if (unknownKeys.length > 0) {
            throw new UnexpectedKeysError(unknownKeys, "", input, []);
          }
        } else if (mode === ObjectTypeMode.STRIP) {
          return stripedOutput as UnwrapSchema<TInputSchema>;
        }

        return output;
      } catch (error) {
        if (error instanceof UnexpectedKeysError) {
          const path = [lastParsedKey, ...error.path];
          throw new UnexpectedKeysError(
            error.keys,
            error.expected,
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
