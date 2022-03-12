import { expect, test } from "vitest";
import { t } from "../src";

test("symbol()", () => {
  const sym = Symbol(42);
  expect(t.symbol().parse(sym)).toBe(sym);
  expect(() => t.symbol().parse(42)).toThrow("expected 'symbol' got 'number'");
});
