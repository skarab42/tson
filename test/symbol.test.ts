import { expect, test } from "vitest";
import { t } from "../src";

test("symbol() infer", () => {
  const type = t.symbol();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, symbol> = true;
  assertType;

  const value = type.parse(Symbol(42));
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("symbol()", () => {
  const sym = Symbol(42);
  expect(t.symbol().parse(sym)).toBe(sym);
  expect(() => t.symbol().parse(42)).toThrow("expected 'symbol' got 'number'");
});
