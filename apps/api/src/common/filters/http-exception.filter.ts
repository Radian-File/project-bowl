import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { Request, Response } from "express";

interface ErrorResponseBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

function isErrorResponseBody(value: unknown): value is ErrorResponseBody {
  return typeof value === "object" && value !== null;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;

    const body = isErrorResponseBody(exceptionResponse) ? exceptionResponse : undefined;
    const fallbackMessage =
      exception instanceof Error ? exception.message : "Internal server error";

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: body?.error ?? HttpStatus[status] ?? "Error",
      message: body?.message ?? fallbackMessage,
    });
  }
}
