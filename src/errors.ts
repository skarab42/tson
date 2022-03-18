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
  readonly expectedKeys: string[];
  readonly receivedKeys: string[];

  constructor(
    expectedKeys: string[],
    receivedKeys: string[],
    input: unknown,
    path: string[],
  ) {
    super("undefined", input, path);

    this.expectedKeys = expectedKeys;
    this.receivedKeys = receivedKeys;

    const expected = expectedKeys.join(",");
    const received = receivedKeys.join(",");
    const location = path.length ? `from '${path.join(".")}'` : "";
    const label =
      expectedKeys.length > receivedKeys.length ? "not enough" : "too many";

    this.message = `${label} keys, expected [${expected}] got [${received}] ${location}`;
  }
}
