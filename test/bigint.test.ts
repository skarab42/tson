import { expect, test } from "vitest";
import { t } from "../src";

test("bigint() infer", () => {
  const type = t.bigint();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, bigint> = true;
  assertType;

  const value = type.parse(42n);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("bigint()", () => {
  expect(t.bigint().parse(42n)).toBe(42n);
  expect(t.bigint().parse(BigInt(42))).toBe(42n);
  expect(t.bigint().parse(BigInt(42))).toBe(BigInt(42));
  expect(() => t.bigint().parse("42")).toThrow(
    "expected 'bigint' got 'string'",
  );
});
