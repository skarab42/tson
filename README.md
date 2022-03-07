# tson

Type Safe Object Notation...

📌 Work in Progress, not ready for production...

## Features

- fonctional
- immutable

# Install

```bash
pnpm add @skarab42/tson
```

_`yarn` and `npm` also works_

## ES and CommonJS module

```ts
import * as tson from "tson";
```

```ts
const tson = require("tson");
```

# Examples

```ts
import { string } from "tson";

const name = string();

name.check("nyan"); // return "nyan"
name.check(42); // throw TypeCheckError
```

```ts
import { object, string, number boolean } from "tson";

const user = object({
  name: string(),
  age: number(),
  admin: boolean(),
});

user.check({ name: "nyan", age: 42, admin: true });

type User = InferType<typeof user>;
// { name: string, age: number, admin: boolean }
```

# API

## Types

- `string()`
- `number()`
- `bigint()`
- `boolean()`
- `symbol()`

- `nul()`
- `undef()`
- `unknown()`

- `func()`

- `array(type)`
- `tuple(...type)`
- `object(object)`

## ...

- `union(type[])`
- `optional(type)`

# array(type)

```ts
const arr1 = array(string()); // string[]
const arr2 = array(boolean()); // boolean[]
```

# tuple(...type)

```ts
const tpl = tuple(string(), number()); // [string, number]
```

# object(object)

```ts
const user = object({
  name: string(),
  age: number(),
  admin: boolean(),
});

type User = InferType<typeof user>;
// { name: string, age: number, admin: boolean }
```

# union(type[])

```ts
const uni = union(string(), number()); // string | number
```

# optional(type)

```ts
const user = object({
  name: string(),
  age: optional(number()),
});
// { name: string, age?: number }
```

# Contributing 💜

See [CONTRIBUTING.md](https://github.com/skarab42/tson/blob/main/CONTRIBUTING.md)
