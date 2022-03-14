import { expect, test } from "vitest";
import { t } from "../src";

// t.defaultSettings.objectTypeMode = 1;

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
  expect(t.object(schema).parse(input)).toEqual(input);
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
  expect(schema.parse(input)).toEqual(input);
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

test("object() STRICT", () => {
  const mod = t.ObjectTypeMode.STRICT;
  const schema = { life: t.number(), name: t.string() };
  const input = { life: 42, name: "prout", plop: true };
  expect(() => t.object(schema, mod).parse(input)).toThrow(
    "too many keys, expected [life,name] got [life,name,plop]",
  );
});

test("object().strict()", () => {
  const schema = { life: t.number(), name: t.string() };
  const input = { life: 42, name: "prout", plop: true };
  expect(() => t.object(schema).strict().parse(input)).toThrow(
    "too many keys, expected [life,name] got [life,name,plop]",
  );
});

test("object() STRICT deep", () => {
  const mod = t.ObjectTypeMode.STRICT;
  const schema = {
    life: t.number(),
    data: t.object({
      item1: t.number(),
      item2: t.object({ end: t.boolean() }),
    }),
  };
  const input = {
    life: 42,
    data: { item1: 1, item2: { end: true, nyan: "miaou" } },
  };
  expect(() => t.object(schema, mod).parse(input)).toThrow(
    "too many keys, expected [end] got [end,nyan]",
  );
});

test("object() STRIP", () => {
  const mod = t.ObjectTypeMode.STRIP;
  const schema = { life: t.number(), name: t.string() };
  const input = { life: 42, name: "prout", plop: true };
  expect(t.object(schema, mod).parse(input)).toEqual({
    life: 42,
    name: "prout",
  });
});

test("object().strip()", () => {
  const schema = { life: t.number(), name: t.string() };
  const input = { life: 42, name: "prout", plop: true };
  expect(t.object(schema).strip().parse(input)).toEqual({
    life: 42,
    name: "prout",
  });
});

test("object() PASSTHROUGH", () => {
  const mod = t.ObjectTypeMode.PASSTHROUGH;
  const schema = { life: t.number(), name: t.string() };
  const input = { life: 42, name: "prout", plop: true };
  expect(t.object(schema, mod).parse(input)).toEqual({
    life: 42,
    name: "prout",
    plop: true,
  });
});

test("object().passthrough()", () => {
  const schema = { life: t.number(), name: t.string() };
  const input = { life: 42, name: "prout", plop: true };
  expect(t.object(schema).passthrough().parse(input)).toEqual({
    life: 42,
    name: "prout",
    plop: true,
  });
});

test("nested object().strip()", () => {
  const weaponSchema = t
    .object({ damage: t.number(), weapon: t.string() })
    .strip();

  const charSchema = t.object({
    life: t.number(),
    name: t.string(),
    mainWeapon: weaponSchema,
  });

  const input = {
    life: 42,
    name: "prout",
    mainWeapon: { damage: 42, weapon: "sword", weight: "heavy" },
  };

  expect(charSchema.parse(input)).toEqual({
    life: 42,
    name: "prout",
    mainWeapon: { damage: 42, weapon: "sword" },
  });
});
