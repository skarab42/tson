import { expect, test } from "vitest";
import { t } from "../src";

test("infinity() infer", () => {
  const type = t.infinity();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, number> = true;
  assertType;

  const value = type.parse(Infinity);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
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
