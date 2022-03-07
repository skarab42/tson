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
