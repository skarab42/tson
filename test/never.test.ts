import { expect, test } from "vitest";
import { t } from "../src";

test("never()", () => {
  // @ts-expect-error no parse value
  expect(() => t.never().parse()).toThrow("expected 'never' got 'undefined'");
});
