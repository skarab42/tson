import { expect, test } from "vitest";
import { t } from "../src";

test("postprocess() number -> number", () => {
  const postprocess = t.postprocess((input) => input + 2, t.number());

  expect(postprocess.parse(40)).toBe(42);

  expect(() => postprocess.parse("42")).toThrow(
    "expected 'number' got 'string'",
  );
});

test("postprocess() number -> number fail", () => {
  // @ts-expect-error string is not assignable to number
  const postprocess = t.postprocess((input) => `${input}`, t.number());

  expect(() => postprocess.parse(42)).toThrow("expected 'number' got 'string'");
});

test("postprocess() number -> string", () => {
  const postprocess = t.postprocess(
    (input) => String(input),
    t.number(),
    t.string(),
  );

  expect(postprocess.parse(42)).toBe("42");

  expect(() => postprocess.parse("42")).toThrow(
    "expected 'number' got 'string'",
  );
});

test("postprocess() number -> string fail", () => {
  const postprocess = t.postprocess(
    // @ts-expect-error number is not assignable to string
    (input) => Number(input),
    t.number(),
    t.string(),
  );

  expect(() => postprocess.parse(42)).toThrow("expected 'string' got 'number'");
});
