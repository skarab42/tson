import { expect, test } from "vitest";
import { t } from "../src";

test("union(...type)", () => {
  const str = t.string();
  const num = t.number();
  const boo = t.boolean();
  const uni = t.union(str, num, boo, str);
  expect(uni.parse(42)).toBe(42);
  expect(uni.parse("42")).toBe("42");
  expect(uni.parse(40 + 2 === 42)).toBe(true);
  expect(() => uni.parse(undefined)).toThrow(
    "expected 'string|number|boolean' got 'undefined'",
  );
  expect(() => uni.parse(null)).toThrow(
    "expected 'string|number|boolean' got 'null'",
  );
});

test("union(type[])", () => {
  const str = t.string();
  const num = t.number();
  const boo = t.boolean();
  const uni = t.union([str, num, boo, str]);
  expect(uni.parse(42)).toBe(42);
  expect(uni.parse("42")).toBe("42");
  expect(uni.parse(40 + 2 === 42)).toBe(true);
  expect(() => uni.parse(undefined)).toThrow(
    "expected 'string|number|boolean' got 'undefined'",
  );
  expect(() => uni.parse(null)).toThrow(
    "expected 'string|number|boolean' got 'null'",
  );
});

test("union(type[]) as const", () => {
  const str = t.string();
  const num = t.number();
  const boo = t.boolean();
  const types = [str, num, boo, str] as const;
  const uni = t.union(types);
  expect(uni.parse(42)).toBe(42);
  expect(uni.parse("42")).toBe("42");
  expect(uni.parse(40 + 2 === 42)).toBe(true);
  expect(() => uni.parse(undefined)).toThrow(
    "expected 'string|number|boolean' got 'undefined'",
  );
  expect(() => uni.parse(null)).toThrow(
    "expected 'string|number|boolean' got 'null'",
  );
});

test("union(): with optional", () => {
  const str = t.string();
  const num = t.number();
  const boo = t.boolean();
  const uni = t.optional(t.union([str, num, boo]));
  expect(uni.parse(undefined)).toBe(undefined);
  expect(() => uni.parse(null)).toThrow(
    "expected 'string|number|boolean|undefined' got 'null'",
  );
});

test("union(): with optional in object", () => {
  const str = t.string();
  const num = t.number();
  const boo = t.boolean();
  const obj = t.object({
    name: t.string(),
    desc: t.optional(t.union([str, num, boo])),
  });
  let input: object = { name: "nyan" };
  expect(obj.parse(input)).toBe(input);
  input = { name: "nyan", desc: 42 };
  expect(obj.parse(input)).toBe(input);
  input = { name: "nyan", desc: "42" };
  expect(obj.parse(input)).toBe(input);
  input = { name: "nyan", desc: false };
  expect(obj.parse(input)).toBe(input);
  input = { name: "nyan", desc: Symbol(42) };
  expect(() => obj.parse(input)).toThrow(
    "expected 'string|number|boolean|undefined' got 'symbol'",
  );
});

test("union() as optional", () => {
  const optional = t.union([t.string(), t.undefined()]);
  expect(optional.parse("42")).toBe("42");
  expect(optional.parse(undefined)).toBe(undefined);
  expect(() => optional.parse(42)).toThrow(
    "expected 'string|undefined' got 'number'",
  );
  expect(() => optional.parse(null)).toThrow(
    "expected 'string|undefined' got 'null'",
  );
});
