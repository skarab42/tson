import { InferType, Type } from "../types";

export function postprocessType<
  TInput extends Type<InferType<TInput>>,
  TFunc extends (input: InferType<TInput>) => InferType<TInput>,
>(filter: TFunc, inputType: TInput): TInput;

export function postprocessType<
  TInput extends Type<InferType<TInput>>,
  TOutput extends Type<InferType<TOutput>>,
  TFunc extends (input: InferType<TInput>) => InferType<TOutput>,
>(filter: TFunc, inputType: TInput, outputType: TOutput): TOutput;

export function postprocessType<
  TInput extends Type<InferType<TInput>>,
  TOutput extends Type<InferType<TOutput>>,
  TFunc extends (
    input: InferType<TInput>,
  ) => InferType<TInput> | InferType<TOutput>,
>(filter: TFunc, inputType: TInput, outputType?: TOutput) {
  return {
    ...inputType,
    parse(input: unknown) {
      const value = filter(inputType.parse(input));

      if (typeof outputType !== "undefined") {
        return outputType.parse(value);
      }

      return inputType.parse(value);
    },
  };
}
