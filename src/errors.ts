import { typeOf } from "./util";

export class TypeCheckError extends TypeError {
  override name = "TypeCheckError";
  readonly expected: string;
  readonly input: unknown;
  readonly path: string[];

  constructor(expected: string, input: unknown, path: string[] = []) {
    const from = path.length ? ` from '${path.join(".")}'` : "";
    super(`expected '${expected}' got '${typeOf(input)}'${from}`);
    this.expected = expected;
    this.input = input;
    this.path = path;
  }
}
