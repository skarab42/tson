import { expect, test } from "vitest";
import { t } from "../src";

test("postprocess() infer", () => {
  const type = t.postprocess((input) => {
    const assertArg: t.AssertEqual<typeof input, number> = true;
    assertArg;

    return input + 2;
  }, t.number());

  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, number> = true;
  assertType;

  const value = type.parse(42);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("postprocess() infer output convertion", () => {
  const type = t.postprocess(
    (input) => {
      const assertArg: t.AssertEqual<typeof input, number> = true;
      assertArg;
      return String(input);
    },
    t.number(),
    t.string(),
  );

  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, string> = true;
  assertType;

  const value = type.parse(42);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("postprocess() number -> number", () => {
  const postprocess = t.postprocess((input) => input + 2, t.number());

  expect(postprocess.parse(40)).toBe(42);

  expect(() => postprocess.parse("42")).toThrow(
    "expected 'number' got 'string'",
  );
});

test("type.postprocess() number -> number", () => {
  const postprocess = t.number().postprocess((input) => input + 2);

  expect(postprocess.parse(40)).toBe(42);

  expect(() => postprocess.parse("42")).toThrow(
    "expected 'number' got 'string'",
  );
});

test("type.transform() number -> number", () => {
  const transform = t.number().transform((input) => input + 2);

  expect(transform.parse(40)).toBe(42);

  expect(() => transform.parse("42")).toThrow("expected 'number' got 'string'");
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
