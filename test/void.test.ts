import { expect, test } from "vitest";
import { t } from "../src";

test("void() infer", () => {
  const type = t.void();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, undefined> = true;
  assertType;

  const value = type.parse(undefined);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("void()", () => {
  // @ts-expect-error no parse value
  expect(t.void().parse()).toBe(undefined);
  expect(t.void().parse(undefined)).toBe(undefined);
  expect(() => t.void().parse(null)).toThrow("expected 'undefined' got 'null'");
  expect(() => t.void().parse(0)).toThrow("expected 'undefined' got 'number'");
});
