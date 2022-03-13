import { expect, test } from "vitest";
import { t } from "../src";

test("optional() infer", () => {
  const type = t.optional(t.string());
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, string | undefined> = true;
  assertType;

  const value = type.parse(undefined);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("optional(string())", () => {
  const optional = t.optional(t.string());
  expect(optional.parse("42")).toBe("42");
  expect(optional.parse(undefined)).toBe(undefined);
  expect(() => optional.parse(42)).toThrow(
    "expected 'string|undefined' got 'number'",
  );
  expect(() => optional.parse(null)).toThrow(
    "expected 'string|undefined' got 'null'",
  );
});

test("optional(): with invalid input", () => {
  // @ts-expect-error input type not assignable
  expect(() => t.optional(42).parse(42)).toThrow(
    "type.parse is not a function",
  );
});
