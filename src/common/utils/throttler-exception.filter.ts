import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = 429; // HTTP Status Code for Too Many Requests

    response.status(status).json({
      statusCode: status,
      message: "Sizning so'rovlaringiz chegarasiga yetdingiz.",
      error: 'Too Many Requests',
    });
  }
}
