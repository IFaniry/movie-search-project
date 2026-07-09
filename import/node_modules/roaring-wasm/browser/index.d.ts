declare enum SerializationFormat {
  /**
   * Stable Optimized non portable C/C++ format. Used by croaring. Can be smaller than the portable format.
   */
  croaring = "croaring",
  /**
   * Stable Portable Java and Go format.
   */
  portable = "portable",
  /**
   * Non portable C/C++ frozen format.
   * Is considered unsafe and unstable because the format might change at any new version.
   * Can be useful for temporary storage or for sending data over the network between similar machines.
   * If the content is corrupted when deserialized or when a frozen view is create, the behavior is undefined!
   * The application may crash, buffer overrun, could be a vector of attack!
   *
   * When this option is used in the serialize function, the new returned buffer (if no buffer was provided) will be aligned to a 32 bytes boundary.
   * This is required to create a frozen view with the method unsafeFrozenView.
   *
   */
  unsafe_frozen_croaring = "unsafe_frozen_croaring",
  /**
   * A plain binary array of 32 bits integers in little endian format. 4 bytes per value.
   */
  uint32_array = "uint32_array",
}
type SerializationFormatType =
  | SerializationFormat
  | "croaring"
  | "portable"
  | "unsafe_frozen_croaring"
  | "uint32_array"
  | boolean;
declare enum DeserializationFormat {
  /** Stable Optimized non portable C/C++ format. Used by croaring. Can be smaller than the portable format. */
  croaring = "croaring",
  /** Stable Portable Java and Go format. */
  portable = "portable",
  /**
   * Non portable C/C++ frozen format.
   * Is considered unsafe and unstable because the format might change at any new version.
   * Can be useful for temporary storage or for sending data over the network between similar machines.
   * If the content is corrupted when loaded or the buffer is modified when a frozen view is create, the behavior is undefined!
   * The application may crash, buffer overrun, could be a vector of attack!
   */
  unsafe_frozen_croaring = "unsafe_frozen_croaring",
  /**
   * Portable version of the frozen view, compatible with Go and Java.
   * Is considered unsafe and unstable because the format might change at any new version.
   * Can be useful for temporary storage or for sending data over the network between similar machines.
   * If the content is corrupted when loaded or the buffer is modified when a frozen view is create, the behavior is undefined!
   * The application may crash, buffer overrun, could be a vector of attack!
   */
  unsafe_frozen_portable = "unsafe_frozen_portable",
  /**
   * A plain binary array of 32 bits integers in little endian format. 4 bytes per value.
   */
  uint32_array = "uint32_array",
}
type DeserializationFormatType =
  | DeserializationFormat
  | "croaring"
  | "portable"
  | "unsafe_frozen_croaring"
  | "unsafe_frozen_portable"
  | "uint32_array"
  | boolean;
type SerializationDeserializationFormatType = SerializationFormatType &
  DeserializationFormatType;
type SerializationDeserializationFormat =
  SerializationDeserializationFormatType;

interface IDisposable {
  dispose(): boolean | void;
}
type UnsafeAny = any;
/**
 * Checks if the given value is an instance of `IDisposable`.
 * Returns true only if value is a non null object and has a method "dispose"
 * @param value The value to check.
 * @returns true if the value is an instance of `IDisposable`, false otherwise.
 */
declare const isDisposable: (value: unknown) => value is IDisposable;
/**
 * Disposes the given IDisposable instance.
 * @param disposable The object to dispose.
 * @returns true if the object was disposed, false otherwise.
 */
declare const dispose: (disposable: IDisposable | null | undefined) => boolean;
/**
 * Disposes the IDisposable passed as "this".
 * @example
 * ```ts
 * const disposable: IDisposable = ...;
 * const disposeFn = disposeThis.bind(disposable);
 * disposeFn();
 * ```
 * @returns true if the object was disposed, false otherwise.
 */
declare function disposeThis(this: IDisposable | null | undefined): boolean;
/**
 * Tries to dispose the given object.
 * Does not throw and eats the exception if any.
 * @param disposable The object to dispose or a promise of the object to dispose.
 * @returns true if the object was disposed, false otherwise.
 */
declare const tryDispose: (
  disposable: IDisposable | null | undefined,
) => boolean;
declare const using: {
  <
    TFn extends (disposable: TDisposable) => UnsafeAny,
    TDisposable extends Readonly<IDisposable> | null | undefined = IDisposable,
  >(
    disposable: TDisposable,
    what: TFn,
  ): ReturnType<TFn> extends never
    ? never
    : ReturnType<TFn> extends PromiseLike<Awaited<infer TReturn>>
      ? Promise<TReturn>
      : ReturnType<TFn>;
  <
    TValue,
    TDisposable extends Readonly<IDisposable> | null | undefined = IDisposable,
  >(
    disposable: TDisposable,
    what: TValue,
  ): TValue extends never
    ? never
    : TValue extends PromiseLike<Awaited<infer TReturn>>
      ? Promise<TReturn>
      : TValue;
};
declare const disposeAll: (
  ...disposables: readonly (
    | readonly (
        | IDisposable
        | null
        | undefined
        | false
        | readonly (IDisposable | null | undefined | false)[]
      )[]
    | IDisposable
    | null
    | undefined
    | false
  )[]
) => number;

/**
 * In browser, roaring library initialization is done asynchronously, this method returns true after roaring library WASM is initialized.
 * The library cannot be used until this function returns true.
 * You can await initialization with roaringLibraryInitialize function that returns a promise.
 * @returns true if roaring library WASM is initialized.
 */
declare const roaringLibraryIsReady: () => boolean;
/**
 * In browser, roaring library initialization is done asynchronously, this method returns a promise that resolves when roaring library WASM is initialized.
 * The library cannot be used until this promise is resolved.
 * @returns a promise that resolves when roaring library WASM is initialized.
 * @example
 * await roaringLibraryInitialize();
 * const bitmap = new RoaringBitmap32([123]);
 * console.log(bitmap.toArray()); // [123]
 */
declare const roaringLibraryInitialize: () => Promise<void>;

declare class RoaringBitmap32Iterator
  implements IDisposable, IterableIterator<number>
{
  #private;
  constructor(
    bitmap?: RoaringBitmap32 | null,
    arenaAllocator?: RoaringArenaAllocator | null,
  );
  get isDisposed(): boolean;
  get value(): number | undefined;
  get done(): boolean;
  return(_value?: unknown): IteratorResult<number>;
  throw(e?: unknown): IteratorResult<number> | never;
  [Symbol.iterator](): IterableIterator<number>;
  clone(
    allocator?: RoaringArenaAllocator | null | undefined,
  ): RoaringBitmap32Iterator;
  next(): IteratorResult<number>;
  reset(): this;
  moveToGreaterEqual(minimumValue: number): this;
  dispose(): boolean;
}

