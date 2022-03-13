import { expect, test } from "vitest";
import { t } from "../src";

test("string() infer", () => {
  const type = t.string();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, string> = true;
  assertType;

  const value = type.parse("nyan");
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("string()", () => {
  expect(t.string().parse("42")).toBe("42");
  expect(() => t.string().parse(42)).toThrow("expected 'string' got 'number'");
});
