import { expect, test } from "vitest";
import { t } from "../src";

test("preprocess() string", () => {
  const preprocess = t.preprocess((input) => String(input), t.string());
  expect(preprocess.parse("42")).toBe("42");
  expect(preprocess.parse(42)).toBe("42");
});

test("preprocess() number", () => {
  const preprocess = t.preprocess((input) => Number(input), t.number());
  expect(preprocess.parse("42")).toBe(42);
  expect(preprocess.parse(42)).toBe(42);

  expect(() => preprocess.parse(undefined)).toThrow(
    "expected 'number' got 'NaN'",
  );
});
