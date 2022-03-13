import { expect, test } from "vitest";
import { helpers } from "../src/helpers";

test("helpers()", () => {
  expect(() => helpers().safeParse(42)).toThrow("this.parse is not a function");
});
