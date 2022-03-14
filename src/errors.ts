import { MapErrorLocation } from "./types";
import { typeOf } from "./util";

export class LengthMismatchError extends TypeError {
  override name = "LengthMismatchError";
  readonly expected: number;
  readonly input: number;

  constructor(expected: number, input: number) {
    super(`expected length to be '${expected}' got '${input}'`);
    this.expected = expected;
    this.input = input;
  }
}

export class TypeParseError extends TypeError {
  override name = "TypeParseError";
  readonly expected: string;
  readonly input: unknown;
  readonly path: string[];

  constructor(expected: string, input: unknown, path: string[] = []) {
    super(`expected '${expected}' got '${typeOf(input)}'`);
    this.expected = expected;
    this.input = input;
    this.path = path;
  }
}

export class ObjectTypeParseError extends TypeParseError {
  override name = "ObjectTypeParseError";

  constructor(expected: string, input: unknown, path: string[]) {
    super(expected, input, path);
    this.message += ` from '${path.join(".")}'`;
  }
}

export class ArrayTypeParseError extends TypeParseError {
  override name = "ArrayTypeParseError";

  constructor(expected: string, input: unknown, path: string[]) {
    super(expected, input, path);
    this.message += ` at index '${path.join(".")}'`;
  }
}

export class MapTypeParseError extends TypeParseError {
  override name = "MapTypeParseError";
  readonly location: MapErrorLocation;

  constructor(
    keyOrValue: MapErrorLocation,
    expected: string,
    input: unknown,
    path: string[],
  ) {
    super(expected, input, path);
    this.location = keyOrValue;
    const type = typeOf(input);
    const location = path.join(".");
    this.message = `expected ${keyOrValue} to be '${expected}' got '${type}' from '${location}'`;
  }
}

export class UnexpectedKeysError extends TypeParseError {
  override name = "UnexpectedKeysError";
  readonly keys: string[];

  constructor(
    keys: string[],
    expected: string,
    input: unknown,
    path: string[],
  ) {
    super(expected, input, path);
    this.keys = keys;
    const location = path.join(".");
    this.message = `unexpected keys '${keys.join(",")}' after '${location}'`;
  }
}
