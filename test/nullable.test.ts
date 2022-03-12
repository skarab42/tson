import { expect, test } from "vitest";
import { t } from "../src";

test("nullable(string())", () => {
  const nullable = t.nullable(t.string());
  expect(nullable.parse("42")).toBe("42");
  expect(nullable.parse(null)).toBe(null);
  expect(() => nullable.parse([42])).toThrow(
    "expected 'string|null' got 'array'",
  );
  expect(() => nullable.parse(0)).toThrow(
    "expected 'string|null' got 'number'",
  );
});

test("nullable(): with invalid input", () => {
  // @ts-expect-error input type not assignable
  expect(() => t.nullable(42).parse(42)).toThrow(
    "type.parse is not a function",
  );
});
