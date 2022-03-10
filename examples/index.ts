import { t } from "../src";
import { InferType } from "../src/types";

const unk = t.unknown();
const str = t.string();
const num = t.number();
const boo = t.boolean();

const uni = t.union([str, num, boo, t.optional(str)]);

// const life = uni.check(42);

const data = t.object({
  desc: t.optional(t.string()),
  root: t.boolean(),
  uni,
});

const obj = t.object({
  name: str,
  size: t.optional(num),
  desc: t.string(),
  data,
  data2: t.optional(
    t.object({
      desc: t.string(),
      root: t.boolean(),
    }),
  ),
  plus: t.object({
    desc2: t.string(),
    root2: t.boolean(),
    plus2: t.object({
      desc2: t.optional(t.string()),
      root2: t.boolean(),
    }),
  }),
});

export type Unk = InferType<typeof unk>;
export type Str = InferType<typeof str>;
export type Num = InferType<typeof num>;
export type Boo = InferType<typeof boo>;
export type Obj = InferType<typeof obj>;
export type Uni = InferType<typeof uni>;

// #region Enums Defs ---------------------------------------------------------
enum MyNumEnum {
  UP,
  DOWN,
}

enum MyStrEnum {
  UP = "UP",
  DOWN = "DOWN",
}

enum MyMixEnum {
  UP = "UP",
  DOWN = 1,
}

const MyConstNumEnum = {
  UP: 0,
  DOWN: 1,
} as const;

const MyConstStrEnum = {
  UP: "UP",
  DOWN: "DOWN",
} as const;

const MyConstMixEnum = {
  UP: "UP",
  DOWN: 1,
} as const;
// #endregion -----------------------------------------------------------------

// #region t.enum variantes -------------------------------------------------
const constValues = ["UP", "DOWN"] as const;
const tupleValues: ["UP", "DOWN"] = ["UP", "DOWN"];

export const e1 = t.enum("UP", "DOWN");
export const e2 = t.enum(["UP", "DOWN"]);
export const e3 = t.enum(["UP", "DOWN"] as const);

// export const e4 = t.enum(values); // ts-error: not a constant
export const e5 = t.enum(constValues);
export const e6 = t.enum(tupleValues);

export const e7 = t.enum(MyStrEnum);
export const e8 = t.enum(MyNumEnum);
export const e9 = t.enum(MyMixEnum);

export const e10 = t.enum(MyConstStrEnum);
export const e11 = t.enum(MyConstNumEnum);
export const e12 = t.enum(MyConstMixEnum);

// export const e13 = t.enum(props); // fail without any hint
export const e14 = t.enum({ UP: "UP", DOWN: "DOWN" });
export const e15 = t.enum({ UP: 0, DOWN: 1 });
export const e16 = t.enum({ UP: "UP", DOWN: 1 });
// #endregion -----------------------------------------------------------------

// #region infer enums -------------------------------------------------
export type E1 = InferType<typeof e1>;
export type E2 = InferType<typeof e2>;
export type E3 = InferType<typeof e3>;
// export type E4 = InferType<typeof e4>;
export type E5 = InferType<typeof e5>;
export type E6 = InferType<typeof e6>;
export type E7 = InferType<typeof e7>;
export type E8 = InferType<typeof e8>;
export type E9 = InferType<typeof e9>;
export type E10 = InferType<typeof e10>;
export type E11 = InferType<typeof e11>;
export type E12 = InferType<typeof e12>;
// export type E13 = InferType<typeof e13>;
export type E14 = InferType<typeof e14>;
export type E15 = InferType<typeof e15>;
export type E16 = InferType<typeof e16>;
// #endregion -----------------------------------------------------------------
