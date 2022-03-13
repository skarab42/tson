import { expect, test } from "vitest";
import { t } from "../src";

// TODO: FIX: type should be Set<number>
// test("set() infer", () => {
//   const type = t.set(t.number());
//   type Type = t.infer<typeof type>;
//   const assertType: t.AssertEqual<Type, Set<number>> = true;
//   assertType;

//   const value = type.parse(new Set([1, 2, 3, 4, 5]));
//   const assertValue: t.AssertEqual<typeof value, Type> = true;
//   assertValue;
// });

test("set() infer tuple", () => {
  const type = t.set(t.number(), t.string(), t.boolean(), t.string());
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<
    Type,
    Set<[number, string, boolean, string]>
  > = true;
  assertType;

  const value = type.parse(new Set([42, "plop", true, "42"]));
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
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
