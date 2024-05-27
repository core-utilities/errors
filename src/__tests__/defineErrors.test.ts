import { createErrorClass } from '../createErrorClass';
import { defineErrors } from '../defineErrors';

const Errors = defineErrors({
  AbortError: 'The operation was aborted',
  InvalidFieldError: 'Invalid field: {field}',
  InvalidOperationError: 'Cannot do {operation} from state {state}',
});

it('should create an error with the right type and shape', () => {
  const error = new Errors.InvalidFieldError({ field: 'foo' });
  expect(error).toBeInstanceOf(Errors.InvalidFieldError);
  expect(error).toBeInstanceOf(Error);
  expect(error.name).toBe('InvalidFieldError');
  expect(error.message).toBe('Invalid field: foo');
  expect(error.toString()).toBe('InvalidFieldError: Invalid field: foo');
  expect(Object.prototype.toString.call(error)).toBe(
    '[object InvalidFieldError]',
  );
  const error2 = new Errors.InvalidOperationError({
    operation: 'create',
    state: 1,
  });
  expect(error2.message).toBe('Cannot do create from state 1');
  expect(Errors.InvalidFieldError.name).toBe('InvalidFieldError');
});

it('should stringify null/undefined as params', () => {
  const error = new Errors.InvalidOperationError({
    operation: null,
    state: undefined,
  });
  expect(error.message).toBe('Cannot do null from state undefined');
});

it('should not replace missing params', () => {
  // @ts-expect-error - Intentionally omitting params
  const error = new Errors.InvalidOperationError({});
  expect(error.message).toBe('Cannot do {operation} from state {state}');
});

it('should accept base class', () => {
  class ValidationError extends Error {}
  const Errors = defineErrors(
    {
      BadInputError: 'The input was not valid',
      InvalidFieldError: 'Invalid field: {field}',
    },
    ValidationError,
  );
  const error1 = new Errors.BadInputError();
  expect(error1).toBeInstanceOf(Errors.BadInputError);
  expect(error1).toBeInstanceOf(ValidationError);
  expect(error1).toBeInstanceOf(Error);
  const error2 = new Errors.InvalidFieldError({ field: 'foo' });
  expect(error2).toBeInstanceOf(Errors.InvalidFieldError);
  expect(error2).toBeInstanceOf(ValidationError);
  expect(error2).toBeInstanceOf(Error);
});

it('should accept base class created by createErrorClass()', () => {
  const ValidationError = createErrorClass('ValidationError');
  const Errors = defineErrors(
    {
      BadInputError: 'The input was not valid',
      InvalidFieldError: 'Invalid field: {field}',
    },
    ValidationError,
  );
  const error1 = new Errors.BadInputError();
  expect(error1).toBeInstanceOf(Errors.BadInputError);
  expect(error1).toBeInstanceOf(ValidationError);
  expect(error1).toBeInstanceOf(Error);
  const error2 = new Errors.InvalidFieldError({ field: 'foo' });
  expect(error2).toBeInstanceOf(Errors.InvalidFieldError);
  expect(error2).toBeInstanceOf(ValidationError);
  expect(error2).toBeInstanceOf(Error);
});

// Type-only tests
it('should accept correct params', () => {
  // This one doesn't expect any params
  const _err1 = new Errors.AbortError();
  // This one expects a single parameter
  const _err2 = new Errors.InvalidFieldError({ field: 'name' });
  // This one expects two parameters
  const _err3 = new Errors.InvalidOperationError({
    operation: 'update',
    state: 'unmounted',
  });
  // Should allow non-string params
  const _err4 = new Errors.InvalidOperationError({
    operation: 'update',
    state: 1,
  });
});

// Type-only tests
it('should not accept incorrect params', () => {
  if (false) {
    // @ts-expect-error Should not accept arg
    const _err1 = new Errors.AbortError(undefined);
    // @ts-expect-error Should not accept arg
    const _err2 = new Errors.AbortError({});
    // @ts-expect-error Should not accept arg
    const _err3 = new Errors.AbortError({ foo: 1 });
    // @ts-expect-error Should expect arg
    const _err4 = new Errors.InvalidFieldError();
    // @ts-expect-error Should not accept property with wrong name
    const _err5 = new Errors.InvalidFieldError({ foo: 'name' });
    // @ts-expect-error Should not accept extraneous properties
    const _err6 = new Errors.InvalidFieldError({ field: 'name', foo: 'bar' });
    // @ts-expect-error Should not accept too few properties
    const _err7 = new Errors.InvalidOperationError({ operation: 'update' });
    const _err8 = new Errors.InvalidOperationError({
      operation: 'update',
      // @ts-expect-error Should not accept wrong properties
      foo: 1,
    });
  }
});

// Type-only tests
it('should omit (at the type level) any error whose name does not end in Error', () => {
  if (false) {
    const Errors = defineErrors({
      Foo: 'A Foo occurred',
      BarError: 'Some other thing {value}',
    });
    expectTypeOf<keyof typeof Errors>().toEqualTypeOf<'BarError'>();
  }
});
