import { expect, test } from "vitest";
import { t } from "../src";

test("boolean() infer", () => {
  const type = t.boolean();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, boolean> = true;
  assertType;

  const value = type.parse(true);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("boolean()", () => {
  expect(t.boolean().parse(40 + 2 === 42)).toBe(true);
  expect(() => t.boolean().parse(Symbol(42))).toThrow(
    "expected 'boolean' got 'symbol'",
  );
});
