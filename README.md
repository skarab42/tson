# tson

**Type Safe Object Notation & Validation** [![Test and Lint](https://github.com/skarab42/tson/actions/workflows/CI.yaml/badge.svg)](https://github.com/skarab42/tson/actions/workflows/CI.yaml)

📌 Work in Progress, not ready for production...

## Features

- 🧱 Fonctional
- 🔷 Immutable
- ✅ Well tested

## Why?

After a contribution to the [tRPC](https://github.com/trpc/trpc) project, I wanted to understand more deeply the use of generics and inference in TypeScript.
I needed a challenge so I set myself the goal of coding my own schema validation library.
This library is heavily inspired by [Zod](https://github.com/colinhacks/zod) (_I try to provide the same API_) but in order to avoid cloning it, I challenged myself to not use any classes.

# Install

```bash
pnpm add @skarab/tson
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
  - [Why?](#why)
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
  - [object(schema)](#objectschema)
  - [union(...type)](#uniontype)
  - [union(type[])](#uniontype-1)
  - [union(type[] as const)](#uniontype-as-const)
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
  - [record(type)](#recordtype)
  - [set(type)](#settype)
  - [set(...type)](#settype-1)
  - [set([type, ...type])](#settype-type)
  - [map(keyType, valueType)](#mapkeytype-valuetype)
  - [map(schema)](#mapschema)
  - [promise(type)](#promisetype)
  - [function()](#function)
  - [function(args)](#functionargs)
  - [function(args, returns)](#functionargs-returns)
  - [function(args, returns, implement)](#functionargs-returns-implement)
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

💔 The following code does not work, TypeScript can not infer array values properly. Use the `as const` workaround to do this.

```ts
const types = [t.string(), t.number(), t.string()];
const tpl = t.tuple(types); // [string, number, string]
```

## tuple(type[] as const)

```ts
const types = [t.string(), t.number(), t.string()] as const;
const tpl = t.tuple(types); // [string, number, string]
```

## object(schema)

```ts
const user = t.object({
  name: t.string(),
  age: t.number(),
  admin: t.boolean(),
});

type User = InferType<typeof user>;
// { name: string, age: number, admin: boolean }
```

## union(...type)

```ts
const uni = t.union(t.string(), t.number()); // string | number
```

## union(type[])

```ts
const tpl = t.union([t.string(), t.number(), t.string()]); // string | number
```

💔 The following code does not work, TypeScript can not infer array values properly. Use the `as const` workaround to do this.

```ts
const types = [t.string(), t.number(), t.string()];
const tpl = t.union(types); // string | number
```

## union(type[] as const)

```ts
const types = [t.string(), t.number(), t.string()] as const;
const tpl = t.union(types); // string | number
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

## record(type)

```ts
t.record(t.string()); // { [x: string]: string }
t.record(t.number()); // { [x: string]: number }
t.record(t.date()); // { [x: string]:  Date }
```

## set(type)

Testing a single type on the entire set

```ts
t.set(t.string()); // Set<string>
```

Testing a union of types on the entire set

```ts
t.set(t.union(t.string(), t.boolean(), t.string())); // Set<string|boolean>
```

## set(...type)

Same as [tuple(...type)](#tupletype) but test if the input is an instance of Set.

## set([type, ...type])

Testing a tuple of types on the Set

```ts
t.set(t.string(), t.boolean(), t.string()); // Set<[string, boolean, string]>
t.set([t.string(), t.boolean(), t.string()]); // Set<[string, boolean, string]>
```

## map(keyType, valueType)

```ts
t.map(t.string(), t.number()); // Map<string, number>
t.map(t.date(), t.string()); // Map<Date, string>
```

## map(schema)

Same as [object(schema)](#objectschema) but test if the input is an instance of Map.

```ts
const map = new Map();

t.map({ name: t.string(), size: t.string() }).parse(map);
```

## promise(type)

```ts
const promise = t.promise(t.number());

await promise.parse(Promise.resolve(42)); // resolve: 42
await promise.parse(Promise.resolve("42")); // reject: expected 'number' got 'string'
await promise.parse(42); // reject: expected 'Promise' got 'number'
```

## function()

```ts
const func = t.function();

type Func = InferType<typeof func>; // () => void
```

## function(args)

```ts
const func = t.function([t.string(), t.number()]);

type Func = InferType<typeof func>; // (arg_0: string, arg_1: number) => void
```

## function(args, returns)

```ts
const func = t.function([t.string()], t.boolean());

type Func = InferType<typeof func>; // (arg_0: string) => boolean
```

## function(args, returns, implement)

```ts
const args = [t.string(), t.boolean()] as const;

const returns = t.union(t.string(), t.number());

const func = t.function(args, returns, (input, toInt) => {
  // input type is string and toInt type is boolean
  return toInt ? parseInt(input) : input.toUpperCase();
});

type Func = InferType<typeof func>; // (arg_0: string, arg_1: boolean) => string | number
```

# Contributing 💜

See [CONTRIBUTING.md](https://github.com/skarab42/tson/blob/main/CONTRIBUTING.md)
