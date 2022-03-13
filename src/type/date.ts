import { TypeParseError } from "../errors";
import { instanceOf } from "../util";
import { helpers } from "../helpers";
import { Type } from "../types";

export function dateType(): Type<DateConstructor | string> {
  return {
    ...helpers(),
    parse(input: unknown): DateConstructor | string {
      if (typeof input === "string") {
        const maybeDate = new Date(input);

        if (Number.isNaN(input) || maybeDate.toString() === "Invalid Date") {
          throw new TypeParseError("Date", input);
        }

        return input;
      }

      return instanceOf<DateConstructor>(Date, input);
    },
  };
}
