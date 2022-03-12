import { expect, test } from "vitest";
import { t } from "../src";

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
