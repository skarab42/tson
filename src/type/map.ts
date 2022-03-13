import { InferType, MapErrorLocation, MapParser, Schema, Type } from "../types";
import { MapTypeParseError, TypeParseError } from "../errors";
import { helpers } from "../helpers";
import { parse } from "../util";
import { objectType } from "./object";

function parseMapAsObject(schema: Schema): MapParser {
  return (map: Map<unknown, unknown>) => {
    objectType(schema).parse(Object.fromEntries(map));

    return map;
  };
}
function parseMap(valueType: Type<unknown>, keyType: Type<unknown>): MapParser {
  return (map: Map<unknown, unknown>) => {
    let location: MapErrorLocation = "key";
    let jsonKey = "?";

    try {
      map.forEach((value, key) => {
        jsonKey = JSON.stringify(key);
        location = "key";
        keyType.parse(key);
        location = "value";
        valueType.parse(value);
      });

      return map;
    } catch (error) {
      if (error instanceof TypeParseError) {
        throw new MapTypeParseError(location, error.expected, error.input, [
          jsonKey,
        ]);
      }

      throw error;
    }
  };
}
export function mapType<
  TKey extends Type<unknown>,
  TValue extends Type<unknown>,
>(
  keyType: TKey,
  valueType: TValue,
): Type<Map<InferType<TKey>, InferType<TValue>>>;
export function mapType<TSchema extends Schema>(
  schema: TSchema,
): Type<Map<unknown, unknown>>;
export function mapType<
  TSchemaOrKeyType extends Schema | Type<unknown>,
  TValue extends Type<unknown>,
>(schemaOrKeyType: TSchemaOrKeyType, valueType?: TValue) {
  let mapParser: MapParser;

  if (typeof valueType === "undefined") {
    mapParser = parseMapAsObject(parse<Schema>("object", schemaOrKeyType));
  } else {
    mapParser = parseMap(
      parse<Type<unknown>>("object", schemaOrKeyType),
      parse<Type<unknown>>("object", valueType),
    );
  }

  return {
    ...helpers(),
    parse(input: unknown) {
      if (input instanceof Map) {
        return mapParser(input);
      }

      throw new TypeParseError("Map", input);
    },
  };
}
