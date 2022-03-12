import { TypeParseError } from "../errors";
import { Type } from "../types";
import { instanceOf } from "../util";

export function dateType(): Type<DateConstructor | string> {
  return {
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
