import { expect, test } from "vitest";
import { t } from "../src";

test("unsignedNumber() infer", () => {
  const type = t.unsignedNumber();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, number> = true;
  assertType;

  const value = type.parse(42);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("unsignedNumber()", () => {
  expect(t.unsignedNumber().parse(0)).toBe(0);
  expect(t.unsignedNumber().parse(42)).toBe(42);
  expect(t.unsignedNumber().parse(0.1)).toBe(0.1);
  expect(t.unsignedNumber().parse(42.42)).toBe(42.42);
  expect(() => t.unsignedNumber().parse(-42)).toThrow(
    "expected 'unsigned number' got 'number'",
  );
  expect(() => t.unsignedNumber().parse(42n)).toThrow(
    "expected 'unsigned number' got 'bigint'",
  );
  expect(() => t.unsignedNumber().parse(null)).toThrow(
    "expected 'unsigned number' got 'null'",
  );
  expect(() => t.unsignedNumber().parse(Infinity)).toThrow(
    "expected 'unsigned number' got 'Infinity'",
  );
});
