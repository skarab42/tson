import { expect, test } from "vitest";
import { t } from "../src";

test("nan() infer", () => {
  const type = t.nan();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, number> = true;
  assertType;

  const value = type.parse(NaN);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("nan()", () => {
  expect(t.nan().parse(NaN)).toBe(NaN);
  expect(t.nan().parse(Number("forty-two"))).toBe(NaN);
  expect(() => t.nan().parse(0)).toThrow("expected 'NaN' got 'number'");
  expect(() => t.nan().parse(null)).toThrow("expected 'NaN' got 'null'");
  expect(() => t.nan().parse(Infinity)).toThrow(
    "expected 'NaN' got 'Infinity'",
  );
});
