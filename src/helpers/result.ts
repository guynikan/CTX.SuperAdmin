export type Ok<T> = {
  readonly status: 'ok';
  readonly value: T;
};

export type Fail = {
  readonly status: 'fail';
  readonly message: string;
};

/**
 * @description Result type to handle success and failure cases
 * @example
 * const result = ok(1);
 * console.log(result); // { status: 'ok', value: 1 }
 */
export type Result<T> = Ok<T> | Fail;

/**
 * @description Create a success result
 * @param value - The value to wrap
 * @returns The success result
 */
export function ok<T>(value: T): Ok<T> {
  return { status: 'ok', value };
}

/**
 * @description Create a failure result
 * @param message - The error message
 * @returns The failure result
 */
export function fail(message: string): Fail {
  return { status: 'fail', message };
}

/**
 * @description Check if the result is a success
 * @param result - The result to check
 * @returns True if the result is a success, false otherwise
 */
export function isOk<T>(result: Result<T>): result is Ok<T> {
  return result.status === 'ok';
}

/**
 * @description Check if the result is a failure
 * @param result - The result to check
 * @returns True if the result is a failure, false otherwise
 */
export function isFail<T>(result: Result<T>): result is Fail {
  return result.status === 'fail';
}

/**
 * @description Check if the result is a result
 * @param result - The result to check
 * @returns True if the result is a result, false otherwise
 */
export function isResult<T>(result: unknown): result is Result<T> {
  return typeof result === 'object' && result !== null && 'status' in result;
}

/**
 * @description Wrap a promise in a result
 * @param promise - The promise to wrap
 * @returns The result of the promise
 */
export async function wrapAsync<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    const value = await promise;
    return ok(value);
  } catch (error) {
    if (error instanceof Error) {
      return fail(error.message);
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'detail' in error &&
      typeof error.detail === 'string'
    ) {
      return fail(error.detail);
    }

    return fail(String(error));
  }
}

/**
 * @description Wrap a synchronous function in a result
 * @param fn - The function to wrap
 * @returns The result of the function
 */
export function wrapSync<T>(fn: () => T): Result<T> {
  try {
    const value = fn();
    return ok(value);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return fail(message);
  }
}

/**
 * @description Unwrap a result and return the value if it is a success, otherwise return the  value
 * @param result - The result to unwrap
 * @param defaultValue - The  value to return if the result is a failure
 * @returns The value of the result if it is a success, otherwise the  value
 */
export function unwrapOkOr<T, D>(result: Result<T>, defaultValue: D): T | D {
  if (isOk(result)) {
    return result.value;
  }
  console.error('Error:', result.message);
  return defaultValue;
}

