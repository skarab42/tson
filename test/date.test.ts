import { expect, test } from "vitest";
import { t } from "../src";

test("date() infer", () => {
  const type = t.date();
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, string | DateConstructor> = true;
  assertType;

  const value = type.parse(new Date());
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("date() Date", () => {
  const date = new Date();
  expect(t.date().parse(date)).toBe(date);
  expect(() => t.date().parse(Date)).toThrow("expected 'Date' got 'function'");
  expect(() => t.date().parse(Date.now())).toThrow(
    "expected 'Date' got 'number'",
  );
});

test("date() string", () => {
  const date = "2022-03-11T09:28:00.575Z";
  expect(t.date().parse(date)).toBe(date);
  expect(() => t.date().parse("Date")).toThrow("expected 'Date' got 'string'");
  expect(() => t.date().parse(Date.now())).toThrow(
    "expected 'Date' got 'number'",
  );
});
