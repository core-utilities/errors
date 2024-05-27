import type { ErrorClass } from './types';

type Options<T> = {
  toMessage?: (input: T | undefined) => string;
};

export function createErrorClass<T = string>(
  name: string,
  BaseClass: ErrorClass<string> = Error,
  options: Options<T> = {},
): ErrorClass<T> {
  const toMessage =
    options.toMessage ?? (<T>(input: T | undefined) => String(input ?? ''));
  return Object.defineProperties(
    class extends BaseClass {
      constructor(params?: T, options?: ErrorOptions) {
        super(toMessage(params), options);
      }
      get name() {
        return name;
      }
      get [Symbol.toStringTag]() {
        return name;
      }
    },
    {
      // Defining the name property here is necessary because we're using an
      // anonymous class.
      // TypeScript complains if we use a `static get name() { ... }`
      name: { value: name, configurable: true },
    },
  );
}
