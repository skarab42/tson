import { expect, test } from "vitest";
import { t } from "../src";

test("map(type, type) infer", () => {
  const type = t.map(t.string(), t.string());
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, Map<string, string>> = true;
  assertType;

  const value = type.parse(new Map());
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("map(schema) infer", () => {
  const type = t.map({ name: t.string(), size: t.string() });
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, Map<unknown, unknown>> = true;
  assertType;

  const map = new Map();
  map.set("name", "nyan");
  map.set("size", "42");
  const value = type.parse(map);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
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
