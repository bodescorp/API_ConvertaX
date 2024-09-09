import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ViewExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage = exception.message || 'An unexpected error occurred';

    if (status === HttpStatus.NOT_FOUND) {
      return response.status(HttpStatus.NOT_FOUND).render('404');
    }

    if (status === HttpStatus.UNAUTHORIZED) {
      return response.redirect(`/view/?error=${encodeURIComponent('Unauthorized access')}`);
    }

    return response.redirect(`${request.path}?error=${encodeURIComponent(errorMessage)}`);
  }
}
