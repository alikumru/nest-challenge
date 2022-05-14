import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseConfig: TypeOrmModuleOptions = await configService.get(
          'databaseOptions',
        );
        return {
          ...databaseConfig,
          // Add your overrides here
        };
      },
    }),
  ],
})
export class DatabaseModule {}
