export type ErrorClass<T> = {
  new (input?: T | undefined, options?: ErrorOptions): Error;
};

// This is used to "expand" an intersection of two or more objects when
// displayed in tooltips, for example `Expand<{ a: string } & { b: string }>`
// will expand to `{ a: string, b: string }`
// Reference: https://stackoverflow.com/a/57683652
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
