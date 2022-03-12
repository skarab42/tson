import { expect, test } from "vitest";
import { t } from "../src";

test("any()", () => {
  expect(t.any().parse(42)).toBe(42);
});
