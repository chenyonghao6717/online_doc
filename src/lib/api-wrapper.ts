import { NextResponse } from "next/server";

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function ensure<T>(
  data: T | null | undefined,
  message = "",
  status = 404
): T {
  if (!data) {
    throw new ApiError(message, status);
  }
  return data;
}

export async function apiWrapper(fn: () => Promise<NextResponse>) {
  try {
    return await fn();
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
