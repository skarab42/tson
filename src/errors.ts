import { typeOf } from "./util";

export class LengthMismatchError extends TypeError {
  override name = "LengthMismatchError ";
  readonly expected: number;
  readonly input: number;

  constructor(expected: number, input: number) {
    super(`expected length to be '${expected}' got '${input}'`);
    this.expected = expected;
    this.input = input;
  }
}

export class TypeCheckError extends TypeError {
  override name = "TypeCheckError";
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

export class ObjectTypeCheckError extends TypeCheckError {
  override name = "ObjectTypeCheckError";

  constructor(expected: string, input: unknown, path: string[]) {
    super(expected, input, path);
    this.message += ` from '${path.join(".")}'`;
  }
}

export class ArrayTypeCheckError extends TypeCheckError {
  override name = "ArrayTypeCheckError";

  constructor(expected: string, input: unknown, path: string[]) {
    super(expected, input, path);
    this.message += ` at index '${path.join(".")}'`;
  }
}
