import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { env } from 'process';
import { ThrottlerExceptionFilter } from './common/utils/throttler-exception.filter';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    ['/api/docs'],
    basicAuth({ users: { admin: 'admin123' }, challenge: true }),
  );

  app.setGlobalPrefix('api');

  // Kuki sozlamalari
  app.use(cookieParser());
  app.enableCors({
    origin: '*', // Change to your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization, Custom-Header',
    credentials: true,
  });

  // Validatsiya sozlamalari
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global Filter
  app.useGlobalFilters(new ThrottlerExceptionFilter());

  // Global Guard

  // Swagger sozlamalari
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(env.PORT, () => {
    console.warn('Listening on ' + env.PORT);
  });
}
bootstrap();
