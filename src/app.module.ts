import { env } from 'process';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CustomJwtModule } from './custom-jwt/custom-jwt.module';
import { EmailModule } from './email/email.module';
import { AdminModule } from './admin/admin.module';
import { RegionModule } from './region/region.module';
import { DistrictModule } from './district/district.module';
import { CarModule } from './car/car.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CommentModule } from './comment/comment.module';
import { BronModule } from './bron/bron.module';

@Module({
  imports: [
    // rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 40,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.PG_HOST,
      port: +env.PG_PORT,
      username: env.PG_USER,
      password: env.PG_PASSWORD,
      database: env.PG_DB,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: true,
      logging: false,
    }),
    UsersModule,
    CustomJwtModule,
    EmailModule,
    AdminModule,
    RegionModule,
    DistrictModule,
    CarModule,
    CommentModule,
    BronModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
