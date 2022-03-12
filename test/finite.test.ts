import { expect, test } from "vitest";
import { t } from "../src";

test("finite()", () => {
  expect(t.finite().parse(0)).toBe(0);
  expect(t.finite().parse(42)).toBe(42);
  expect(t.finite().parse(-42)).toBe(-42);
  expect(t.finite().parse(+42.42)).toBe(+42.42);
  expect(t.finite().parse(-42.42)).toBe(-42.42);
  expect(() => t.finite().parse(42n)).toThrow(
    "expected 'finite number' got 'bigint'",
  );
  expect(() => t.finite().parse(null)).toThrow(
    "expected 'finite number' got 'null'",
  );
  expect(() => t.finite().parse(Infinity)).toThrow(
    "expected 'finite number' got 'Infinity'",
  );
});