interface ReadonlyRoaringBitmap32 {
  /**
   * The number of values in the set.
   * Alias to this.size
   */
  get length(): number;
  /**
   * Checks whether the given value is contained in the set.
   *
   * @param value - The value to look for.
   * @returns True if value exists in the set, false if not.
   */
  includes(value: unknown): boolean;
  /**
   * Checks whether the given value is contained in the set.
   *
   * @param value - The value to look for.
   * @returns True if value exists in the set, false if not.
   */
  contains(value: unknown): boolean;
  /**
   * Serializes a bitmap to a typed Uint8Array.
   * The returned array is automatically garbage collected and there is no need to be disposed manually.
   *
   * @param format - The serialization format.
   * @returns The Uint8Array that contains the serialized bitmap
   */
  serialize(format: SerializationFormatType): Uint8Array;
  /**
   * Serializes a bitmap to a typed Uint8Array.
   * The returned array is automatically garbage collected and there is no need to be disposed manually.
   *
   * @param format - The serialization format.
   * @param output - The output that will contain the serialized bitmap. If not provided, a new array is created.
   * @returns The Uint8Array that contains the serialized bitmap
   */
  serialize<
    TOutput extends
      | Uint8Array
      | RoaringUint8Array
      | typeof RoaringUint8Array = Uint8Array,
  >(
    format: SerializationFormatType,
    output: TOutput,
  ): TOutput extends RoaringUint8Array
    ? RoaringUint8Array
    : TOutput extends typeof RoaringUint8Array
      ? RoaringUint8Array
      : Uint8Array;
  /**
   * Serializes a bitmap to a typed Uint8Array.
   * The returned array is automatically garbage collected and there is no need to be disposed manually.
   *
   * @param output - The Uint8Array that will contain the serialized bitmap.
   * @param format - The serialization format.
   * @returns The Uint8Array that contains the serialized bitmap
   */
  serialize<TOutput extends Uint8Array | RoaringUint8Array = Uint8Array>(
    output: TOutput,
    format: SerializationFormatType,
  ): TOutput extends RoaringUint8Array ? RoaringUint8Array : Uint8Array;
  /**
   * Serializes a bitmap to a byte buffer allocated in WASM memory.
   *
   * The returned RoaringUint8Array is allocated in WASM memory and not garbage collected,
   * it should to be freed manually calling dispose() as soon as possible.
   *
   * @param format - The serialization format.
   * @returns The RoaringUint8Array, a buffer allocated in WASM memory.
   */
  serializeToRoaringUint8Array(
    format: SerializationFormatType,
    output?: RoaringUint8Array,
  ): RoaringUint8Array;
  /**
   * A number that changes every time the bitmap might have changed.
   * Do not make assumptions about the value of this property, it is not guaranteed to be sequential.
   * The value might change after some operations also if the content of the bitmap does not change, because it would be too expensive to check if the content changed.
   * This property is useful to check if the bitmap changed since the last time you checked it.
   */
  get v(): number;
  /**
   * Returns true if this instance was disposed.
   * A disposed bitmap cannot be used anymore.
   */
  get isDisposed(): boolean;
  /**
   * Property. True if the bitmap is read-only.
   * A read-only bitmap cannot be modified, every operation will throw an error.
   * You can freeze a bitmap using the freeze() method.
   * A bitmap cannot be unfrozen.
   */
  get isFrozen(): boolean;
  /**
   * Get the cardinality of the bitmap (number of elements).
   */
  get size(): number;
  /**
   * Returns true if the bitmap has no elements.
   */
  get isEmpty(): boolean;
  [Symbol.iterator](): RoaringBitmap32Iterator;
  /**
   * Throws an exception if this object was disposed before.
   */
  throwIfDisposed(): void | never;
  /**
   * Returns a new bitmap that is a copy of this bitmap, same as new ReadonlyRoaringBitmap32(copy)
   * @returns A cloned RoaringBitmap32 instance
   */
  clone(): RoaringBitmap32;
  /**
   * Check whether a range of values from rangeStart (included) to rangeEnd (excluded) is present
   *
   * @param rangeStart - The start value (inclusive).
   * @param rangeEnd - The end value (exclusive).
   * @returns True if the bitmap contains the whole range of values from rangeStart (included) to rangeEnd (excluded), false if not.
   * @memberof ReadonlyRoaringBitmap32
   */
  hasRange(
    rangeStart?: number | undefined,
    rangeEnd?: number | undefined,
  ): boolean;
  /**
   * Gets the cardinality (number of elements) between rangeStart (included) to rangeEnd (excluded) of the bitmap.
   * Returns 0 if range is invalid or if no element was found in the given range.
   *
   * @param rangeStart - The start value (inclusive).
   * @param rangeEnd - The end value (exclusive).
   * @returns The number of elements between rangeStart (included) to rangeEnd (excluded).
   */
  rangeCardinality(
    rangeStart?: number | undefined,
    rangeEnd?: number | undefined,
  ): number;
  /**
   * Gets the minimum value stored in the bitmap.
   * If the bitmap is empty, returns 0xFFFFFFFF
   *
   * @returns The minimum 32 bit unsigned integer or 0xFFFFFFFF if empty.
   */
  minimum(): number;
  /**
   * Gets the maximum value stored in the bitmap.
   * If the bitmap is empty, returns 0.
   *
   * @returns The maximum 32 bit unsigned integer or 0 if empty.
   */
  maximum(): number;
  /**
   * Checks whether the given value is contained in the set.
   *
   * @param value - The value to look for.
   * @returns True if value exists in the set, false if not.
   */
  has(value: unknown): boolean;
  /**
   * Returns true if the bitmap is subset of the other.
   *
   * @param other - the other bitmap
   * @returns true if the bitmap is subset of the other.
   */
  isSubset(other: ReadonlyRoaringBitmap32): boolean;
  /**
   * Returns true if this bitmap is strict subset of the other.
   *
   * @param other - The other bitmap
   * @returns True if this bitmap is a strict subset of other
   */
  isStrictSubset(other: ReadonlyRoaringBitmap32): boolean;
  /**
   * Converts the bitmap to a JS Uint32Array.
   * The resulting array may be very big, use this function with caution.
   *
   * @param output - The output Uint32Array. If not specified, a new array is created.
   * If the output array is too small, only the first values that fit are written.
   * If the output array is too big, the remaining values are left untouched and a new subarray is returned.
   * If is a number, a new array of the specified size is created.
   * @param maxLength - The optional maximum number of values to read from the bitmap and write in the array.
   * @returns The Uint32Array containing all values in the bitmap.
   */
  toUint32Array(output?: Uint32Array | number | undefined): Uint32Array;
  /**
   * Converts the bitmap to a JS array.
   * The resulting array may be very big, use this function with caution.
   *
   * @returns The array containing all values in the bitmap.
   */
  toArray(): number[];
  /**
   * Converts the bitmap to a JS array.
   * The resulting array may be very big, use this function with caution.
   *
   * @param maxLength - The maximum length of the output array.
   * @returns The array containing all values in the bitmap.
   */
  toArray(maxLength: number): number[];
  /**
   * Append all items in the bitmap to a JS array.
   * The resulting array may be very big, use this function with caution.
   *
   * @param output - The output array. If not specified, a new array is created.
   * @param maxLength - The optional maximum number of values to read from the bitmap and push in the array.
   * @returns The array containing all values in the bitmap.
   */
  toArray(output: number[], maxLength?: number | undefined): number[];
  /**
   * Converts the bitmap to a JS Set<number>.
   * The resulting set may be very big, use this function with caution.
   *
   * @param output - The output Set. If not specified, a new Set is created.
   * @param maxLength - The optional maximum number of values to read from the bitmap and add in the set.
   * @returns The set containing all values in the bitmap.
   */
  toSet(
    output?: Set<number> | undefined,
    maxLength?: number | undefined,
  ): Set<number>;
  /**
   * Converts the bitmap to a string in the format "1,2,3,4,5".
   * The resulting string may be very big, use this function with caution.
   *
   * @param sepatator - The optional separator to use between values, defaults to ",".
   * @param maxStringLength - The optional approximate maximum number of characters the output string can contain.
   */
  join(
    sepatator?: string | undefined,
    maxStringLength?: number | undefined,
  ): string;
  /**
   * Converts a range of the bitmap to a Uint32Array.
   * The resulting array may be very big, use this function with caution.
   *
   * @param minimumValue - The range start value (inclusive).
   * @param maximumValue - The range end value (exclusive).
   * @param output - The output array. If not specified, a new array is created.
   * @returns The array containing all values within the given range in the bitmap.
   */
  rangeUint32Array(
    minimumValue?: number | undefined,
    maximumValue?: number | undefined,
    output?: Uint32Array | undefined,
  ): Uint32Array;
  /**
   * Converts a range of the bitmap to an JS Array.
   * The resulting array may be very big, use this function with caution.
   *
   * @param minimumValue - The range start value (inclusive).
   * @param maximumValue - The range end value (exclusive).
   * @param output - The output array. If not specified, a new array is created.
   * @returns The array containing all values within the given range in the bitmap.
   */
  rangeArray(
    minimumValue?: number | undefined,
    maximumValue?: number | undefined,
    output?: number[] | undefined,
  ): number[];
  /**
   * Converts a range of the bitmap to a Set.
   * The resulting set may be very big, use this function with caution.
   *
   * @param minimumValue - The range start value (inclusive).
   * @param maximumValue - The range end value (exclusive).
   * @param output - The output set. If not specified, a new set is created.
   * @returns The set containing all values within the given range in the bitmap.
   */
  rangeSet(
    minimumValue?: number | undefined,
    maximumValue?: number | undefined,
    output?: Set<number> | undefined,
  ): Set<number>;
  /**
   * Converts a range of the bitmap to a string in the form "1,2,3,4,5".
   * The resulting string may be very big, use this function with caution.
   *
   * @param minimumValue - The range start value (inclusive).
   * @param maximumValue - The range end value (exclusive).
   * @param separator - The separator to use between values. Defaults to ",".
   * @returns The string containing all values within the given range in the bitmap.
   */
  rangeJoin(
    minimumValue?: number | undefined,
    maximumValue?: number | undefined,
    separator?: string | undefined,
  ): string;
  /**
   * Converts a slice, define by start index (included) and end index (excluded) of the bitmap to a Uint32Array.
   * The resulting array may be very big, use this function with caution.
   *
   * @param start - The slice start index (inclusive).
   * @param end - The slice end index (exclusive).
   * @param output - The output array. If not specified, a new array is created.
   * @returns The array containing all values within the given slice in the bitmap.
   */
  sliceUint32Array(
    start?: number | undefined,
    end?: number | undefined,
    output?: Uint32Array | undefined,
  ): Uint32Array;
  /**
   * Converts a slice, define by start index (included) and end index (excluded) of the bitmap to a number array.
   * The resulting array may be very big, use this function with caution.
   *
   * @param start - The slice start index (inclusive).
   * @param end - The slice end index (exclusive).
   * @param output - The output array. If not specified, a new array is created.
   * @returns The array containing all values within the given slice in the bitmap.
   */
  sliceArray(
    start?: number | undefined,
    end?: number | undefined,
    output?: number[] | undefined,
  ): number[];
  /**
   * Converts a slice, define by start index (included) and end index (excluded) of the bitmap to a Set.
   * The resulting set may be very big, use this function with caution.
   *
   * @param start - The slice start index (inclusive).
   * @param end - The slice end index (exclusive).
   * @param output - The output set. If not specified, a new set is created.
   * @returns The set containing all values within the given slice in the bitmap.
   */
  sliceSet(
    start?: number | undefined,
    end?: number | undefined,
    output?: Set<number> | undefined,
  ): Set<number>;
  /**
   * Converts a slice, define by start index (included) and end index (excluded) of the bitmap to a string in the form "1,2,3,4,5".
   * The resulting string may be very big, use this function with caution.
   *
   * @param start - The slice start index (inclusive).
   * @param end - The slice end index (exclusive).
   * @param separator - The separator to use between values. Defaults to ",".
   * @returns The string containing all values within the given slice in the bitmap.
   */
  sliceJoin(
    start?: number | undefined,
    end?: number | undefined,
    separator?: string | undefined,
  ): string;
  /**
   * Checks wether two roaring bitmap contains the same data.
   *
   * @param other - The other bitmap.
   * @returns True if the bitmaps contains the same data, false if not.
   */
  isEqual(other: ReadonlyRoaringBitmap32): boolean;
  /**
   * If the size of the roaring bitmap is strictly greater than rank, then
   * this function returns the element of given rank.
   * Otherwise, it returns NaN.
   *
   * @param rank - Element rank
   * @returns element or NaN
   */
  select(rank: number): number;
  /**
   * The at() method takes an integer value and returns the item at that index,
   * allowing for positive and negative integers. Negative integers count back from the last item in the set.
   *
   * @param index Zero-based index of the array element to be returned, converted to an integer. Negative index counts back from the end of the array — if index < 0, index + array.length is accessed.
   * @returns The element in the set matching the given index. Always returns undefined if index < -array.length or index >= array.length without attempting to access the corresponding property.
   */
  at(index: number): number | undefined;
  /**
   * Finds the index of the nth set element.
   * Returns -1 if not found.
   *
   * @param value - Element value
   * @returns element index or -1 if not found
   */
  indexOf(value: number): number;
  /**
   * Computes the size of the intersection between two bitmaps.
   * Both bitmaps are unchanged.
   *
   * @param other - The other bitmap.
   * @returns Cardinality of the intersection between two bitmaps.
   */
  andCardinality(other: ReadonlyRoaringBitmap32): number;
  /**
   * Computes the size of the union of two bitmaps.
   * Both bitmaps are unchanged.
   *
   * @param other - The other bitmap.
   * @returns Cardinality of the union of two bitmaps.
   */
  orCardinality(other: ReadonlyRoaringBitmap32): number;
  /**
   * Computes the size of the difference (andnot) of two bitmaps.
   * Both bitmaps are unchanged.
   *
   * @param other - The other bitmap.
   * @returns Cardinality of the difference (andnot) of two bitmaps.
   */
  andNotCardinality(other: ReadonlyRoaringBitmap32): number;
  /**
   * Computes the size of the symmetric difference (xor) between two bitmaps.
   * Both bitmaps are unchanged.
   *
   * @param other - The other bitmap.
   * @returns Cardinality of the symmetric difference (xor) of two bitmaps.
   */
  xorCardinality(other: ReadonlyRoaringBitmap32): number;
  /**
   * Returns the number of integers that are smaller or equal to the given value.
   *
   * @param value - The value to rank
   * @returns The number of values smaller than the given value
   */
  rank(value: number): number;
  /**
   * Check whether the two bitmaps intersect (have at least one element in common).
   *
   * @param other - The other bitmap.
   * @returns True if the two bitmaps intersects, false if not.
   */
  intersects(other: ReadonlyRoaringBitmap32): boolean;
  /**
   * Check whether a bitmap and a closed range intersect.
   *
   * @param rangeStart The start of the range.
   * @param rangeEnd The end of the range.
   * @returns boolean True if the bitmap and the range intersects, false if not.
   */
  intersectsWithRange(
    rangeStart?: number | undefined,
    rangeEnd?: number | undefined,
  ): boolean;
  /**
   * Computes the Jaccard index between two bitmaps.
   * (Also known as the Tanimoto distance, or the Jaccard similarity coefficient)
   * See https://en.wikipedia.org/wiki/Jaccard_index
   *
   * The Jaccard index is undefined if both bitmaps are empty.
   *
   * @returns The Jaccard index
   */
  jaccardIndex(other: ReadonlyRoaringBitmap32): number;
}

