import { expect, test } from "vitest";
import { t } from "../src";

test("null() infer", () => {
  const type = t.null();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, null> = true;
  assertType;

  const value = type.parse(null);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("null()", () => {
  expect(t.null().parse(null)).toBe(null);
  expect(() => t.null().parse(0)).toThrow("expected 'null' got 'number'");
  expect(() => t.null().parse(undefined)).toThrow(
    "expected 'null' got 'undefined'",
  );
});
