import { expect, test } from "vitest";
import { t } from "../src";

test("any() infer", () => {
  const type = t.any();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, unknown> = true;
  assertType;

  const value = type.parse(undefined);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("any()", () => {
  expect(t.any().parse(42)).toBe(42);
});
