import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Contract-style success response for Next.js API routes.
 * @see docs/architecture/api-contracts.md
 */
export function successResponse(
  options: { message: string; transactionId?: string; data?: unknown },
  statusCode = 200
) {
  const payload: Record<string, unknown> = {
    status: "success",
    message: options.message,
  };

  if (options.transactionId) payload.transactionId = options.transactionId;
  if (options.data !== undefined) payload.data = options.data;

  return NextResponse.json(
    payload,
    { status: statusCode }
  );
}

/**
 * Contract-style error response for Next.js API routes.
 * @see docs/architecture/api-contracts.md
 */
export function errorResponse(
  message: string,
  statusCode = 400,
  errors?: Array<{ field: string; code: string; message: string }>
) {
  const payload: Record<string, unknown> = {
    status: "error",
    message,
  };

  if (errors && errors.length > 0) payload.errors = errors;

  return NextResponse.json(
    payload,
    { status: statusCode }
  );
}

/**
 * Map Zod issues to contract-style errors array.
 */
export function zodIssuesToContractErrors(
  issues: ZodError["issues"]
): Array<{ field: string; code: string; message: string }> {
  return issues.map((issue) => ({
    field: issue.path.join(".") || "body",
    code: issue.code.toUpperCase(),
    message: issue.message,
  }));
}
