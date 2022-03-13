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

test("bigint() infer optional", () => {
  const type = t.bigint().optional();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, bigint | undefined> = true;
  assertType;
});

test("bigint()", () => {
  expect(t.bigint().parse(42n)).toBe(42n);
  expect(t.bigint().parse(BigInt(42))).toBe(42n);
  expect(t.bigint().parse(BigInt(42))).toBe(BigInt(42));
  expect(() => t.bigint().parse("42")).toThrow(
    "expected 'bigint' got 'string'",
  );
});

test("bigint() safeParse", () => {
  expect(t.bigint().safeParse(42n)).toEqual({ success: true, data: 42n });
  expect(t.bigint().safeParse(42)).toMatchInlineSnapshot(`
    {
      "error": [TypeParseError: expected 'bigint' got 'number'],
      "success": false,
    }
  `);
});

test("bigint() optional", () => {
  expect(t.bigint().optional().safeParse(42n)).toEqual({
    success: true,
    data: 42n,
  });
  expect(t.bigint().optional().safeParse(42)).toMatchInlineSnapshot(`
    {
      "error": [TypeParseError: expected 'bigint|undefined' got 'number'],
      "success": false,
    }
  `);
});
