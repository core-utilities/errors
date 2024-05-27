import { createErrorClass } from './createErrorClass';
import { resolveMessage } from './resolveMessage';
import type { ErrorClass, Expand } from './types';

type StringWithPlaceholder = `${string}{${string}}${string}`;

type Parse<T extends StringWithPlaceholder> =
  T extends `${infer _Start}{${infer Var}}${infer Rest}`
    ? Rest extends StringWithPlaceholder
      ? Expand<{ [K in Var]: unknown } & Parse<Rest>>
      : { [K in Var]: unknown }
    : never;

export function defineErrors<S extends string, T extends Record<string, S>>(
  input: T,
  BaseClass: ErrorClass<string> = Error,
): {
  [K in keyof T as K extends `${string}Error`
    ? K
    : never]: T[K] extends StringWithPlaceholder
    ? new (params: Parse<T[K]>) => Error
    : new () => Error;
} {
  return Object.fromEntries(
    Object.entries(input).map(([name, message]) => {
      return [
        name,
        createErrorClass<Record<string, unknown>>(name, BaseClass, {
          toMessage: (params) =>
            params ? resolveMessage(message, params) : message,
        }),
      ];
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any;
}
