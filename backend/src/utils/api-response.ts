export function errorBody(statusCode: number, message: string, details?: unknown) {
  return details !== undefined
    ? { statusCode, message, details }
    : { statusCode, message };
}
