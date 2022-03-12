import { expect, test } from "vitest";
import { t } from "../src";

test("tuple(...type)", () => {
  const input: [number, string, boolean, string] = [42, "plop", true, "42"];
  const schema = t.tuple(t.number(), t.string(), t.boolean(), t.string());
  expect(schema.parse(input)).toBe(input);
  expect(() => schema.parse([42, 24, true, "42"])).toThrow(
    "expected 'string' got 'number' at index '1'",
  );
  expect(() => schema.parse([42, "plop", true, "42", "overflow"])).toThrow(
    "expected length to be '4' got '5'",
  );
  expect(() => schema.parse([42, "plop", true])).toThrow(
    "expected length to be '4' got '3'",
  );
});

test("tuple(type[])", () => {
  const input: [number, string, boolean, string] = [42, "plop", true, "42"];
  const schema = t.tuple([t.number(), t.string(), t.boolean(), t.string()]);
  expect(schema.parse(input)).toBe(input);
  expect(() => schema.parse([42, 24, true, "42"])).toThrow(
    "expected 'string' got 'number' at index '1'",
  );
  expect(() => schema.parse([42, "plop", true, "42", "overflow"])).toThrow(
    "expected length to be '4' got '5'",
  );
  expect(() => schema.parse([42, "plop", true])).toThrow(
    "expected length to be '4' got '3'",
  );
});

test("tuple(type[]) as const", () => {
  const input: [number, string, boolean, string] = [42, "plop", true, "42"];
  const prout = [t.number(), t.string(), t.boolean(), t.string()] as const;
  const schema = t.tuple(prout);
  expect(schema.parse(input)).toBe(input);
  expect(() => schema.parse([42, 24, true, "42"])).toThrow(
    "expected 'string' got 'number' at index '1'",
  );
  expect(() => schema.parse([42, "plop", true, "42", "overflow"])).toThrow(
    "expected length to be '4' got '5'",
  );
  expect(() => schema.parse([42, "plop", true])).toThrow(
    "expected length to be '4' got '3'",
  );
});

test("tuple() invalid input", () => {
  // @ts-expect-error invalid input
  const schema = t.tuple(true);
  expect(() => schema.parse(["42"])).toThrow("type.parse is not a function");
});
