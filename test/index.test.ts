import { expect, test } from "vitest";
import { t } from "../src";

test("unknown()", () => {
  expect(t.unknown().parse(42)).toBe(42);
});

test("any()", () => {
  expect(t.any().parse(42)).toBe(42);
});

test("never()", () => {
  // @ts-expect-error no parse value
  expect(() => t.never().parse()).toThrow("expected 'never' got 'undefined'");
});

test("string()", () => {
  expect(t.string().parse("42")).toBe("42");
  expect(() => t.string().parse(42)).toThrow("expected 'string' got 'number'");
});

test("number()", () => {
  expect(t.number().parse(42)).toBe(42);
  expect(() => t.number().parse("42")).toThrow(
    "expected 'number' got 'string'",
  );
});

test("bigint()", () => {
  expect(t.bigint().parse(42n)).toBe(42n);
  expect(t.bigint().parse(BigInt(42))).toBe(42n);
  expect(t.bigint().parse(BigInt(42))).toBe(BigInt(42));
  expect(() => t.bigint().parse("42")).toThrow(
    "expected 'bigint' got 'string'",
  );
});

test("symbol()", () => {
  const sym = Symbol(42);
  expect(t.symbol().parse(sym)).toBe(sym);
  expect(() => t.symbol().parse(42)).toThrow("expected 'symbol' got 'number'");
});

test("function()", () => {
  const f = (p: string) => p;
  expect(t.function().parse(f)).toBe(f);
  expect(() => t.function().parse(42)).toThrow(
    "expected 'function' got 'number'",
  );
});

test("null()", () => {
  expect(t.null().parse(null)).toBe(null);
  expect(() => t.null().parse(0)).toThrow("expected 'null' got 'number'");
  expect(() => t.null().parse(undefined)).toThrow(
    "expected 'null' got 'undefined'",
  );
});

test("undefined()", () => {
  // @ts-expect-error no parse value
  expect(t.undefined().parse()).toBe(undefined);
  expect(t.undefined().parse(undefined)).toBe(undefined);
  expect(() => t.undefined().parse(null)).toThrow(
    "expected 'undefined' got 'null'",
  );
  expect(() => t.undefined().parse(0)).toThrow(
    "expected 'undefined' got 'number'",
  );
});

test("void()", () => {
  // @ts-expect-error no parse value
  expect(t.void().parse()).toBe(undefined);
  expect(t.void().parse(undefined)).toBe(undefined);
  expect(() => t.void().parse(null)).toThrow("expected 'undefined' got 'null'");
  expect(() => t.void().parse(0)).toThrow("expected 'undefined' got 'number'");
});

test("boolean()", () => {
  expect(t.boolean().parse(40 + 2 === 42)).toBe(true);
  expect(() => t.boolean().parse(Symbol(42))).toThrow(
    "expected 'boolean' got 'symbol'",
  );
});

test("array()", () => {
  const input = [1, 2, 3, 4, 5];
  const schema = t.array(t.number());
  expect(schema.parse(input)).toBe(input);
  expect(() => schema.parse([...input, "42"])).toThrow(
    "expected 'number' got 'string' at index '5'",
  );
});

test("array() invalid input", () => {
  // @ts-expect-error invalid input
  const schema = t.array(true);
  expect(() => schema.parse(["42"])).toThrow("type.parse is not a function");
});

test("tuple()", () => {
  const input: [number, string, boolean, string] = [42, "plop", true, "42"];
  const schema = t.tuple(t.number(), t.string(), t.boolean(), t.string());
  expect(schema.parse(input)).toBe(input);
  expect(() => schema.parse([42, 24, true, "42"])).toThrow(
    "expected 'string' got 'number' at index '1'",
  );
  expect(() => schema.parse([42, "plop", true, "42", "overflow"])).toThrow(
    "expected length to be '4' got '5'",
  );
  expect(() => schema.parse([42, "plop", true])).toThrow(
    "expected length to be '4' got '3'",
  );
});

test("tuple() invalid input", () => {
  // @ts-expect-error invalid input
  const schema = t.tuple(true);
  expect(() => schema.parse(["42"])).toThrow("type.parse is not a function");
});

test("object()", () => {
  const input = { life: 42, name: "prout" };
  const schema = { life: t.number(), name: t.string() };
  expect(t.object(schema).parse(input)).toBe(input);
  expect(() => t.object(schema).parse(Error)).toThrow(
    "expected 'object' got 'function'",
  );
});

test("object(): with error on first level", () => {
  const input = { life: 42, name: ["prout"] };
  const schema = { life: t.number(), name: t.string() };
  expect(() => t.object(schema).parse(input)).toThrow(
    "expected 'string' got 'array' from 'name'",
  );
});

test("object(): with two levels", () => {
  const input = { life: 42, name: "prout", data: { size: 24, verbose: true } };
  const schema = t.object({
    life: t.number(),
    name: t.string(),
    data: t.object({ size: t.number(), verbose: t.boolean() }),
  });
  expect(schema.parse(input)).toBe(input);
});

