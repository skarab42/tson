import {
  boolean,
  number,
  object,
  optional,
  string,
  union,
  unknown,
} from "../src";
import { InferType } from "../src/types";

const unk = unknown();
const str = string();
const num = number();
const boo = boolean();

const uni = union([str, num, boo, optional(str)]);

// const life = uni.check(42);

const data = object({
  desc: optional(string()),
  root: boolean(),
  uni,
});

const obj = object({
  name: str,
  size: optional(num),
  desc: string(),
  data,
  data2: optional(
    object({
      desc: string(),
      root: boolean(),
    }),
  ),
  plus: object({
    desc2: string(),
    root2: boolean(),
    plus2: object({
      desc2: optional(string()),
      root2: boolean(),
    }),
  }),
});

export type Unk = InferType<typeof unk>;
export type Str = InferType<typeof str>;
export type Num = InferType<typeof num>;
export type Boo = InferType<typeof boo>;
export type Obj = InferType<typeof obj>;
export type Uni = InferType<typeof uni>;
