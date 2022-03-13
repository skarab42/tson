import { expect, test } from "vitest";
import { t } from "../src";

test("function() infer", () => {
  const type = t.function();
  type Type = t.infer<typeof type>;

  const assertType: t.AssertEqual<Type, () => void> = true;
  assertType;
});

test("function([type]) infer", () => {
  const type = t.function([t.string()]);
  type Type = t.infer<typeof type>;

  const assertType: t.AssertEqual<Type, (x: string) => void> = true;
  assertType;
});

test("function([type], return) infer", () => {
  const type = t.function([t.number()], t.boolean());
  type Type = t.infer<typeof type>;

  const assertType: t.AssertEqual<Type, (x: number) => boolean> = true;
  assertType;
});

test("function([type], return, implement) infer", () => {
  const args = [t.string(), t.boolean()] as const;
  const returns = t.union(t.string(), t.number());

  const type = t.function(args, returns, (input, toInt) => {
    const assertArg1: t.AssertEqual<typeof input, string> = true;
    assertArg1;

    const assertArg2: t.AssertEqual<typeof toInt, boolean> = true;
    assertArg2;

    return toInt ? parseInt(input) : input.toUpperCase();
  });

  type Type = t.infer<typeof type>;

  const assertType: t.AssertEqual<
    Type,
    (a: string, b: boolean) => string | number
  > = true;
  assertType;
});

test("function() void", () => {
  expect(t.function()()).toBe(undefined);
});

test("function([string]) void", () => {
  const func = t.function([t.string()]);

  expect(func("hello")).toBe(undefined);

  // @ts-expect-errorinvalid args
  expect(() => func(42)).toThrow("expected 'string' got 'number' at index '0'");
});

test("function([string, boolean]) number", () => {
  const args = [t.string(), t.boolean()] as const;
  const returns = t.union(t.string(), t.number());
  const func = t.function(args, returns, (input, toInt) => {
    return toInt ? parseInt(input) : input.toUpperCase();
  });

  expect(func("42 is the response", true)).toBe(42);
  expect(func("my name is nyan", false)).toBe("MY NAME IS NYAN");

  // @ts-expect-errorinvalid args
  expect(() => func(42)).toThrow("expected length to be '2' got '1'");
});
