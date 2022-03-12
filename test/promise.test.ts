import { expect, test } from "vitest";
import { t } from "../src";

test("promise()", async () => {
  const promise = t.promise(t.number());

  await expect(promise.parse(Promise.resolve(42))).resolves.toBe(42);
  await expect(promise.parse(Promise.resolve("42"))).rejects.toThrow(
    "expected 'number' got 'string'",
  );

  await expect(promise.parse(42)).rejects.toThrow(
    "expected 'Promise' got 'number'",
  );
});
