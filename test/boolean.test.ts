import { expect, test } from "vitest";
import { t } from "../src";

test("boolean()", () => {
  expect(t.boolean().parse(40 + 2 === 42)).toBe(true);
  expect(() => t.boolean().parse(Symbol(42))).toThrow(
    "expected 'boolean' got 'symbol'",
  );
});