type BasicTypedArray =
  | Int8Array
  | Uint8ClampedArray
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

interface RoaringBitmap32
  extends IDisposable,
    ReadonlyRoaringBitmap32,
    Iterable<number> {
  /**
   * The number of values in the set.
   * Alias to this.size
   */
  get length(): number;
  /**
   * Checks whether the given value is contained in the set.
   *
   * @param value - The value to look for.
   * @returns True if value exists in the set, false if not.
   */
  includes(value: unknown): boolean;
  /**
   * Checks whether the given value is contained in the set.
   *
   * @param value - The value to look for.
   * @returns True if value exists in the set, false if not.
   */
  contains(value: unknown): boolean;
  /**
   * Removes a value from the set checking if the bitmap changes.
   * Use remove() if you don't need to know if something changed.
   * If the value does not exists, this function does nothing and returns false.
   *
   * Alias to delete.
   *
   * @param value - 32 bit unsigned integer to remove from the set.
   * @returns True if the bitmap changed, false if not.
   * @throws If the bitmap is frozen.
   */
  remove(value: number): boolean;
}
/**
 * A Roaring Bitmap that supports 32 bit unsigned integers.
 *
 * The roaring bitmap allocates in WASM memory, remember to dispose
 * the RoaringBitmap32 when not needed anymore to release WASM memory.
 *
 */
