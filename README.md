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
import { t } from "tson";
```

```ts
const { t } = require("tson");
```

# Examples

```ts
import { t } from "tson";

const name = t.string();

name.check("nyan"); // return "nyan"
name.check(42); // throw TypeCheckError
```

```ts
import { t } from "tson";

const user = t.object({
  name: t.string(),
  age: t.number(),
  admin: t.boolean(),
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

- `null()`
- `unknown()`
- `undefined()`

- `function()`

- `array(type)`
- `tuple(...type)`
- `object(object)`

## ...

- `union(type[])`
- `optional(type)`

# array(type)

```ts
const arr1 = t.array(t.string()); // string[]
const arr2 = t.array(t.boolean()); // boolean[]
```

# tuple(...type)

```ts
const tpl = t.tuple(t.string(), t.number()); // [string, number]
```

# object(object)

```ts
const user = t.object({
  name: t.string(),
  age: t.number(),
  admin: t.boolean(),
});

type User = InferType<typeof user>;
// { name: string, age: number, admin: boolean }
```

# union(type[])

```ts
const uni = t.union(t.string(), t.number()); // string | number
```

# optional(type)

```ts
const user = t.object({
  name: t.string(),
  age: t.optional(t.number()),
});
// { name: string, age?: number }
```

# Contributing 💜

See [CONTRIBUTING.md](https://github.com/skarab42/tson/blob/main/CONTRIBUTING.md)
