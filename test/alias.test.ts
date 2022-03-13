import { expect, test } from "vitest";
import { t } from "../src";

test("alias", () => {
  expect(t.int().parse(42)).toBe(42);
  // @ts-expect-error undefined argument
  expect(t.void().parse()).toBe(undefined);
  expect(t.any().parse(42)).toBe(42);
  expect(t.uinteger().parse(42)).toBe(42);
  expect(t.uint().parse(42)).toBe(42);
  expect(t.unumber().parse(42)).toBe(42);
});