declare class RoaringBitmap32 {
  #private;
  static from(
    values:
      | ReadonlyRoaringBitmap32
      | BasicTypedArray
      | Iterable<number | null | undefined | false | string>
      | readonly (number | null | undefined | false | string)[]
      | null
      | undefined,
  ): RoaringBitmap32;
  /**
   * The RoaringBitmap32.of() static method creates a new Array instance from a variable number of arguments, regardless of number or type of the arguments.
   * Note that is faster to pass a Uint32Array instance instead of an array or an iterable.
   *
   * @static
   * @param values A set of values to add to the new RoaringBitmap32 instance.
   * @returns A new RoaringBitmap32 instance.
   */
  static of(
    ...values: (number | string | null | false | undefined)[]
  ): RoaringBitmap32;
  /**
   * Creates a new bitmap that contains all the values in the interval: [rangeStart, rangeEnd).
   * Is possible to specify the step parameter to have a non contiguous range.
   *
   * @static
   * @param rangeStart The start value. Trimmed to 0.
   * @param rangeEnd The end value, excluded. Trimmed to 4294967296.
   * @param step The increment step, defaults to 1.
   * @returns A new RoaringBitmap32 instance.
   */
  static fromRange(
    rangeStart?: number,
    rangeEnd?: number,
    step?: number,
  ): RoaringBitmap32;
  /**
   * addOffset adds the value 'offset' to each and every value in a bitmap, generating a new bitmap in the process.
   * If offset + element is outside of the range [0,2^32), that the element will be dropped.
   *
   * @param input - The input bitmap.
   * @param offset - The offset to add to each element. Can be positive or negative.
   * @returns A new bitmap with the offset added to each element.
   */
  static addOffset(
    input: ReadonlyRoaringBitmap32,
    offset: number,
  ): RoaringBitmap32;
  /**
   * Creates a new bitmap with the content of the input bitmap but with given range of values flipped.
   * @param input The input bitmap, it will not be modified
   * @param rangeStart The start index (inclusive).
   * @param rangeEnd The end index (exclusive).
   * @returns A new copied bitmap with the range flipped.
   */
  static flipRange(
    input: ReadonlyRoaringBitmap32,
    rangeStart: number,
    rangeEnd: number,
  ): RoaringBitmap32;
  /**
   * Creates a new roaring bitmap deserializing it from a buffer
   *
   * The roaring bitmap allocates in WASM memory, remember to dispose
   * the RoaringBitmap32 when not needed anymore to release WASM memory.
   *
   * @param buffer - The buffer to deserialize
   * @param portable - If true, deserialization is compatible with the Java and Go versions of the library.
   * If false, deserialization is compatible with the C version of the library. Default is false.
   * @returns The reulting bitmap. Remember to dispose the instance when finished using it.
   */
  static deserialize(
    format: DeserializationFormatType,
    buffer: RoaringUint8Array | Uint8Array,
  ): RoaringBitmap32;
  /**
   * Creates a new roaring bitmap deserializing it from a buffer
   *
   * The roaring bitmap allocates in WASM memory, remember to dispose
   * the RoaringBitmap32 when not needed anymore to release WASM memory.
   *
   * @param buffer - The buffer to deserialize
   * @param portable - If true, deserialization is compatible with the Java and Go versions of the library.
   * If false, deserialization is compatible with the C version of the library. Default is false.
   * @returns The reulting bitmap. Remember to dispose the instance when finished using it.
   */
  static deserialize(
    buffer: RoaringUint8Array | Uint8Array,
    format: DeserializationFormatType,
  ): RoaringBitmap32;
  /**
   * Creates a new roaring bitmap deserializing it from a buffer
   *
   * The roaring bitmap allocates in WASM memory, remember to dispose
   * the RoaringBitmap32 when not needed anymore to release WASM memory.
   *
   * @param buffer - The buffer to deserialize
   * @param portable - If true, deserialization is compatible with the Java and Go versions of the library.
   * If false, deserialization is compatible with the C version of the library. Default is false.
   * @returns The reulting bitmap. Remember to dispose the instance when finished using it.
   */
  deserialize(
    format: DeserializationFormatType,
    buffer: RoaringUint8Array | Uint8Array,
  ): this;
  /**
   * Creates a new roaring bitmap deserializing it from a buffer
   *
   * The roaring bitmap allocates in WASM memory, remember to dispose
   * the RoaringBitmap32 when not needed anymore to release WASM memory.
   *
   * @param buffer - The buffer to deserialize
   * @param portable - If true, deserialization is compatible with the Java and Go versions of the library.
   * If false, deserialization is compatible with the C version of the library. Default is false.
   * @returns The reulting bitmap. Remember to dispose the instance when finished using it.
   */
  deserialize(
    buffer: RoaringUint8Array | Uint8Array,
    format: DeserializationFormatType,
  ): this;
  /**
   * How many bytes are required to serialize this bitmap.
   *
   * @param format - The serialization format.
   */
  getSerializationSizeInBytes(format: SerializationFormatType): number;
  /**
   * Serializes a bitmap to a typed Uint8Array.
   * The returned array is automatically garbage collected and there is no need to be disposed manually.
   *
   * @param format - The serialization format.
   * @returns The Uint8Array that contains the serialized bitmap
   */
  serialize(format: SerializationFormatType): Uint8Array;
  /**
   * Serializes a bitmap to a typed Uint8Array.
   * The returned array is automatically garbage collected and there is no need to be disposed manually.
   *
   * @param format - The serialization format.
   * @param output - The output that will contain the serialized bitmap. If not provided, a new array is created.
   * @returns The Uint8Array that contains the serialized bitmap
   */
  serialize<
    TOutput extends
      | Uint8Array
      | RoaringUint8Array
      | typeof RoaringUint8Array = Uint8Array,
  >(
    format: SerializationFormatType,
    output: TOutput,
  ): TOutput extends RoaringUint8Array
    ? RoaringUint8Array
    : TOutput extends typeof RoaringUint8Array
      ? RoaringUint8Array
      : Uint8Array;
  /**
   * Serializes a bitmap to a typed Uint8Array.
   * The returned array is automatically garbage collected and there is no need to be disposed manually.
   *
   * @param output - The Uint8Array that will contain the serialized bitmap.
   * @param format - The serialization format.
   * @returns The Uint8Array that contains the serialized bitmap
   */
  serialize<TOutput extends Uint8Array | RoaringUint8Array = Uint8Array>(
    output: TOutput,
    format: SerializationFormatType,
  ): TOutput extends RoaringUint8Array ? RoaringUint8Array : Uint8Array;
  /**
   * Serializes a bitmap to a byte buffer allocated in WASM memory.
   *
   * The returned RoaringUint8Array is allocated in WASM memory and not garbage collected,
   * it should to be freed manually calling dispose() as soon as possible.
   *
   * @param format - The serialization format.
   * @returns The RoaringUint8Array, a buffer allocated in WASM memory.
   */
  serializeToRoaringUint8Array(
    format: SerializationFormatType,
    output?: RoaringUint8Array,
  ): RoaringUint8Array;
  /**
   * Makes this roaring bitmap readonly.
   * Sets isFrozen to true.
   * This is a no-op if isFrozen is already true.
   * Every attempt to modify the bitmap will throw an exception.
   * A frozen bitmap cannot be unfrozen, but it can be disposed.
   */
  freeze(): this;
  /**
   * Creates a new roaring bitmap adding the specified values.
   *
   * The roaring bitmap allocates in WASM memory, remember to dispose
   * the RoaringBitmap32 when not needed anymore to release WASM memory.
   * @param values - The values to add
   */
  constructor(
    valuesOrCapacity?:
      | ReadonlyRoaringBitmap32
      | BasicTypedArray
      | Iterable<number | null | undefined | false | string>
      | readonly (number | null | undefined | false | string)[]
      | number
      | null
      | undefined,
    arenaAllocator?: RoaringArenaAllocator | null,
  );
  /**
   * A number that changes every time the bitmap might have changed.
   * Do not make assumptions about the value of this property, it is not guaranteed to be sequential.
   * The value might change after some operations also if the content of the bitmap does not change, because it would be too expensive to check if the content changed.
   * This property is useful to check if the bitmap changed since the last time you checked it.
   */
  get v(): number;
  /**
   * Returns true if this instance was disposed.
   * A disposed bitmap cannot be used anymore.
   */
  get isDisposed(): boolean;
  /**
   * Property. True if the bitmap is read-only.
   * A read-only bitmap cannot be modified, every operation will throw an error.
   * You can freeze a bitmap using the freeze() method.
   * A bitmap cannot be unfrozen.
   */
  get isFrozen(): boolean;
  /**
   * Get the cardinality of the bitmap (number of elements).
   */
  get size(): number;
  /**
   * Returns true if the bitmap has no elements.
   */
  get isEmpty(): boolean;
  [Symbol.iterator](): RoaringBitmap32Iterator;
  /**
   * Disposes this object freeing all WASM memory associated to it.
   * Is safe to call this method more than once.
   */
  dispose(): boolean;
  /**
   * Throws an exception if this object was disposed before.
   */
  throwIfDisposed(): void | never;
  /**
   * Clears the bitmap, removing all values.
   */
  clear(): void;
  /**
   * Returns a new bitmap that is a copy of this bitmap, same as new RoaringBitmap32(copy)
   * @returns A cloned RoaringBitmap32 instance
   */
  clone(): RoaringBitmap32;
  /**
   * Check whether a range of values from rangeStart (included) to rangeEnd (excluded) is present
   *
   * @param rangeStart - The start value (inclusive).
   * @param rangeEnd - The end value (exclusive).
   * @returns True if the bitmap contains the whole range of values from rangeStart (included) to rangeEnd (excluded), false if not.
   * @memberof ReadonlyRoaringBitmap32
   */
  hasRange(rangeStart?: number, rangeEnd?: number): boolean;
  /**
   * Gets the cardinality (number of elements) between rangeStart (included) to rangeEnd (excluded) of the bitmap.
   * Returns 0 if range is invalid or if no element was found in the given range.
   *
   * @param rangeStart - The start value (inclusive).
   * @param rangeEnd - The end value (exclusive).
   * @returns The number of elements between rangeStart (included) to rangeEnd (excluded).
   */
  rangeCardinality(rangeStart?: number, rangeEnd?: number): number;
  /**
   * Adds all the values in the interval: [rangeStart, rangeEnd).
   *
   * First element is included, last element is excluded.
   * The number of added values is rangeEnd - rangeStart.
   *
   * Areas outside the range are passed through unchanged.
   *
   * @param rangeStart - The start index. Trimmed to 0.
   * @param rangeEnd - The end index. Trimmed to 4294967296.
   * @returns This RoaringBitmap32 instance.
   */
  addRange(rangeStart?: number, rangeEnd?: number): this;
  /**
   * Removes all the values in the interval: [rangeStart, rangeEnd).
   *
   * First element is included, last element is excluded.
   * The number of renived values is rangeEnd - rangeStart.
   *
   * Areas outside the range are passed through unchanged.
   * @param rangeStart - The start index. Trimmed to 0.
   * @param rangeEnd - The end index. Trimmed to 4294967296.
   * @returns This RoaringBitmap32 instance.
   * @memberof RoaringBitmap32
   */
  removeRange(rangeStart?: number, rangeEnd?: number): this;
  /**
   * Negates (in place) the roaring bitmap within a specified interval: [rangeStart, rangeEnd).
   *
   * First element is included, last element is excluded.
   * The number of negated values is rangeEnd - rangeStart.
   *
   * Areas outside the range are passed through unchanged.
   *
   * @param {number|undefined} rangeStart The start index. Trimmed to 0.
   * @param {number|undefined} [rangeEnd] The end index. Trimmed to 4294967296.
   * @returns {this} This RoaringBitmap32 instance.
   * @memberof RoaringBitmap32
   */
  flipRange(rangeStart?: number, rangeEnd?: number): this;
  /**
   * Overwrite the content of this bitmap with the content of another bitmap.
   * @param other - The other bitmap to copy.
   * @returns This RoaringBitmap32 instance.
   */
  overwrite(other: ReadonlyRoaringBitmap32): this;
  /**
   * Adds a 32 bit unsigned integer value.
   * Values are unique, this function does nothing if the value already exists.
   *
   * @param value - 32 bit unsigned integer to add in the set.
   * @returns This RoaringBitmap32 instance.
   * @throws If the bitmap is frozen.
   */
  add(value: number): this;
  /**
   * Adds a 32 bit unsigned integer value checking if the bitmap changes.
   * Use add() if you don't need to know if something changed.
   * Values are unique, this function does nothing and returns false if the value already exists.
   *
   * @param value - 32 bit unsigned integer to add in the set.
   * @returns True if the bitmap changed, false if not.
   * @throws If the bitmap is frozen.
   */
  tryAdd(value: number): boolean;
  /**
   * Adds multiple values.
   * Using this is faster than calling add() multiple times.
   * Inserting ordered or partially ordered arrays is faster.
   *
   * @param values - The values to add.
   */
  addMany(
    values:
      | ReadonlyRoaringBitmap32
      | BasicTypedArray
      | Iterable<number | null | undefined | false | string>
      | readonly (number | null | undefined | false | string)[]
      | null
      | undefined,
  ): this;
  removeMany(
    values:
      | ReadonlyRoaringBitmap32
      | BasicTypedArray
      | Iterable<number | null | undefined | false | string>
      | readonly (number | null | undefined | false | string)[]
      | null
      | undefined,
  ): this;
  /**
   * Removes a value from the set checking if the bitmap changes.
   * Use remove() if you don't need to know if something changed.
   * If the value does not exists, this function does nothing and returns false.
   *
   * @param value - 32 bit unsigned integer to remove from the set.
   * @returns True if the bitmap changed, false if not.
   * @throws If the bitmap is frozen.
   */
  delete(value: number): boolean;
  /**
   * The pop() method removes the last element from a roaring bitmap and returns that element.
   * This method changes the size of the bitmap
   * @returns The last element in the bitmap, or undefined if the bitmap is empty.
   */
  pop(): number | undefined;
  /**
   * The shift() method removes the first element from a roaring bitmap and returns that element.
   * This method changes the size of the bitmap
   * @returns {number | undefined} The first element in the bitmap, or undefined if the bitmap is empty.
   * @memberof RoaringBitmap32
   */
  shift(): number | undefined;
  /**
   * Gets the minimum value stored in the bitmap.
   * If the bitmap is empty, returns 0xFFFFFFFF
   *
   * @returns The minimum 32 bit unsigned integer or 0xFFFFFFFF if empty.
   */
  minimum(): number;
  /**
   * Gets the maximum value stored in the bitmap.
   * If the bitmap is empty, returns 0.
   *
   * @returns The maximum 32 bit unsigned integer or 0 if empty.
   */
  maximum(): number;
  /**
   * Checks whether the given value is contained in the set.
   *
   * @param value - The value to look for.
   * @returns True if value exists in the set, false if not.
   */
  has(value: unknown): boolean;
  /**
   * Returns true if the bitmap is subset of the other.
   *
   * @param other - the other bitmap
   * @returns true if the bitmap is subset of the other.
   */
  isSubset(other: ReadonlyRoaringBitmap32): boolean;
  /**
   * Returns true if this bitmap is strict subset of the other.
   *
   * @param other - The other bitmap
   * @returns True if this bitmap is a strict subset of other
   */
  isStrictSubset(other: ReadonlyRoaringBitmap32): boolean;
  /**
   * Converts the bitmap to a JS Uint32Array.
   * The resulting array may be very big, use this function with caution.
   *
   * @param output - The output Uint32Array. If not specified, a new array is created.
   * If the output array is too small, only the first values that fit are written.
   * If the output array is too big, the remaining values are left untouched and a new subarray is returned.
   * If is a number, a new array of the specified size is created.
   * @param maxLength - The optional maximum number of values to read from the bitmap and write in the array.
   * @returns The Uint32Array containing all values in the bitmap.
   */
  toUint32Array(output?: Uint32Array | number): Uint32Array;
  /**
   * Converts the bitmap to a JS array.
   * The resulting array may be very big, use this function with caution.
   *
   * @returns The array containing all values in the bitmap.
   */
  toArray(): number[];
  /**
   * Converts the bitmap to a JS array.
   * The resulting array may be very big, use this function with caution.
   *
   * @param maxLength - The maximum length of the output array.
   * @returns The array containing all values in the bitmap.
   */
  toArray(maxLength: number): number[];
  /**
   * Append all items in the bitmap to a JS array.
   * The resulting array may be very big, use this function with caution.
   *
   * @param output - The output array. If not specified, a new array is created.
   * @param maxLength - The optional maximum number of values to read from the bitmap and push in the array.
   * @returns The array containing all values in the bitmap.
   */
  toArray(output: number[], maxLength?: number | undefined): number[];
  /**
   * Converts the bitmap to a JS Set<number>.
   * The resulting set may be very big, use this function with caution.
   *
   * @param output - The output Set. If not specified, a new Set is created.
   * @param maxLength - The optional maximum number of values to read from the bitmap and add in the set.
   * @returns The set containing all values in the bitmap.
   */
  toSet(output?: Set<number>, maxLength?: number): Set<number>;
  /**
   * Converts the bitmap to a string in the format "1,2,3,4,5".
   * The resulting string may be very big, use this function with caution.
   *
   * @param sepatator - The optional separator to use between values, defaults to ",".
   * @param maxStringLength - The optional approximate maximum number of characters the output string can contain.
   */
  join(sepatator?: string, maxStringLength?: number): string;
  /**
   * Converts a range of the bitmap to a Uint32Array.
   * The resulting array may be very big, use this function with caution.
   *
   * @param minimumValue - The range start value (inclusive).
   * @param maximumValue - The range end value (exclusive).
   * @param output - The output array. If not specified, a new array is created.
   * @returns The array containing all values within the given range in the bitmap.
   */
  rangeUint32Array(
    minimumValue?: number,
    maximumValue?: number,
    output?: Uint32Array,
  ): Uint32Array;
  /**
   * Converts a range of the bitmap to an JS Array.
   * The resulting array may be very big, use this function with caution.
   *
   * @param minimumValue - The range start value (inclusive).
   * @param maximumValue - The range end value (exclusive).
   * @param output - The output array. If not specified, a new array is created.
   * @returns The array containing all values within the given range in the bitmap.
   */
  rangeArray(
    minimumValue?: number,
    maximumValue?: number,
    output?: number[],
  ): number[];
  /**
   * Converts a range of the bitmap to a Set.
   * The resulting set may be very big, use this function with caution.
   *
   * @param minimumValue - The range start value (inclusive).
   * @param maximumValue - The range end value (exclusive).
   * @param output - The output set. If not specified, a new set is created.
   * @returns The set containing all values within the given range in the bitmap.
   */
  rangeSet(
    minimumValue?: number,
    maximumValue?: number,
    output?: Set<number>,
  ): Set<number>;
  /**
   * Converts a range of the bitmap to a string in the form "1,2,3,4,5".
   * The resulting string may be very big, use this function with caution.
   *
   * @param minimumValue - The range start value (inclusive).
   * @param maximumValue - The range end value (exclusive).
   * @param separator - The separator to use between values. Defaults to ",".
   * @returns The string containing all values within the given range in the bitmap.
   */
  rangeJoin(
    minimumValue?: number,
    maximumValue?: number,
    separator?: string,
  ): string;
  /**
   * Converts a slice, define by start index (included) and end index (excluded) of the bitmap to a Uint32Array.
   * The resulting array may be very big, use this function with caution.
   *
   * @param start - The slice start index (inclusive).
   * @param end - The slice end index (exclusive).
   * @param output - The output array. If not specified, a new array is created.
   * @returns The array containing all values within the given slice in the bitmap.
   */
  sliceUint32Array(
    start?: number,
    end?: number,
    output?: Uint32Array | undefined,
  ): Uint32Array;
  /**
   * Converts a slice, define by start index (included) and end index (excluded) of the bitmap to a number array.
   * The resulting array may be very big, use this function with caution.
   *
   * @param start - The slice start index (inclusive).
   * @param end - The slice end index (exclusive).
   * @param output - The output array. If not specified, a new array is created.
   * @returns The array containing all values within the given slice in the bitmap.
   */
  sliceArray(
    start?: number,
    end?: number,
    output?: number[] | undefined,
  ): number[];
  /**
   * Converts a slice, define by start index (included) and end index (excluded) of the bitmap to a Set.
   * The resulting set may be very big, use this function with caution.
   *
   * @param start - The slice start index (inclusive).
   * @param end - The slice end index (exclusive).
   * @param output - The output set. If not specified, a new set is created.
   * @returns The set containing all values within the given slice in the bitmap.
   */
  sliceSet(
    start?: number,
    end?: number,
    output?: Set<number> | undefined,
  ): Set<number>;
  /**
   * Converts a slice, define by start index (included) and end index (excluded) of the bitmap to a string in the form "1,2,3,4,5".
   * The resulting string may be very big, use this function with caution.
   *
   * @param start - The slice start index (inclusive).
   * @param end - The slice end index (exclusive).
   * @param separator - The separator to use between values. Defaults to ",".
   * @returns The string containing all values within the given slice in the bitmap.
   */
  sliceJoin(
    start?: number,
    end?: number,
    separator?: string | undefined,
  ): string;
  /**
   * Checks wether two roaring bitmap contains the same data.
   *
   * @param other - The other bitmap.
   * @returns True if the bitmaps contains the same data, false if not.
   */
  isEqual(other: ReadonlyRoaringBitmap32): boolean;
  /**
   * Optimizes the bitmap releasing unused memory and compressing containers.
   * Returns true if something changed.
   *
   * @returns True if something changed.
   */
  optimize(): boolean;
  /**
   * If the size of the roaring bitmap is strictly greater than rank, then
   * this function returns the element of given rank.
   * Otherwise, it returns NaN.
   *
   * @param rank - Element rank
   * @returns element or NaN
   */
  select(rank: number): number;
  /**
   * The at() method takes an integer value and returns the item at that index,
   * allowing for positive and negative integers. Negative integers count back from the last item in the set.
   *
   * @param index Zero-based index of the array element to be returned, converted to an integer. Negative index counts back from the end of the array — if index < 0, index + array.length is accessed.
   * @returns The element in the set matching the given index. Always returns undefined if index < -array.length or index >= array.length without attempting to access the corresponding property.
   */
  at(index: number): number | undefined;
  /**
   * Finds the index of the nth set element.
   * Returns -1 if not found.
   *
   * @param value - Element value
   * @returns element index or -1 if not found
   */
  indexOf(value: number): number;
  /**
   * Computes the size of the intersection between two bitmaps.
   * Both bitmaps are unchanged.
   *
   * @param other - The other bitmap.
   * @returns Cardinality of the intersection between two bitmaps.
   */
  andCardinality(other: ReadonlyRoaringBitmap32): number;
  /**
   * Computes the size of the union of two bitmaps.
   * Both bitmaps are unchanged.
   *
   * @param other - The other bitmap.
   * @returns Cardinality of the union of two bitmaps.
   */
  orCardinality(other: ReadonlyRoaringBitmap32): number;
  /**
   * Computes the size of the difference (andnot) of two bitmaps.
   * Both bitmaps are unchanged.
   *
   * @param other - The other bitmap.
   * @returns Cardinality of the difference (andnot) of two bitmaps.
   */
  andNotCardinality(other: ReadonlyRoaringBitmap32): number;
  /**
   * Computes the size of the symmetric difference (xor) between two bitmaps.
   * Both bitmaps are unchanged.
   *
   * @param other - The other bitmap.
   * @returns Cardinality of the symmetric difference (xor) of two bitmaps.
   */
  xorCardinality(other: ReadonlyRoaringBitmap32): number;
  /**
   * Intersects this bitmap with another.
   * Removes the elements from this bitmap that don't exists in the other.
   * Stores the result in this bitmap.
   * The provided bitmap is not modified.
   *
   * @param other - The other bitmap.
   */
  andInPlace(other: ReadonlyRoaringBitmap32): void;
  /**
   * Adds the element of the other bitmap into this bitmap.
   * Stores the result in this bitmap.
   * The provided bitmap is not modified.
   *
   * @param other - The other bitmap.
   */
  orInPlace(other: ReadonlyRoaringBitmap32): this;
  /**
   * Computes the difference between two bitmaps.
   * Stores the result in this bitmap.
   * The provided bitmap is not modified.
   *
   * @param other - The other bitmap.
   */
  xorInPlace(other: ReadonlyRoaringBitmap32): this;
  /**
   * Compute the difference between this and the provided bitmap,
   * writing the result in the current bitmap.
   * The provided bitmap is not modified.
   *
   * @param other - The other bitmap.
   */
  andNotInPlace(other: ReadonlyRoaringBitmap32): this;
  /**
   * Returns the number of integers that are smaller or equal to the given value.
   *
   * @param value - The value to rank
   * @returns The number of values smaller than the given value
   */
  rank(value: number): number;
  /**
   * Check whether the two bitmaps intersect (have at least one element in common).
   *
   * @param other - The other bitmap.
   * @returns True if the two bitmaps intersects, false if not.
   */
  intersects(other: ReadonlyRoaringBitmap32): boolean;
  /**
   * Check whether a bitmap and a closed range intersect.
   *
   * @param rangeStart The start of the range.
   * @param rangeEnd The end of the range.
   * @returns boolean True if the bitmap and the range intersects, false if not.
   */
  intersectsWithRange(rangeStart?: number, rangeEnd?: number): boolean;
  /**
   * Computes the Jaccard index between two bitmaps.
   * (Also known as the Tanimoto distance, or the Jaccard similarity coefficient)
   * See https://en.wikipedia.org/wiki/Jaccard_index
   *
   * The Jaccard index is undefined if both bitmaps are empty.
   *
   * @returns The Jaccard index
   */
  jaccardIndex(other: ReadonlyRoaringBitmap32): number;
  /**
   * Remove run-length encoding even when it is more space efficient.
   *
   * Return whether a change was applied.
   *
   * @returns True if a change was applied, false if not.
   */
  removeRunCompression(): boolean;
  /**
   * Convert array and bitmap containers to run containers when it is more efficient;
   * also convert from run containers when more space efficient.
   *
   * Returns true if the bitmap has at least one run container.
   *
   * Additional savings might be possible by calling shrinkToFit().
   *
   * @returns True if the bitmap has at least one run container.
   */
  runOptimize(): boolean;
  /**
   * If needed, reallocate memory to shrink the memory usage.
   *
   * Returns the number of bytes saved.
   *
   * @returns The number of bytes saved.
   */
  shrinkToFit(): number;
  /**
   * Returns a new RoaringBitmap32 with the intersection (and) between the given two bitmaps.
   *
   * The provided bitmaps are not modified.
   *
   * @param a - The first RoaringBitmap32 instance to and.
   * @param b - The second RoaringBitmap32 instance to and.
   * @returns A new RoaringBitmap32 that contains the intersection a AND b
   */
  static and(
    a: ReadonlyRoaringBitmap32,
    b: ReadonlyRoaringBitmap32,
  ): RoaringBitmap32;
  /**
   * Returns a new RoaringBitmap32 with the union (or) of the two given bitmaps.
   *
   * The provided bitmaps are not modified.
   *
   * @param a The first RoaringBitmap32 instance to or.
   * @param b The second RoaringBitmap32 instance to or.
   */
  static or(
    a: ReadonlyRoaringBitmap32,
    b: ReadonlyRoaringBitmap32,
  ): RoaringBitmap32;
  /**
   * Returns a new RoaringBitmap32 with the symmetric union (xor) between the two given bitmaps.
   *
   * The provided bitmaps are not modified.
   *
   * @param a The first RoaringBitmap32 instance to xor.
   * @param b The second RoaringBitmap32 instance to xor.
   */
  static xor(
    a: ReadonlyRoaringBitmap32,
    b: ReadonlyRoaringBitmap32,
  ): RoaringBitmap32;
  /**
   * Returns a new RoaringBitmap32 with the difference (and not) between the two given bitmaps.
   *
   * The provided bitmaps are not modified.
   *
   * @static
   * @param a The first RoaringBitmap32 instance.
   * @param b The second RoaringBitmap32 instance.
   */
  static andNot(
    a: ReadonlyRoaringBitmap32,
    b: ReadonlyRoaringBitmap32,
  ): RoaringBitmap32;
  /**
   * Performs a union between all the given array of RoaringBitmap32 instances.
   *
   * This function is faster than calling or multiple times.
   * In some circumstances orManyHeap is faster than orMany.
   *
   * @param bitmaps - An array of RoaringBitmap32 instances to or together.
   * @returns A new RoaringBitmap32 that contains the union of all the given bitmaps.
   */
  static orMany(
    bitmaps: readonly (ReadonlyRoaringBitmap32 | null | undefined | false)[],
  ): RoaringBitmap32;
  /**
   * Performs a union between all the given array of RoaringBitmap32 instances.
   *
   * This function is faster than calling or multiple times.
   * In some circumstances orManyHeap is faster than orMany.
   *
   * @param bitmaps - An array of RoaringBitmap32 instances to or together.
   * @returns A new RoaringBitmap32 that contains the union of all the given bitmaps.
   */
  static orManyHeap(
    bitmaps: readonly (ReadonlyRoaringBitmap32 | null | undefined | false)[],
  ): RoaringBitmap32;
  /**
   * Performs a xor between all the given array of RoaringBitmap32 instances.
   *
   * This function is faster than calling xor multiple times.
   *
   * @param bitmaps - An array of RoaringBitmap32 instances to or together.
   * @returns A new RoaringBitmap32 that contains the xor of all the given bitmaps.
   */
  static xorMany(
    bitmaps: readonly (ReadonlyRoaringBitmap32 | null | undefined | false)[],
  ): RoaringBitmap32;
  /**
   * Swaps the content of two RoaringBitmap32 instances.
   *
   * @static
   * @param {RoaringBitmap32} a First RoaringBitmap32 instance to swap
   * @param {RoaringBitmap32} b Second RoaringBitmap32 instance to swap
   * @memberof RoaringBitmap32
   */
  static swap(a: RoaringBitmap32, b: RoaringBitmap32): void;
  /** This method is called after the bitmap is modified */
  protected invalidate(): void;
  /**
   * Internal property, do not use.
   * @internal
   */
  get _p(): number | false;
}

