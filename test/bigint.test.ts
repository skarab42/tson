import { expect, test } from "vitest";
import { t } from "../src";

test("bigint()", () => {
  expect(t.bigint().parse(42n)).toBe(42n);
  expect(t.bigint().parse(BigInt(42))).toBe(42n);
  expect(t.bigint().parse(BigInt(42))).toBe(BigInt(42));
  expect(() => t.bigint().parse("42")).toThrow(
    "expected 'bigint' got 'string'",
  );
});
