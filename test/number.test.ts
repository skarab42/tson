import { expect, test } from "vitest";
import { t } from "../src";

test("number()", () => {
  expect(t.number().parse(42)).toBe(42);
  expect(() => t.number().parse("42")).toThrow(
    "expected 'number' got 'string'",
  );
});