declare class RoaringArenaAllocator {
  #private;
  static get current(): RoaringArenaAllocator | null;
  /**
   * Starts a new arena allocator.
   * @returns The new arena allocator.
   */
  static start(): RoaringArenaAllocator;
  /**
   * Stops the current arena allocator.
   * @returns The stopped arena allocator.
   * @see start
   * @see current
   * @see with
   */
  static stop(): RoaringArenaAllocator | null;
  /**
   * Gets the number of references currently registered.
   * @returns The number of references, escaped or not.
   */
  get size(): number;
  /**
   * Gets the number of references currently escaped.
   * Escaped references are not disposed when the arena is stopped.
   * @returns The number of escaped references.
   * @see escape
   */
  get escaped(): number;
  static with(
    fn: (allocator: RoaringArenaAllocator) => void,
    allocator?: RoaringArenaAllocator,
  ): void;
  constructor();
  disposeAll(): number;
  start(): this;
  stop(): this;
  with<T>(fn: (allocator: RoaringArenaAllocator) => T): T;
  register<T extends IDisposable>(disposable: T): T;
  unregister(disposable: IDisposable | null | undefined): boolean;
  escape<T extends IDisposable>(disposable: T): T;
  newRoaringUint8Array(
    lengthOrArray?:
      | number
      | Iterable<number>
      | ArrayLike<number>
      | null
      | undefined,
  ): RoaringUint8Array;
  newRoaringBitmap32Iterator(
    bitmap?: RoaringBitmap32 | null | undefined,
  ): RoaringBitmap32Iterator;
  newRoaringBitmap32(
    valuesOrCapacity?:
      | RoaringBitmap32
      | BasicTypedArray
      | Iterable<number | null | undefined | false | string>
      | readonly (number | null | undefined | false | string)[]
      | number
      | null
      | undefined,
  ): RoaringBitmap32;
}

