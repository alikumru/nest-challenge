import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { PasswordModule } from './password/password.module';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import configuration from './config/configuration';
import { AuthenticateModule } from './user/authenticate/authenticate.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    DatabaseModule,
    UserModule,
    PasswordModule,
    AuthenticateModule,
    HealthcheckModule,
    RouterModule.register([
      {
        path: '',
        module: UserModule,
        children: [],
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
