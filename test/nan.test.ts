import { expect, test } from "vitest";
import { t } from "../src";

test("nan()", () => {
  expect(t.nan().parse(NaN)).toBe(NaN);
  expect(t.nan().parse(Number("forty-two"))).toBe(NaN);
  expect(() => t.nan().parse(0)).toThrow("expected 'NaN' got 'number'");
  expect(() => t.nan().parse(null)).toThrow("expected 'NaN' got 'null'");
  expect(() => t.nan().parse(Infinity)).toThrow(
    "expected 'NaN' got 'Infinity'",
  );
});
