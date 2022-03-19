import { TypeParseError } from "./errors";

export type ParseType =
  | "unknown"
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "bigint"
  | "symbol"
  | "function"
  | "null"
  | "undefined"
  | "array"
  | "tuple"
  | "NaN"
  | "Infinity";

export type SafeParseSuccess<TReturn> = {
  success: true;
  data: TReturn;
};

export type SafeParseError = {
  success: false;
  error: TypeParseError;
};

export type SafeParseReturns<TReturn> =
  | SafeParseSuccess<TReturn>
  | SafeParseError;

export type ProcessFilter<TType = unknown> = (input: TType) => TType;

export type TypeHelpers<TReturn> = {
  safeParse(input: unknown): SafeParseReturns<TReturn>;
  optional(): Type<TReturn | undefined>;
  preprocess(filter: ProcessFilter): Type<TReturn>;
  postprocess(filter: ProcessFilter<TReturn>): Type<TReturn>;
  transform(filter: ProcessFilter<TReturn>): Type<TReturn>;
};

export type TypeBase<TReturn> = {
  parse(input: unknown): TReturn;
};

export type Type<TReturn> = TypeBase<TReturn> & TypeHelpers<TReturn>;

export type Schema = Record<string, Type<unknown>>;
export type ObjectType<TReturn> = Type<TReturn> & {
  schema: Schema;
  strict(): ObjectType<TReturn>;
  strip(): ObjectType<TReturn>;
  passthrough(): ObjectType<TReturn>;
};

export type Unwrap<TInput> = TInput extends Record<string, unknown>
  ? { [Key in keyof TInput]: TInput[Key] }
  : TInput;

export type InferType<TType> = TType extends TypeBase<infer TReturn>
  ? TReturn
  : TType;

export type InferSchema<TSchema extends Schema> = {
  [Key in keyof TSchema]: TSchema[Key] extends Schema
    ? InferSchema<TSchema[Key]>
    : InferType<TSchema[Key]>;
};

export type InferTuple<TTypes extends unknown[]> = InferType<TTypes[number]>;

export type TypeCollection =
  | Type<unknown>[]
  | TypeBase<unknown>[]
  | readonly [TypeBase<unknown>, ...TypeBase<unknown>[]]
  | readonly [Type<unknown>, ...Type<unknown>[]];

export type UnwrapTuple<TType extends TypeCollection> = {
  [Key in keyof TType]: InferType<TType[Key]>;
};

export type ExtractType<TType, TUnion> = {
  [Key in keyof TType]-?: TUnion extends TType[Key] ? Key : never;
}[keyof TType];

export type PickType<TType, TUnion> = Pick<TType, ExtractType<TType, TUnion>>;
export type OmitType<TType, TUnion> = Omit<TType, ExtractType<TType, TUnion>>;

export type PickOptional<TType> = PickType<TType, undefined>;
export type PickRequired<TType> = OmitType<TType, undefined>;

export type PartialClean<TType> = {
  [Key in keyof TType]?: Exclude<TType[Key], undefined>;
};

export type InferOptional<TType> = PartialClean<PickOptional<TType>> &
  PickRequired<TType>;

export type UnwrapOptional<TType> = Unwrap<InferOptional<TType>>;

export type UnwrapSchema<TInputSchema extends Schema> = Unwrap<
  UnwrapOptional<InferSchema<TInputSchema>>
>;

export type Writable<TType> = { -readonly [Key in keyof TType]: TType[Key] };

export type EnumKey = string | number;

export type EnumLike = Record<string, string | number>;

export type EnumValues = readonly [string, ...string[]];

export type EnumOrFirstValue = string | string[] | EnumValues | EnumLike;

export type EnumType<TType, TValues, TUnion> = {
  enum: TType;
  options: TValues;
  parse(input: unknown): TUnion;
} & TypeHelpers<TUnion>;

export type StringEnumRecord<TValues extends EnumValues> = {
  [Key in keyof TValues]: TValues[Key] extends string
    ? Record<TValues[Key], TValues[Key]>
    : never;
};

export type NumberEnumRecord<TValues extends EnumValues> = {
  [Key in keyof TValues]: TValues[Key] extends string
    ? Record<TValues[Key], Key>
    : never;
};

export type EnumRecord<
  TValues extends EnumValues,
  TValue extends EnumKey,
> = TValue extends string
  ? StringEnumRecord<TValues>
  : NumberEnumRecord<TValues>;

export type MergeEnumRecord<TValues> = (
  TValues extends unknown ? (values: TValues) => void : never
) extends (values: infer TType) => void
  ? TType
  : never;

export type FakeEnum<TValues extends EnumValues> = Unwrap<
  Readonly<MergeEnumRecord<InferTuple<Writable<EnumRecord<TValues, string>>>>>
>;

export type Literal =
  | boolean
  | string
  | number
  | bigint
  | symbol
  | null
  | undefined;

export type LiteralType<TReturn> = Type<TReturn> & {
  value: TReturn;
};

export type ClassLike = new (...args: unknown[]) => unknown;

export type MapErrorLocation = "key" | "value";

export type MapParser = (map: Map<unknown, unknown>) => void;

export type AnyFunction = (...args: unknown[]) => void;

export type AssertEqual<TType, TExpected> = [TType] extends [TExpected]
  ? [TExpected] extends [TType]
    ? true
    : false
  : false;

export enum ObjectTypeMode {
  "STRICT",
  "STRIP",
  "PASSTHROUGH",
}

export type { InferType as infer };
