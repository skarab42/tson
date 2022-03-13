import { expect, test } from "vitest";
import { t } from "../src";

test("enum() infer", () => {
  const type = t.enum("UP", "DOWN", "LEFT", "RIGHT");
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, "UP" | "DOWN" | "LEFT" | "RIGHT"> =
    true;
  assertType;

  const value = type.parse("UP");
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("enum(native) infer", () => {
  enum MyStrEnum {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
  }

  const type = t.enum(MyStrEnum);
  type Type = t.infer<typeof type>;
  const assertType: t.AssertEqual<Type, MyStrEnum> = true;
  assertType;

  const value = type.parse("UP");
  const assertValue: t.AssertEqual<typeof value, Type> = true;
  assertValue;
});

test("enum(...string[])", () => {
  const myEnum = t.enum("UP", "DOWN", "LEFT", "RIGHT");
  expect(myEnum.parse("UP")).toBe("UP");
  expect(myEnum.parse("DOWN")).toBe("DOWN");
  expect(myEnum.parse("LEFT")).toBe("LEFT");
  expect(myEnum.parse("RIGHT")).toBe("RIGHT");
  expect(myEnum.parse(myEnum.enum.UP)).toBe("UP");
  expect(myEnum.parse(myEnum.enum.DOWN)).toBe("DOWN");
  expect(myEnum.parse(myEnum.enum.LEFT)).toBe("LEFT");
  expect(myEnum.parse(myEnum.enum.RIGHT)).toBe("RIGHT");
  expect(() => myEnum.parse("PROUT")).toThrow(
    "expected 'UP|DOWN|LEFT|RIGHT' got 'string'",
  );
  expect(() => myEnum.parse(0)).toThrow(
    "expected 'UP|DOWN|LEFT|RIGHT' got 'number'",
  );
});

test("enum(string[])", () => {
  const myEnum = t.enum(["UP", "DOWN", "LEFT", "RIGHT"]);
  expect(myEnum.parse("UP")).toBe("UP");
  expect(myEnum.parse("DOWN")).toBe("DOWN");
  expect(myEnum.parse("LEFT")).toBe("LEFT");
  expect(myEnum.parse("RIGHT")).toBe("RIGHT");
  expect(myEnum.parse(myEnum.enum.UP)).toBe("UP");
  expect(myEnum.parse(myEnum.enum.DOWN)).toBe("DOWN");
  expect(myEnum.parse(myEnum.enum.LEFT)).toBe("LEFT");
  expect(myEnum.parse(myEnum.enum.RIGHT)).toBe("RIGHT");
  expect(() => myEnum.parse("PROUT")).toThrow(
    "expected 'UP|DOWN|LEFT|RIGHT' got 'string'",
  );
  expect(() => myEnum.parse(0)).toThrow(
    "expected 'UP|DOWN|LEFT|RIGHT' got 'number'",
  );
});

test("enum(string[] as const)", () => {
  const myEnum = t.enum(["UP", "DOWN", "LEFT", "RIGHT"] as const);
  expect(myEnum.parse("UP")).toBe("UP");
  expect(myEnum.parse("DOWN")).toBe("DOWN");
  expect(myEnum.parse("LEFT")).toBe("LEFT");
  expect(myEnum.parse("RIGHT")).toBe("RIGHT");
  expect(myEnum.parse(myEnum.enum.UP)).toBe("UP");
  expect(myEnum.parse(myEnum.enum.DOWN)).toBe("DOWN");
  expect(myEnum.parse(myEnum.enum.LEFT)).toBe("LEFT");
  expect(myEnum.parse(myEnum.enum.RIGHT)).toBe("RIGHT");
  expect(() => myEnum.parse("PROUT")).toThrow(
    "expected 'UP|DOWN|LEFT|RIGHT' got 'string'",
  );
  expect(() => myEnum.parse(0)).toThrow(
    "expected 'UP|DOWN|LEFT|RIGHT' got 'number'",
  );
});

test("enum(string[] as const) defined before assignement", () => {
  const values = ["UP", "DOWN", "LEFT", "RIGHT"] as const;
  const myEnum = t.enum(values);
  expect(myEnum.parse("UP")).toBe("UP");
  expect(myEnum.parse("DOWN")).toBe("DOWN");
  expect(myEnum.parse("LEFT")).toBe("LEFT");
  expect(myEnum.parse("RIGHT")).toBe("RIGHT");
  expect(myEnum.parse(myEnum.enum.UP)).toBe("UP");
  expect(myEnum.parse(myEnum.enum.DOWN)).toBe("DOWN");
  expect(myEnum.parse(myEnum.enum.LEFT)).toBe("LEFT");
  expect(myEnum.parse(myEnum.enum.RIGHT)).toBe("RIGHT");
  expect(() => myEnum.parse("PROUT")).toThrow(
    "expected 'UP|DOWN|LEFT|RIGHT' got 'string'",
  );
  expect(() => myEnum.parse(0)).toThrow(
    "expected 'UP|DOWN|LEFT|RIGHT' got 'number'",
  );
});

test("enum(tuple)", () => {
  const values: ["UP", "DOWN", "LEFT", "RIGHT"] = [
    "UP",
    "DOWN",
    "LEFT",
    "RIGHT",
  ];
  const myEnum = t.enum(values);
  expect(myEnum.parse("UP")).toBe("UP");
  expect(myEnum.parse("DOWN")).toBe("DOWN");
  expect(myEnum.parse("LEFT")).toBe("LEFT");
  expect(myEnum.parse("RIGHT")).toBe("RIGHT");
  expect(myEnum.parse(myEnum.enum.UP)).toBe("UP");
  expect(myEnum.parse(myEnum.enum.DOWN)).toBe("DOWN");
  expect(myEnum.parse(myEnum.enum.LEFT)).toBe("LEFT");
  expect(myEnum.parse(myEnum.enum.RIGHT)).toBe("RIGHT");
  expect(() => myEnum.parse("PROUT")).toThrow(
    "expected 'UP|DOWN|LEFT|RIGHT' got 'string'",
  );
  expect(() => myEnum.parse(0)).toThrow(
    "expected 'UP|DOWN|LEFT|RIGHT' got 'number'",
  );
});

test("enum(...) native string enum", () => {
  enum MyStrEnum {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
  }
  const myEnum = t.enum(MyStrEnum);
  expect(myEnum.parse("UP")).toBe("UP");
  expect(myEnum.parse("DOWN")).toBe("DOWN");
  expect(myEnum.parse("LEFT")).toBe("LEFT");
  expect(myEnum.parse("RIGHT")).toBe("RIGHT");
  expect(myEnum.parse(myEnum.enum.UP)).toBe("UP");
  expect(myEnum.parse(myEnum.enum.DOWN)).toBe("DOWN");
  expect(myEnum.parse(myEnum.enum.LEFT)).toBe("LEFT");
  expect(myEnum.parse(myEnum.enum.RIGHT)).toBe("RIGHT");
  expect(() => myEnum.parse("PROUT")).toThrow(
    "expected 'UP|DOWN|LEFT|RIGHT' got 'string'",
  );
  expect(() => myEnum.parse(0)).toThrow(
    "expected 'UP|DOWN|LEFT|RIGHT' got 'number'",
  );
});

test("enum(...) native numeric enum", () => {
  enum MyNumEnum {
    UP,
    DOWN,
    LEFT,
    RIGHT,
  }
  const myEnum = t.enum(MyNumEnum);
  expect(myEnum.parse(myEnum.enum.UP)).toBe(0);
  expect(myEnum.parse(myEnum.enum.DOWN)).toBe(1);
  expect(myEnum.parse(myEnum.enum.LEFT)).toBe(2);
  expect(myEnum.parse(myEnum.enum.RIGHT)).toBe(3);
  expect(() => myEnum.parse("UP")).toThrow("expected '0|1|2|3' got 'string'");
  expect(() => myEnum.parse(42)).toThrow("expected '0|1|2|3' got 'number'");
});

test("enum(...) native mixed enum", () => {
  enum MyMixedEnum {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = 42,
    RIGHT,
  }
  const myEnum = t.enum(MyMixedEnum);
  expect(myEnum.parse("UP")).toBe("UP");
  expect(myEnum.parse("DOWN")).toBe("DOWN");
  expect(myEnum.parse(myEnum.enum.UP)).toBe("UP");
  expect(myEnum.parse(myEnum.enum.DOWN)).toBe("DOWN");
  expect(myEnum.parse(myEnum.enum.LEFT)).toBe(42);
  expect(myEnum.parse(myEnum.enum.RIGHT)).toBe(43);
  expect(() => myEnum.parse("LEFT")).toThrow(
    "expected 'UP|DOWN|42|43' got 'string'",
  );
  expect(() => myEnum.parse("RIGHT")).toThrow(
    "expected 'UP|DOWN|42|43' got 'string'",
  );
  expect(() => myEnum.parse(0)).toThrow(
    "expected 'UP|DOWN|42|43' got 'number'",
  );
});

test("enum(...) fake string enum", () => {
  const myEnum = t.enum({
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
  });
  expect(myEnum.parse("UP")).toBe("UP");
  expect(myEnum.parse("DOWN")).toBe("DOWN");
  expect(myEnum.parse("LEFT")).toBe("LEFT");
  expect(myEnum.parse("RIGHT")).toBe("RIGHT");
  expect(myEnum.parse(myEnum.enum.UP)).toBe("UP");
  expect(myEnum.parse(myEnum.enum.DOWN)).toBe("DOWN");
  expect(myEnum.parse(myEnum.enum.LEFT)).toBe("LEFT");
  expect(myEnum.parse(myEnum.enum.RIGHT)).toBe("RIGHT");
  expect(() => myEnum.parse("PROUT")).toThrow(
    "expected 'UP|DOWN|LEFT|RIGHT' got 'string'",
  );
  expect(() => myEnum.parse(0)).toThrow(
    "expected 'UP|DOWN|LEFT|RIGHT' got 'number'",
  );
});

test("enum(...) fake numeric enum", () => {
  const myEnum = t.enum({
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
  });
  expect(myEnum.parse(myEnum.enum.UP)).toBe(0);
  expect(myEnum.parse(myEnum.enum.DOWN)).toBe(1);
  expect(myEnum.parse(myEnum.enum.LEFT)).toBe(2);
  expect(myEnum.parse(myEnum.enum.RIGHT)).toBe(3);
  expect(() => myEnum.parse("UP")).toThrow("expected '0|1|2|3' got 'string'");
  expect(() => myEnum.parse(42)).toThrow("expected '0|1|2|3' got 'number'");
});

test("enum(...) fake mixed enum", () => {
  const myEnum = t.enum({
    UP: "UP",
    DOWN: "DOWN",
    LEFT: 42,
    RIGHT: 43,
  });
  expect(myEnum.parse("UP")).toBe("UP");
  expect(myEnum.parse("DOWN")).toBe("DOWN");
  expect(myEnum.parse(myEnum.enum.UP)).toBe("UP");
  expect(myEnum.parse(myEnum.enum.DOWN)).toBe("DOWN");
  expect(myEnum.parse(myEnum.enum.LEFT)).toBe(42);
  expect(myEnum.parse(myEnum.enum.RIGHT)).toBe(43);
  expect(() => myEnum.parse("LEFT")).toThrow(
    "expected 'UP|DOWN|42|43' got 'string'",
  );
  expect(() => myEnum.parse("RIGHT")).toThrow(
    "expected 'UP|DOWN|42|43' got 'string'",
  );
  expect(() => myEnum.parse(0)).toThrow(
    "expected 'UP|DOWN|42|43' got 'number'",
  );
});

test("enum(...) invalid input", () => {
  // @ts-expect-error invalid input
  expect(() => t.enum(true)).toThrow("expected 'enum' got 'boolean'");
});

test("nativeEnum()", () => {
  enum MyMixedEnum {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = 42,
    RIGHT,
  }
  const myEnum = t.nativeEnum(MyMixedEnum);
  expect(myEnum.parse("UP")).toBe("UP");
  expect(myEnum.parse("DOWN")).toBe("DOWN");
  expect(myEnum.parse(myEnum.enum.UP)).toBe("UP");
  expect(myEnum.parse(myEnum.enum.DOWN)).toBe("DOWN");
  expect(myEnum.parse(myEnum.enum.LEFT)).toBe(42);
  expect(myEnum.parse(myEnum.enum.RIGHT)).toBe(43);
  expect(() => myEnum.parse("LEFT")).toThrow(
    "expected 'UP|DOWN|42|43' got 'string'",
  );
  expect(() => myEnum.parse("RIGHT")).toThrow(
    "expected 'UP|DOWN|42|43' got 'string'",
  );
  expect(() => myEnum.parse(0)).toThrow(
    "expected 'UP|DOWN|42|43' got 'number'",
  );
});
