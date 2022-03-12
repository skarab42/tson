import { expect, test } from "vitest";
import { instanceOf } from "../src/util";
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

test("tuple(...type)", () => {
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

test("tuple(type[])", () => {
  const input: [number, string, boolean, string] = [42, "plop", true, "42"];
  const schema = t.tuple([t.number(), t.string(), t.boolean(), t.string()]);
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

test("tuple(type[]) as const", () => {
  const input: [number, string, boolean, string] = [42, "plop", true, "42"];
  const prout = [t.number(), t.string(), t.boolean(), t.string()] as const;
  const schema = t.tuple(prout);
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

test("set(type) number[]", () => {
  const input = new Set([1, 2, 3, 4, 5]);
  const schema = t.set(t.number());
  expect(schema.parse(input)).toBe(input);
  expect(schema.parse(new Set([1, 2, 3, 4])).size).toBe(4);
  expect(schema.parse(new Set([1, 2, 3, 4, 5, 6])).size).toBe(6);
  expect(() => schema.parse(new Set([1, 2, 3, true, 5]))).toThrow(
    "expected 'number' got 'boolean' at index '3'",
  );
});

test("set(...type) tuple", () => {
  const input = new Set([42, "plop", true, "42"]);
  const schema = t.set(t.number(), t.string(), t.boolean(), t.string());
  expect(schema.parse(input)).toBe(input);
  expect(() => schema.parse(new Set([42, 24, true, "42"]))).toThrow(
    "expected 'string' got 'number' at index '1'",
  );
  expect(() =>
    schema.parse(new Set([42, "plop", true, "42", "overflow"])),
  ).toThrow("expected length to be '4' got '5'");
  expect(() => schema.parse(new Set([42, "plop", true]))).toThrow(
    "expected length to be '4' got '3'",
  );
});

test("set([type, ...type]) tuple", () => {
  const input = new Set([42, "plop", true, "42"]);
  const schema = t.set([t.number(), t.string(), t.boolean(), t.string()]);
  expect(schema.parse(input)).toBe(input);
  expect(() => schema.parse(new Set([42, 24, true, "42"]))).toThrow(
    "expected 'string' got 'number' at index '1'",
  );
  expect(() =>
    schema.parse(new Set([42, "plop", true, "42", "overflow"])),
  ).toThrow("expected length to be '4' got '5'");
  expect(() => schema.parse(new Set([42, "plop", true]))).toThrow(
    "expected length to be '4' got '3'",
  );
});

test("set(): with invalid input", () => {
  expect(() => t.set(t.number()).parse(42)).toThrow(
    "expected 'Set' got 'number'",
  );
});

test("map(keyType, valueType)", () => {
  const map = new Map();
  map.set("name", "nyan");
  map.set("size", "42");
  const schema = t.map(t.string(), t.string());
  expect(schema.parse(map)).toBe(map);
  map.set("life", 42);
  expect(() => schema.parse(map)).toThrow(
    "expected value to be 'string' got 'number' from '\"life\"'",
  );
});

test("map(schema)", () => {
  const map = new Map();
  map.set("name", "nyan");
  map.set("size", "42");
  const schema = t.map({ name: t.string(), size: t.string() });
  expect(schema.parse(map)).toBe(map);
  map.set("size", 42);
  expect(() => schema.parse(map)).toThrow(
    "expected 'string' got 'number' from 'size'",
  );
});

test("map(): with invalid input", () => {
  // @ts-expect-error input type not assignable
  expect(() => t.map(null)).toThrow("expected 'object' got 'null'");
  // @ts-expect-error input type not assignable
  expect(() => t.map({}, {}).parse(42)).toThrow("expected 'Map' got 'number'");
  // @ts-expect-error input type not assignable
  expect(() => t.map({}, {}).parse(new Map([["life", "42"]]))).toThrow(
    "keyType.parse is not a function",
  );
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
  expect(() => optional.parse(42)).toThrow(
    "expected 'string|undefined' got 'number'",
  );
  expect(() => optional.parse(null)).toThrow(
    "expected 'string|undefined' got 'null'",
  );
});

test("optional(): with invalid input", () => {
  // @ts-expect-error input type not assignable
  expect(() => t.optional(42).parse(42)).toThrow(
    "type.parse is not a function",
  );
});

test("nullable(string())", () => {
  const nullable = t.nullable(t.string());
  expect(nullable.parse("42")).toBe("42");
  expect(nullable.parse(null)).toBe(null);
  expect(() => nullable.parse([42])).toThrow(
    "expected 'string|null' got 'array'",
  );
  expect(() => nullable.parse(0)).toThrow(
    "expected 'string|null' got 'number'",
  );
});

test("nullable(): with invalid input", () => {
  // @ts-expect-error input type not assignable
  expect(() => t.nullable(42).parse(42)).toThrow(
    "type.parse is not a function",
  );
});

test("union(...type)", () => {
  const str = t.string();
  const num = t.number();
  const boo = t.boolean();
  const uni = t.union(str, num, boo, str);
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

test("union(type[])", () => {
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

test("union(type[]) as const", () => {
  const str = t.string();
  const num = t.number();
  const boo = t.boolean();
  const types = [str, num, boo, str] as const;
  const uni = t.union(types);
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
    "expected 'string|number|boolean|undefined' got 'null'",
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
    "expected 'string|number|boolean|undefined' got 'symbol'",
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

test("nan()", () => {
  expect(t.nan().parse(NaN)).toBe(NaN);
  expect(t.nan().parse(Number("forty-two"))).toBe(NaN);
  expect(() => t.nan().parse(0)).toThrow("expected 'NaN' got 'number'");
  expect(() => t.nan().parse(null)).toThrow("expected 'NaN' got 'null'");
  expect(() => t.nan().parse(Infinity)).toThrow(
    "expected 'NaN' got 'Infinity'",
  );
});

test("infinity()", () => {
  expect(t.infinity().parse(Infinity)).toBe(Infinity);
  expect(t.infinity().parse(-Infinity)).toBe(-Infinity);
  expect(t.infinity().parse(Number.MAX_VALUE * 42)).toBe(Infinity);
  expect(() => t.infinity().parse(0)).toThrow(
    "expected 'Infinity' got 'number'",
  );
  expect(() => t.infinity().parse(null)).toThrow(
    "expected 'Infinity' got 'null'",
  );
});

test("finite()", () => {
  expect(t.finite().parse(0)).toBe(0);
  expect(t.finite().parse(42)).toBe(42);
  expect(t.finite().parse(-42)).toBe(-42);
  expect(t.finite().parse(+42.42)).toBe(+42.42);
  expect(t.finite().parse(-42.42)).toBe(-42.42);
  expect(() => t.finite().parse(42n)).toThrow(
    "expected 'finite number' got 'bigint'",
  );
  expect(() => t.finite().parse(null)).toThrow(
    "expected 'finite number' got 'null'",
  );
  expect(() => t.finite().parse(Infinity)).toThrow(
    "expected 'finite number' got 'Infinity'",
  );
});

test("integer()", () => {
  expect(t.integer().parse(0)).toBe(0);
  expect(t.integer().parse(42)).toBe(42);
  expect(t.integer().parse(-42)).toBe(-42);
  expect(() => t.integer().parse(42n)).toThrow(
    "expected 'integer' got 'bigint'",
  );
  expect(() => t.integer().parse(null)).toThrow(
    "expected 'integer' got 'null'",
  );
  expect(() => t.integer().parse(Infinity)).toThrow(
    "expected 'integer' got 'Infinity'",
  );
});

test("unsignedInteger()", () => {
  expect(t.unsignedInteger().parse(0)).toBe(0);
  expect(t.unsignedInteger().parse(42)).toBe(42);
  expect(() => t.unsignedInteger().parse(-42)).toThrow(
    "expected 'unsigned integer' got 'number'",
  );
  expect(() => t.unsignedInteger().parse(0.1)).toThrow(
    "expected 'unsigned integer' got 'number'",
  );
  expect(() => t.unsignedInteger().parse(42n)).toThrow(
    "expected 'unsigned integer' got 'bigint'",
  );
  expect(() => t.unsignedInteger().parse(null)).toThrow(
    "expected 'unsigned integer' got 'null'",
  );
  expect(() => t.unsignedInteger().parse(Infinity)).toThrow(
    "expected 'unsigned integer' got 'Infinity'",
  );
});

test("unsignedNumber()", () => {
  expect(t.unsignedNumber().parse(0)).toBe(0);
  expect(t.unsignedNumber().parse(42)).toBe(42);
  expect(t.unsignedNumber().parse(0.1)).toBe(0.1);
  expect(t.unsignedNumber().parse(42.42)).toBe(42.42);
  expect(() => t.unsignedNumber().parse(-42)).toThrow(
    "expected 'unsigned number' got 'number'",
  );
  expect(() => t.unsignedNumber().parse(42n)).toThrow(
    "expected 'unsigned number' got 'bigint'",
  );
  expect(() => t.unsignedNumber().parse(null)).toThrow(
    "expected 'unsigned number' got 'null'",
  );
  expect(() => t.unsignedNumber().parse(Infinity)).toThrow(
    "expected 'unsigned number' got 'Infinity'",
  );
});

test("instanceOf()", () => {
  class MyClass {}
  const instance = new MyClass();
  expect(instanceOf(MyClass, instance)).toBe(instance);
  expect(() => instanceOf(MyClass, new Date())).toThrow(
    "expected 'MyClass' got 'object'",
  );
});

test("instanceof()", () => {
  class MyClass {}
  const instance = new MyClass();
  expect(t.instanceof(MyClass).parse(instance)).toBe(instance);
  expect(() => t.instanceof(MyClass).parse(new Date())).toThrow(
    "expected 'MyClass' got 'object'",
  );
});

test("date() Date", () => {
  const date = new Date();
  expect(t.date().parse(date)).toBe(date);
  expect(() => t.date().parse(Date)).toThrow("expected 'Date' got 'function'");
  expect(() => t.date().parse(Date.now())).toThrow(
    "expected 'Date' got 'number'",
  );
});

test("date() string", () => {
  const date = "2022-03-11T09:28:00.575Z";
  expect(t.date().parse(date)).toBe(date);
  expect(() => t.date().parse("Date")).toThrow("expected 'Date' got 'string'");
  expect(() => t.date().parse(Date.now())).toThrow(
    "expected 'Date' got 'number'",
  );
});

test("record() string", () => {
  const record = { name: "nyan" };
  expect(t.record(t.string()).parse(record)).toBe(record);
  expect(() => t.record(t.string()).parse({ name: 42 })).toThrow(
    "expected 'string' got 'number' from 'name'",
  );
  expect(() => t.record(t.string()).parse(42)).toThrow(
    "expected 'object' got 'number'",
  );
});

test("record() number", () => {
  const record = { name: 42 };
  expect(t.record(t.number()).parse(record)).toBe(record);
  expect(() => t.record(t.number()).parse({ name: "42" })).toThrow(
    "expected 'number' got 'string' from 'name'",
  );
  expect(() => t.record(t.number()).parse(42)).toThrow(
    "expected 'object' got 'number'",
  );
});

test("record() date", () => {
  const date = { a: new Date(), b: new Date() };
  expect(t.record(t.date()).parse(date)).toBe(date);
  expect(() => t.record(t.date()).parse({ a: new Date(), b: 42 })).toThrow(
    "expected 'Date' got 'number' from 'b'",
  );
  expect(() => t.record(t.date()).parse(null)).toThrow(
    "expected 'object' got 'null'",
  );
  expect(() => t.record(t.date()).parse(42)).toThrow(
    "expected 'object' got 'number'",
  );
});

test("record() invalid input", () => {
  // @ts-expect-error invalid type
  expect(() => t.record(null)).toThrow("expected 'object' got 'null'");
});