/**
 * Array of bytes allocted directly in roaring library WASM memory.
 * Note: to release memory as soon as possible, you are responsible to free the allocated memory calling "dispose" method.
 */
declare class RoaringUint8Array implements IDisposable {
  #private;
  /**
   * The length in bytes of the array.
   * For RoaringUint8Array it is equal to this.length
   */
  get byteLength(): number;
  /**
   * Returns true if this object was deallocated.
   */
  get isDisposed(): boolean;
  /**
   * Allocates an array in the roaring WASM heap.
   *
   * Note: Memory is not garbage collected, you are responsible to free the allocated memory calling "dispose" method.
   *
   * If the parameter is a number, it creates a new uninitialized array of the given length.
   * If the parameter is an Iterable, it creates a copy of the given iterable.
   *
   * @param lengthOrArray - Length of the array to allocate or the array to copy
   */
  constructor(
    lengthOrArray?:
      | number
      | Iterable<number>
      | ArrayLike<number>
      | null
      | undefined,
    arenaAllocator?: RoaringArenaAllocator | null | undefined,
  );
  /**
   * Throws an error if the memory was freed.
   */
  throwIfDisposed(): void | never;
  /**
   * Frees the allocated memory.
   * Is safe to call this method more than once.
   * @returns True if memory gets freed during this call, false if not.
   */
  dispose(): boolean;
  /**
   * Decreases the size of the allocated memory.
   * It does nothing if the new length is greater or equal to the current length.
   * If the new length is less than 1, it disposes the allocated memory.
   * NOTE: if the value is non zero, this does not reallocate the consumed memory, it just chances the reported size in byteLength and length properties.
   * @param newLength - The new length in bytes.
   * @returns True if the memory was shrunk, false if not.
   */
  shrink(newLength: number): boolean;
  /**
   * Writes the given array at the specified position
   * @param array - A typed or untyped array of values to set.
   * @param offset - The index in the current array at which the values are to be written.
   */
  set(array: ArrayLike<number> | Iterable<number>, offset?: number): this;
  /**
   * Gets a new JS typed array instance that shares the memory used by this buffer.
   * Note that the buffer may point to an outdated WASM memory if the WASM allocated memory grows while using the returned buffer.
   * Use the returned array for short periods of time.
   *
   * @returns A new typed array that shares the memory with this array.
   */
  asTypedArray(): Uint8Array;
  /**
   * Copies the content of this buffer to a typed array and returns it
   *
   * @param output - The typed array to copy to. If not provided, a new typed array is created.
   * @returns A typed array with the content of this buffer. It could be smaller than the buffer if the output array is smaller.
   */
  toTypedArray(output?: Uint8Array): Uint8Array;
  /**
   * Returns a string representation of an array.
   */
  toString(): string;
  /**
   * The at() method takes an integer value and returns the item at that index, allowing for positive and negative integers. Negative integers count back from the last item in the array.
   * Follows the specification for array.at().
   * If the computed index is less than 0, or equal to length, undefined is returned.
   * @param index - Zero-based index of the array element to be returned, converted to an integer. Negative index counts back from the end of the array — if index < 0, index + array.length is accessed.
   * @returns The element in the array matching the given index. Always returns undefined if index < -array.length or index >= array.length without attempting to access the corresponding property.
   */
  at(index: number): number | undefined;
  /**
   * Sets the value at the given index.
   * @param index - Zero-based index of the array element to be set, converted to an integer. Negative index counts back from the end of the array — if index < 0, index + array.length is accessed.
   * @param value - The value to set at the given index.
   * @returns True if the value was set, false if the index is out of bounds.
   */
  setAt(index: number, value: number): boolean;
  /**
   * Internal property, do not use.
   * @internal
   */
  get _p(): number;
}

export {
  type BasicTypedArray,
  DeserializationFormat,
  type DeserializationFormatType,
  type IDisposable,
  RoaringArenaAllocator,
  RoaringBitmap32,
  RoaringBitmap32Iterator,
  RoaringUint8Array,
  type SerializationDeserializationFormat,
  type SerializationDeserializationFormatType,
  SerializationFormat,
  type SerializationFormatType,
  dispose,
  disposeAll,
  disposeThis,
  isDisposable,
  roaringLibraryInitialize,
  roaringLibraryIsReady,
  tryDispose,
  using,
};
