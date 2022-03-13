import { expect, test } from "vitest";
import { t } from "../src";

test("unsignedInteger() infer", () => {
  const type = t.unsignedInteger();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, number> = true;
  assertType;

  const value = type.parse(42);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("unsignedInteger()", () => {
  expect(t.unsignedInteger().parse(0)).toBe(0);
  expect(t.unsignedInteger().parse(42)).toBe(42);
  expect(() => t.unsignedInteger().parse(-42)).toThrow(
    "expected 'unsigned integer' got 'number'",
  );
  expect(() => t.unsignedInteger().parse(0.1)).toThrow(
    "expected 'unsigned integer' got 'number'",
  );
  expect(() => t.unsignedInteger().parse(42n)).toThrow(
    "expected 'unsigned integer' got 'bigint'",
  );
  expect(() => t.unsignedInteger().parse(null)).toThrow(
    "expected 'unsigned integer' got 'null'",
  );
  expect(() => t.unsignedInteger().parse(Infinity)).toThrow(
    "expected 'unsigned integer' got 'Infinity'",
  );
});
