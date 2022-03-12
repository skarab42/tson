import { expect, test } from "vitest";
import { t } from "../src";

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
