import { expect, test } from "vitest";
import { t } from "../src";

test("void()", () => {
  // @ts-expect-error no parse value
  expect(t.void().parse()).toBe(undefined);
  expect(t.void().parse(undefined)).toBe(undefined);
  expect(() => t.void().parse(null)).toThrow("expected 'undefined' got 'null'");
  expect(() => t.void().parse(0)).toThrow("expected 'undefined' got 'number'");
});
