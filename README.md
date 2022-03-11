# tson

**Type Safe Object Notation & Validation**

📌 Work in Progress, not ready for production...

## Features

- 🧱 Fonctional
- 🔷 Immutable
- ✅ Well tested

# Install

```bash
pnpm add @skarab42/tson
```

_`yarn` and `npm` also works_

## ES and CommonJS module

```ts
import { t } from "tson";
```

```ts
const { t } = require("tson");
```

# Examples

```ts
import { t } from "tson";

const name = t.string();

name.parse("nyan"); // return "nyan"
name.parse(42); // throw TypeCheckError
```

```ts
import { t } from "tson";

const user = t.object({
  name: t.string(),
  age: t.number(),
  admin: t.boolean(),
});

user.parse({ name: "nyan", age: 42, admin: true });

type User = InferType<typeof user>;
// { name: string, age: number, admin: boolean }
```

# Table of contents

- [tson](#tson)
  - [Features](#features)
- [Install](#install)
  - [ES and CommonJS module](#es-and-commonjs-module)
- [Examples](#examples)
- [Table of contents](#table-of-contents)
- [API](#api)
  - [string()](#string)
  - [number()](#number)
  - [bigint()](#bigint)
  - [boolean()](#boolean)
  - [symbol()](#symbol)
  - [null()](#null)
  - [unknown()](#unknown)
  - [undefined()](#undefined)
  - [function()](#function)
  - [literal(value)](#literalvalue)
  - [nan()](#nan)
  - [infinity()](#infinity)
  - [finite()](#finite)
  - [integer()](#integer)
  - [unsignedInteger()](#unsignedinteger)
  - [unsignedNumber()](#unsignednumber)
  - [literal(value)](#literalvalue-1)
  - [array(type)](#arraytype)
  - [tuple(...type)](#tupletype)
  - [tuple(type[])](#tupletype-1)
  - [tuple(type[] as const)](#tupletype-as-const)
  - [object(object)](#objectobject)
  - [union(type[ ])](#uniontype-)
  - [optional(type)](#optionaltype)
  - [enum(...string)](#enumstring)
    - [Access enum properties](#access-enum-properties)
    - [Access enum values](#access-enum-values)
    - [Test enum values](#test-enum-values)
    - [Infer enum type](#infer-enum-type)
  - [enum(string[])](#enumstring-1)
  - [enum(string[] as const)](#enumstring-as-const)
  - [enum(object)](#enumobject)
  - [enum(object as const)](#enumobject-as-const)
  - [enum(enum)](#enumenum)
  - [nativeEnum(enum)](#nativeenumenum)
  - [instanceof(type)](#instanceoftype)
  - [date()](#date)
- [Contributing 💜](#contributing-)

# API

## string()

## number()

## bigint()

## boolean()

## symbol()

## null()

## unknown()

## undefined()

## function()

## literal(value)

## nan()

## infinity()

## finite()

## integer()

Alias: `int()`

## unsignedInteger()

Alias: `uinteger()`, `uint()`

## unsignedNumber()

Alias: `unumber()`

## literal(value)

```ts
const life = t.literal(42);
const love = t.literal(true);
const name = t.literal("nyan");

life.value; // type => 42
```

## array(type)

```ts
const arr1 = t.array(t.string()); // string[]
const arr2 = t.array(t.boolean()); // boolean[]
```

## tuple(...type)

```ts
const tpl = t.tuple(t.string(), t.number(), t.string()); // [string, number, string]
```

## tuple(type[])

```ts
const tpl = t.tuple([t.string(), t.number(), t.string()]); // [string, number, string]
```

💔 The following code does not work, TypeScript can not infer tuple values properly. Use the `as const` workaround to do this.

```ts
const types = [t.string(), t.number(), t.string()];
const tpl = t.tuple(types); // [string, number, string]
```

## tuple(type[] as const)

```ts
const types = [t.string(), t.number(), t.string()] as const;
const tpl = t.tuple(types); // [string, number, string]
```

## object(object)

```ts
const user = t.object({
  name: t.string(),
  age: t.number(),
  admin: t.boolean(),
});

type User = InferType<typeof user>;
// { name: string, age: number, admin: boolean }
```

## union(type[ ])

```ts
const uni = t.union(t.string(), t.number()); // string | number
```

## optional(type)

```ts
const user = t.object({
  name: t.string(),
  age: t.optional(t.number()),
});
// { name: string, age?: number }
```

## enum(...string)

```ts
const myEnum = t.enum("UP", "DOWN", "LEFT", "RIGHT");
```

### Access enum properties

```ts
myEnum.enum.UP; // === "UP"
myEnum.enum.PLOP; // error: PLOP does not exists
myEnum.enum.DOWN = "prout"; // error: it is read-only

(property) enum: {
  readonly UP: "UP";
  readonly DOWN: "DOWN";
  readonly LEFT: "LEFT";
  readonly RIGHT: "RIGHT";
}
```

### Access enum values

```ts
myEnum.options[1]; // === "DOWN"

(property) options: ["UP", "DOWN", "LEFT", "RIGHT"]
```

### Test enum values

```ts
myEnum.parse(myEnum.enum.LEFT); // => "LEFT"
myEnum.parse("LEFT"); // => "LEFT"
myEnum.parse("2"); // => "LEFT"
myEnum.parse(2); // => "LEFT"
myEnum.parse("PLOP"); // error: expected '0|1|2|3|UP|DOWN|LEFT|RIGHT' got 'string'
```

### Infer enum type

```ts
type MyEnum = InferType<typeof myEnum>; // => "UP" | "DOWN" | "LEFT" | "RIGHT"

function move(direction: MyEnum) {
  // direction === "DOWN"
}

move(myEnum.enum.DOWN);
```

## enum(string[])

```ts
const myEnum = t.enum(["UP", "DOWN", "LEFT", "RIGHT"]);
```

💔 The following code does not work, TypeScript can not infer array values properly. Use the `as const` workaround to do this.

```ts
const values = ["UP", "DOWN", "LEFT", "RIGHT"];
const myEnum = t.enum(values);
```

## enum(string[] as const)

```ts
const myEnum = t.enum(["UP", "DOWN", "LEFT", "RIGHT"] as const);
```

```ts
const values = ["UP", "DOWN", "LEFT", "RIGHT"] as const;
const myEnum = t.enum(values);
```

## enum(object)

```ts
const myEnum = t.enum({ UP: "UP", DOWN: "DOWN", LEFT: 42, RIGHT: 43 });
```

💔 The following code does not work, TypeScript can not infer object properties properly. Use the `as const` workaround to do this.

```ts
const values = { UP: "UP", DOWN: "DOWN", LEFT: 42, RIGHT: 43 };
const myEnum = t.enum(values);
```

## enum(object as const)

```ts
const values = { UP: "UP", DOWN: "DOWN", LEFT: 42, RIGHT: 43 } as const;
const myEnum = t.enum(values);
```

## enum(enum)

```ts
enum MyEnum {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = 42,
  RIGHT,
}

const myEnum = t.enum(MyEnum);
```

## nativeEnum(enum)

Alias: `enum(enum)`

```ts
enum MyEnum {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = 42,
  RIGHT,
}

const myEnum = t.nativeEnum(MyEnum);
```

## instanceof(type)

```ts
class MyClass {}

const instance = new MyClass();

t.instanceof(MyClass).parse(instance); // passes
t.instanceof(MyClass).parse("nyan"); // fail
```

## date()

```ts
t.date().parse(new Date()); // passes
t.date().parse("2022-01-12T00:00:00.000Z"); // passes
t.date().parse("not a string date"); // fail
```

# Contributing 💜

See [CONTRIBUTING.md](https://github.com/skarab42/tson/blob/main/CONTRIBUTING.md)
