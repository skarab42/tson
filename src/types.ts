export type CheckType =
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
  | "tuple";

export type Type<TReturn> = { check(input: unknown): TReturn };
export type Schema = Record<string, Type<unknown>>;
export type ObjectType<TReturn> = Type<TReturn> & {
  schema: Schema;
};

export type Unwrap<TInput> = TInput extends Record<string, unknown>
  ? { [Key in keyof TInput]: TInput[Key] }
  : TInput;

export type InferType<TType> = TType extends Type<infer TReturn>
  ? TReturn
  : TType;

export type InferSchema<TSchema extends Schema> = {
  [Key in keyof TSchema]: TSchema[Key] extends Schema
    ? InferSchema<TSchema[Key]>
    : InferType<TSchema[Key]>;
};

export type InferTuple<TTypes extends unknown[]> = InferType<TTypes[number]>;

export type UnwrapTuple<TType extends Type<unknown>[]> = {
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
