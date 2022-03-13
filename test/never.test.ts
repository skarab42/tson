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

test("never()", () => {
  // @ts-expect-error no parse value
  expect(() => t.never().parse()).toThrow("expected 'never' got 'undefined'");
});
