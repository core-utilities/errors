export const hasOwn =
  Object.hasOwn ??
  ((o: object, v: PropertyKey) => Object.prototype.hasOwnProperty.call(o, v));
