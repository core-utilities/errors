import { createErrorClass } from '../createErrorClass';

it('should create a class with the right properties and methods', () => {
  const MyCustomError = createErrorClass('MyCustomError');
  expect(MyCustomError.name).toBe('MyCustomError');
  const error = new MyCustomError('Foo happened');
  expect(error).toBeInstanceOf(MyCustomError);
  expect(error).toBeInstanceOf(Error);
  expect(error.name).toBe('MyCustomError');
  expect(error.message).toBe('Foo happened');
  expect(String(error)).toBe('MyCustomError: Foo happened');
  expect(Object.prototype.toString.call(error)).toBe('[object MyCustomError]');
});

it('should be able to be instantiated without a message', () => {
  const FooError = createErrorClass('FooError');
  const error = new FooError();
  expect(error.message).toBe('');
  expect(String(error)).toBe('FooError');
});

it('should accept cause', () => {
  const NetworkError = createErrorClass('NetworkError');
  const FetchError = createErrorClass('FetchError');
  const networkError = new NetworkError('Request timeout');
  const fetchError = new FetchError('Something went wrong', {
    cause: networkError,
  });
  expect(fetchError.message).toBe('Something went wrong');
  expect(fetchError.cause).toBe(networkError);
  expect(String(fetchError)).toBe('FetchError: Something went wrong');
});

it('should accept base class', () => {
  const FooError = createErrorClass('FooError');
  const BarError = createErrorClass('BarError', FooError);
  const barError = new BarError('Something went wrong');
  expect(barError).toBeInstanceOf(BarError);
  expect(barError).toBeInstanceOf(FooError);
  expect(barError).toBeInstanceOf(Error);
});

it('should accept custom toMessage', () => {
  type User = { id: number; name: string };
  const UserError = createErrorClass<User>('UserError', Error, {
    toMessage: (user) =>
      user
        ? `Error with user user ${user.id} ${user.name}`
        : 'Error with unknown user',
  });
  // Can instantiate with no args
  const error1 = new UserError();
  expect(error1.message).toBe('Error with unknown user');
  // Can instantiate with a user
  const error2 = new UserError({ id: 1, name: 'Bob' });
  expect(error2.message).toBe('Error with user user 1 Bob');
  // Type tests
  if (false) {
    // @ts-expect-error - Cannot instantiate with string
    const _error3 = new UserError('');
  }
});
