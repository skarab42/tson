import { expect, test } from "vitest";
import { t } from "../src";

test("unknown() infer", () => {
  const type = t.unknown();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, unknown> = true;
  assertType;

  const value = type.parse(undefined);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("unknown()", () => {
  expect(t.unknown().parse(42)).toBe(42);
});
