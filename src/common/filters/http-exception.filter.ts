import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../dtos/response.dto';
import { ErrorCode } from '../enums/error-codes.enum';
import { ErrorMessages } from '../i18n/error-messages';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const acceptLanguage = request.headers['accept-language']?.split(',')[0] || 'fr';
    const locale: 'fr' | 'en' = (acceptLanguage.startsWith('fr') ? 'fr' : 'en') as 'fr' | 'en';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = ErrorCode.INTERNAL_ERROR;
    let message = ErrorMessages[ErrorCode.INTERNAL_ERROR][locale];
    let details: string[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && (exceptionResponse as any).code) {
        const exceptionCode = (exceptionResponse as any).code as ErrorCode;
        code = exceptionCode in ErrorMessages ? exceptionCode : ErrorCode.INTERNAL_ERROR;
        message = ErrorMessages[code][locale];
        details = (exceptionResponse as any).details || [];
      } else {
        const msg = typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message;
        code = status.toString() as ErrorCode;
        message = Array.isArray(msg) ? msg[0] : msg as string;
        details = Array.isArray(msg) ? msg.slice(1) : [];
      }
    }

    const errorResponse: ErrorResponse = {
      error: {
        code,
        message,
        details,
      },
      _links: {
        documentation: '/api/docs#errors',
      },
    };

    response.status(status).json(errorResponse);
  }
}

import type { Request } from 'express';


