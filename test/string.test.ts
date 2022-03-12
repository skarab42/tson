import { expect, test } from "vitest";
import { t } from "../src";

test("string()", () => {
  expect(t.string().parse("42")).toBe("42");
  expect(() => t.string().parse(42)).toThrow("expected 'string' got 'number'");
});
