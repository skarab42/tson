import { expect, test } from "vitest";
import { t } from "../src";

test("null()", () => {
  expect(t.null().parse(null)).toBe(null);
  expect(() => t.null().parse(0)).toThrow("expected 'null' got 'number'");
  expect(() => t.null().parse(undefined)).toThrow(
    "expected 'null' got 'undefined'",
  );
});
