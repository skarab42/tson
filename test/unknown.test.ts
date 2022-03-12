import { expect, test } from "vitest";
import { t } from "../src";

test("unknown()", () => {
  expect(t.unknown().parse(42)).toBe(42);
});
