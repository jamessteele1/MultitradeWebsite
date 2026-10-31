/** Monday GraphQL IDs are positive integer strings. */
export function isMondayItemId(value: unknown): value is string {
  return typeof value === "string" && /^[1-9]\d*$/.test(value);
}
