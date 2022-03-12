import { expect, test } from "vitest";
import { t } from "../src";

test("undefined()", () => {
  // @ts-expect-error no parse value
  expect(t.undefined().parse()).toBe(undefined);
  expect(t.undefined().parse(undefined)).toBe(undefined);
  expect(() => t.undefined().parse(null)).toThrow(
    "expected 'undefined' got 'null'",
  );
  expect(() => t.undefined().parse(0)).toThrow(
    "expected 'undefined' got 'number'",
  );
});
