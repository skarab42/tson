import { expect, test } from "vitest";
import { t } from "../src";

test("undefined() infer", () => {
  const type = t.undefined();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, undefined> = true;
  assertType;

  const value = type.parse(undefined);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("undefined()", () => {
  // @ts-expect-error no parse value
  expect(t.undefined().parse()).toBe(undefined);
  expect(t.undefined().parse(undefined)).toBe(undefined);
  expect(() => t.undefined().parse(null)).toThrow(
    "expected 'undefined' got 'null'",
  );
  expect(() => t.undefined().parse(0)).toThrow(
    "expected 'undefined' got 'number'",
  );
});
