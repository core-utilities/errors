import { expectTypeOf } from 'expect-type';

it('should sanity check', () => {
  expect(true).toBeTruthy();
  expectTypeOf<true>().toEqualTypeOf<true>();
});
