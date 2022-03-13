import { expect, test } from "vitest";
import { t } from "../src";

test("number() infer", () => {
  const type = t.number();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, number> = true;
  assertType;

  const value = type.parse(42);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("number()", () => {
  expect(t.number().parse(42)).toBe(42);
  expect(() => t.number().parse("42")).toThrow(
    "expected 'number' got 'string'",
  );
});
