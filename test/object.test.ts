import { expect, test } from "vitest";
import { t } from "../src";

test("object() infer", () => {
  const input = { life: 42, name: "prout", data: { size: 24, verbose: true } };
  const type = t.object({
    life: t.number(),
    name: t.string(),
    data: t.object({ size: t.number(), verbose: t.boolean() }),
  });

  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, typeof input> = true;
  assertType;

  const value = type.parse(input);
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("object()", () => {
  const input = { life: 42, name: "prout" };
  const schema = { life: t.number(), name: t.string() };
  expect(t.object(schema).parse(input)).toBe(input);
  expect(() => t.object(schema).parse(Error)).toThrow(
    "expected 'object' got 'function'",
  );
});

test("object(): with error on first level", () => {
  const input = { life: 42, name: ["prout"] };
  const schema = { life: t.number(), name: t.string() };
  expect(() => t.object(schema).parse(input)).toThrow(
    "expected 'string' got 'array' from 'name'",
  );
});

test("object(): with two levels", () => {
  const input = { life: 42, name: "prout", data: { size: 24, verbose: true } };
  const schema = t.object({
    life: t.number(),
    name: t.string(),
    data: t.object({ size: t.number(), verbose: t.boolean() }),
  });
  expect(schema.parse(input)).toBe(input);
});

test("object(): with error on second level", () => {
  const input = {
    life: 42,
    name: "prout",
    data: { size: 24, verbose: "true" },
  };
  const schema = t.object({
    life: t.number(),
    name: t.string(),
    data: t.object({ size: t.number(), verbose: t.boolean() }),
  });
  expect(() => schema.parse(input)).toThrow(
    "expected 'boolean' got 'string' from 'data.verbose'",
  );
});

test("object(): with invalid input", () => {
  const input = { life: 42, name: ["prout"] };
  // @ts-expect-error input type not assignable
  expect(() => t.object(input).parse(input)).toThrow(
    "val.parse is not a function",
  );
});
