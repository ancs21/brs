export const ErrorTypes = {
  NOT_FOUND: "not_found",
  NOT_ALLOWED: "not_allowed",
  INVALID_DATA: "invalid_data",
  INVALID_ARGUMENT: "invalid_argument",
  DATABASE_ERROR: "database_error",
  DUPLICATE_ERROR: "duplicate_error",
  UNEXPECTED_STATE: "unexpected_state",
  CONFLICT: "conflict",
}

export class AppError extends Error {
  public type: string;
  public code?: string
  public message: string;
  public date: Date

  constructor(type: string, message: string, code?: string, ...params: any) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }

    this.type = type
    this.code = code
    this.message = message
    this.date = new Date()
  }
}