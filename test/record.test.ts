import { expect, test } from "vitest";
import { t } from "../src";

test("record() string", () => {
  const record = { name: "nyan" };
  expect(t.record(t.string()).parse(record)).toBe(record);
  expect(() => t.record(t.string()).parse({ name: 42 })).toThrow(
    "expected 'string' got 'number' from 'name'",
  );
  expect(() => t.record(t.string()).parse(42)).toThrow(
    "expected 'object' got 'number'",
  );
});

test("record() number", () => {
  const record = { name: 42 };
  expect(t.record(t.number()).parse(record)).toBe(record);
  expect(() => t.record(t.number()).parse({ name: "42" })).toThrow(
    "expected 'number' got 'string' from 'name'",
  );
  expect(() => t.record(t.number()).parse(42)).toThrow(
    "expected 'object' got 'number'",
  );
});

test("record() date", () => {
  const date = { a: new Date(), b: new Date() };
  expect(t.record(t.date()).parse(date)).toBe(date);
  expect(() => t.record(t.date()).parse({ a: new Date(), b: 42 })).toThrow(
    "expected 'Date' got 'number' from 'b'",
  );
  expect(() => t.record(t.date()).parse(null)).toThrow(
    "expected 'object' got 'null'",
  );
  expect(() => t.record(t.date()).parse(42)).toThrow(
    "expected 'object' got 'number'",
  );
});

test("record() invalid input", () => {
  // @ts-expect-error invalid type
  expect(() => t.record(null)).toThrow("expected 'object' got 'null'");
});
