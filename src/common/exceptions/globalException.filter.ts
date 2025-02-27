import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { errorMessage } from './errorMessage';

interface ErrorResponse {
  statusCode: number;
  errorCode: string;
  timestamp: string;
  path: string;
  error?: unknown;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let errorCode: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse() as { message: string };
      errorCode = errorResponse.message;
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorCode = '0119';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorCode = '0112';
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      errorCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    console.error(
      `[Error] ${errorResponse.timestamp} - ${status} - ${errorMessage[status][errorCode]} - ${request.url}`,
    );

    response.status(status).json(errorResponse);
  }
}
