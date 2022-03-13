import { expect, test } from "vitest";
import { instanceOf, t } from "../src";

test("instanceOf() infer", () => {
  class MyClass {}
  const instance = new MyClass();
  const type = instanceOf(MyClass, instance);
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, typeof MyClass> = true;
  assertType;
});

test("instanceof() infer", () => {
  class MyClass {}
  const instance = new MyClass();
  const type = t.instanceof(MyClass).parse(instance);
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, typeof MyClass> = true;
  assertType;
});

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
