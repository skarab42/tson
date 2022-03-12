import { expect, test } from "vitest";
import { t } from "../src";

test("integer()", () => {
  expect(t.integer().parse(0)).toBe(0);
  expect(t.integer().parse(42)).toBe(42);
  expect(t.integer().parse(-42)).toBe(-42);
  expect(() => t.integer().parse(42n)).toThrow(
    "expected 'integer' got 'bigint'",
  );
  expect(() => t.integer().parse(null)).toThrow(
    "expected 'integer' got 'null'",
  );
  expect(() => t.integer().parse(Infinity)).toThrow(
    "expected 'integer' got 'Infinity'",
  );
});
