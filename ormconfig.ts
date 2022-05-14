import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'develop',
  password: () => 'develop',
  database: 'foreside_assessement',
  entities: [join(__dirname, 'src', 'entities', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'src', 'migrations', '*.migration.{ts,js}')],
  subscribers: [join(__dirname, 'src', 'subscribers', '*.subscriber.{ts,js}')],
  namingStrategy: new SnakeNamingStrategy(),
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers',
  },
};
