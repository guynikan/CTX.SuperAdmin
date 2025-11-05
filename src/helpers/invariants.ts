function isEmptyString(input: unknown): boolean {
  return typeof input !== 'string' || !input.trim();
}

export function assertStringNotEmpty(
  input: unknown,
  message = 'Invalid or empty string!',
): asserts input is string {
  if (isEmptyString(input)) {
    throw new Error(message);
  }
}

