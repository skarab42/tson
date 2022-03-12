import { expect, test } from "vitest";
import { t } from "../src";

test("infinity()", () => {
  expect(t.infinity().parse(Infinity)).toBe(Infinity);
  expect(t.infinity().parse(-Infinity)).toBe(-Infinity);
  expect(t.infinity().parse(Number.MAX_VALUE * 42)).toBe(Infinity);
  expect(() => t.infinity().parse(0)).toThrow(
    "expected 'Infinity' got 'number'",
  );
  expect(() => t.infinity().parse(null)).toThrow(
    "expected 'Infinity' got 'null'",
  );
});
