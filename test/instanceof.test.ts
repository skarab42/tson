import { expect, test } from "vitest";
import { instanceOf } from "../src/util";
import { t } from "../src";

test("instanceOf() helper", () => {
  class MyClass {}
  const instance = new MyClass();
  expect(instanceOf(MyClass, instance)).toBe(instance);
  expect(() => instanceOf(MyClass, new Date())).toThrow(
    "expected 'MyClass' got 'object'",
  );
});

test("instanceof() type", () => {
  class MyClass {}
  const instance = new MyClass();
  expect(t.instanceof(MyClass).parse(instance)).toBe(instance);
  expect(() => t.instanceof(MyClass).parse(new Date())).toThrow(
    "expected 'MyClass' got 'object'",
  );
});
