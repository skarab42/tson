import { expect, test } from "vitest";
import { t } from "../src";

test("unknown()", () => {
  expect(t.unknown().check(42)).toBe(42);
});

test("string()", () => {
  expect(t.string().check("42")).toBe("42");
  expect(() => t.string().check(42)).toThrow("expected 'string' got 'number'");
});

test("number()", () => {
  expect(t.number().check(42)).toBe(42);
  expect(() => t.number().check("42")).toThrow(
    "expected 'number' got 'string'",
  );
});

test("bigint()", () => {
  expect(t.bigint().check(42n)).toBe(42n);
  expect(t.bigint().check(BigInt(42))).toBe(42n);
  expect(t.bigint().check(BigInt(42))).toBe(BigInt(42));
  expect(() => t.bigint().check("42")).toThrow(
    "expected 'bigint' got 'string'",
  );
});

test("symbol()", () => {
  const sym = Symbol(42);
  expect(t.symbol().check(sym)).toBe(sym);
  expect(() => t.symbol().check(42)).toThrow("expected 'symbol' got 'number'");
});

test("func()", () => {
  const f = (p: string) => p;
  expect(t.function().check(f)).toBe(f);
  expect(() => t.function().check(42)).toThrow(
    "expected 'function' got 'number'",
  );
});

test("nul()", () => {
  expect(t.null().check(null)).toBe(null);
  expect(() => t.null().check(0)).toThrow("expected 'null' got 'number'");
  expect(() => t.null().check(undefined)).toThrow(
    "expected 'null' got 'undefined'",
  );
});

test("undef()", () => {
  expect(t.undefined().check(undefined)).toBe(undefined);
  expect(() => t.undefined().check(null)).toThrow(
    "expected 'undefined' got 'null'",
  );
  expect(() => t.undefined().check(0)).toThrow(
    "expected 'undefined' got 'number'",
  );
});

test("boolean()", () => {
  expect(t.boolean().check(40 + 2 === 42)).toBe(true);
  expect(() => t.boolean().check(Symbol(42))).toThrow(
    "expected 'boolean' got 'symbol'",
  );
});

test("array()", () => {
  const input = [1, 2, 3, 4, 5];
  const schema = t.array(t.number());
  expect(schema.check(input)).toBe(input);
  expect(() => schema.check([...input, "42"])).toThrow(
    "expected 'number' got 'string' at index '5'",
  );
});

test("tuple()", () => {
  const input: [number, string, boolean, string] = [42, "plop", true, "42"];
  const schema = t.tuple(t.number(), t.string(), t.boolean(), t.string());
  expect(schema.check(input)).toBe(input);
  expect(() => schema.check([42, 24, true, "42"])).toThrow(
    "expected 'string' got 'number' at index '1'",
  );
  expect(() => schema.check([42, "plop", true, "42", "overflow"])).toThrow(
    "expected length to be '4' got '5'",
  );
  expect(() => schema.check([42, "plop", true])).toThrow(
    "expected length to be '4' got '3'",
  );
});

test("object()", () => {
  const input = { life: 42, name: "prout" };
  const schema = { life: t.number(), name: t.string() };
  expect(t.object(schema).check(input)).toBe(input);
  expect(() => t.object(schema).check(Error)).toThrow(
    "expected 'object' got 'function'",
  );
});

test("object(): with error on first level", () => {
  const input = { life: 42, name: ["prout"] };
  const schema = { life: t.number(), name: t.string() };
  expect(() => t.object(schema).check(input)).toThrow(
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
  expect(schema.check(input)).toBe(input);
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
  expect(() => schema.check(input)).toThrow(
    "expected 'boolean' got 'string' from 'data.verbose'",
  );
});

test("object(): with invalid input", () => {
  const input = { life: 42, name: ["prout"] };
  // @ts-expect-error input type not assignable
  expect(() => t.object(input).check(input)).toThrow(
    "val.check is not a function",
  );
});

test("optional(string())", () => {
  const optional = t.optional(t.string());
  expect(optional.check("42")).toBe("42");
  expect(optional.check(undefined)).toBe(undefined);
  expect(() => optional.check(42)).toThrow("expected 'string' got 'number'");
  expect(() => optional.check(null)).toThrow("expected 'string' got 'null'");
});

test("union()", () => {
  const str = t.string();
  const num = t.number();
  const boo = t.boolean();
  const uni = t.union([str, num, boo, str]);
  expect(uni.check(42)).toBe(42);
  expect(uni.check("42")).toBe("42");
  expect(uni.check(40 + 2 === 42)).toBe(true);
  expect(() => uni.check(undefined)).toThrow(
    "expected 'string|number|boolean' got 'undefined'",
  );
  expect(() => uni.check(null)).toThrow(
    "expected 'string|number|boolean' got 'null'",
  );
});

test("union(): with optional", () => {
  const str = t.string();
  const num = t.number();
  const boo = t.boolean();
  const uni = t.optional(t.union([str, num, boo]));
  expect(uni.check(undefined)).toBe(undefined);
  expect(() => uni.check(null)).toThrow(
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
  expect(obj.check(input)).toBe(input);
  input = { name: "nyan", desc: 42 };
  expect(obj.check(input)).toBe(input);
  input = { name: "nyan", desc: "42" };
  expect(obj.check(input)).toBe(input);
  input = { name: "nyan", desc: false };
  expect(obj.check(input)).toBe(input);
  input = { name: "nyan", desc: Symbol(42) };
  expect(() => obj.check(input)).toThrow(
    "expected 'string|number|boolean' got 'symbol'",
  );
});

test("union() as optional", () => {
  const optional = t.union([t.string(), t.undefined()]);
  expect(optional.check("42")).toBe("42");
  expect(optional.check(undefined)).toBe(undefined);
  expect(() => optional.check(42)).toThrow(
    "expected 'string|undefined' got 'number'",
  );
  expect(() => optional.check(null)).toThrow(
    "expected 'string|undefined' got 'null'",
  );
});
