import { expect, test } from "vitest";
import { t } from "../src";

test("function()", () => {
  const f = (p: string) => p;
  expect(t.function().parse(f)).toBe(f);
  expect(() => t.function().parse(42)).toThrow(
    "expected 'function' got 'number'",
  );
});
