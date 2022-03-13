import { expect, test } from "vitest";
import { t } from "../src";

test("promise() infer", () => {
  const type = t.promise(t.boolean());
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, Promise<boolean>> = true;
  assertType;

  const value = type.parse(Promise.resolve(true));
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

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
