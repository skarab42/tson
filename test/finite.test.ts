import { expect, test } from "vitest";
import { t } from "../src";

test("finite() infer", () => {
  const type = t.finite();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, number> = true;
  assertType;

  const value = type.parse(42);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
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
