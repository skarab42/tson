import { ObjectTypeParseError, TypeParseError } from "../errors";
import { ObjectType, Schema, UnwrapSchema } from "../types";
import { helpers } from "../helpers";
import { parse } from "../util";

export function objectType<TInputSchema extends Schema>(
  schema: TInputSchema,
): ObjectType<UnwrapSchema<TInputSchema>> {
  return {
    schema,
    ...helpers(),
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