test("object(): with error on second level", () => {
  const input = {
    life: 42,
    name: "prout",
    data: { size: 24, verbose: "true" },
  };
  const schema = t.object({
    life: t.number(),
    name: t.string(),
    data: t.object({ size: t.number(), verbose: t.boolean() }),
  });
  expect(() => schema.parse(input)).toThrow(
    "expected 'boolean' got 'string' from 'data.verbose'",
  );
});

test("object(): with invalid input", () => {
  const input = { life: 42, name: ["prout"] };
  // @ts-expect-error input type not assignable
  expect(() => t.object(input).parse(input)).toThrow(
    "val.parse is not a function",
  );
});

test("optional(string())", () => {
  const optional = t.optional(t.string());
  expect(optional.parse("42")).toBe("42");
  expect(optional.parse(undefined)).toBe(undefined);
  expect(() => optional.parse(42)).toThrow("expected 'string' got 'number'");
  expect(() => optional.parse(null)).toThrow("expected 'string' got 'null'");
});

test("union()", () => {
  const str = t.string();
  const num = t.number();
  const boo = t.boolean();
  const uni = t.union([str, num, boo, str]);
  expect(uni.parse(42)).toBe(42);
  expect(uni.parse("42")).toBe("42");
  expect(uni.parse(40 + 2 === 42)).toBe(true);
  expect(() => uni.parse(undefined)).toThrow(
    "expected 'string|number|boolean' got 'undefined'",
  );
  expect(() => uni.parse(null)).toThrow(
    "expected 'string|number|boolean' got 'null'",
  );
});

test("union(): with optional", () => {
  const str = t.string();
  const num = t.number();
  const boo = t.boolean();
  const uni = t.optional(t.union([str, num, boo]));
  expect(uni.parse(undefined)).toBe(undefined);
  expect(() => uni.parse(null)).toThrow(
    "expected 'string|number|boolean' got 'null'",
  );
});

test("union(): with optional in object", () => {
  const str = t.string();
  const num = t.number();
  const boo = t.boolean();
  const obj = t.object({
    name: t.string(),
    desc: t.optional(t.union([str, num, boo])),
  });
  let input: object = { name: "nyan" };
  expect(obj.parse(input)).toBe(input);
  input = { name: "nyan", desc: 42 };
  expect(obj.parse(input)).toBe(input);
  input = { name: "nyan", desc: "42" };
  expect(obj.parse(input)).toBe(input);
  input = { name: "nyan", desc: false };
  expect(obj.parse(input)).toBe(input);
  input = { name: "nyan", desc: Symbol(42) };
  expect(() => obj.parse(input)).toThrow(
    "expected 'string|number|boolean' got 'symbol'",
  );
});

test("union() as optional", () => {
  const optional = t.union([t.string(), t.undefined()]);
  expect(optional.parse("42")).toBe("42");
  expect(optional.parse(undefined)).toBe(undefined);
  expect(() => optional.parse(42)).toThrow(
    "expected 'string|undefined' got 'number'",
  );
  expect(() => optional.parse(null)).toThrow(
    "expected 'string|undefined' got 'null'",
  );
});

test("literal(boolean)", () => {
  const literal = t.literal(true);
  expect(literal.parse(true)).toBe(true);
  expect(() => literal.parse(null)).toThrow("expected 'boolean' got 'null'");
});

test("literal(string)", () => {
  const literal = t.literal("42");
  expect(literal.parse("42")).toBe("42");
  expect(() => literal.parse(true)).toThrow("expected 'string' got 'boolean'");
});

test("literal(number)", () => {
  const literal = t.literal(42);
  expect(literal.parse(42)).toBe(42);
  expect(() => literal.parse("42")).toThrow("expected 'number' got 'string'");
});

test("literal(bigint)", () => {
  const literal = t.literal(BigInt(42));
  expect(literal.parse(42n)).toBe(42n);
  expect(() => literal.parse(null)).toThrow("expected 'bigint' got 'null'");
});

test("literal(symbol)", () => {
  const life = Symbol(42);
  const literal = t.literal(life);
  expect(literal.parse(life)).toBe(life);
  expect(() => literal.parse(42n)).toThrow("expected 'symbol' got 'bigint'");
});

test("literal(null)", () => {
  const literal = t.literal(null);
  expect(literal.parse(null)).toBe(null);
  expect(() => literal.parse(0)).toThrow("expected 'null' got 'number'");
});

test("literal(undefined)", () => {
  const literal = t.literal(undefined);
  expect(literal.parse(undefined)).toBe(undefined);
  expect(() => literal.parse(null)).toThrow("expected 'undefined' got 'null'");
});

test("literal(...) invalid value", () => {
  // @ts-expect-error invalid value
  expect(() => t.literal([42])).toThrow(
    "expected 'string|number|bigint|boolean|symbol|null|undefined' got 'array'",
  );
});
