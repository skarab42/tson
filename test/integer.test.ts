import { expect, test } from "vitest";
import { t } from "../src";

test("integer() infer", () => {
  const type = t.integer();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, number> = true;
  assertType;

  const value = type.parse(42);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
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
