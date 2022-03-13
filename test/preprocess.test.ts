import { expect, test } from "vitest";
import { t } from "../src";

test("preprocess() infer", () => {
  const type = t.preprocess((input) => String(input), t.string());
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, string> = true;
  assertType;

  const value = type.parse("nyan");
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

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

test("type.preprocess() number", () => {
  const preprocess = t.number().preprocess((input) => Number(input));
  expect(preprocess.parse("42")).toBe(42);
  expect(preprocess.parse(42)).toBe(42);

  expect(() => preprocess.parse(undefined)).toThrow(
    "expected 'number' got 'NaN'",
  );
});
