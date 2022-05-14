# Foreside Boilerplate - JavaScript/ NestJS

This boilerplate application is the start of your assessment. In the shared PDF you will find the requirements for the assessment.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) or a locally hosted PostgreSQL Database (v14.1 or similar)
- NodeJS 14+
- npm or yarn
- Optional: [TypeORM](https://www.npmjs.com/package/typeorm) and [pg](https://www.npmjs.com/package/pg)
- Optional: [NestCLI](https://www.npmjs.com/package/@nestjs/cli)

## Installation

Make sure you have prerequisites installed.

### Postgres and PGAdmin

This repository includes a `docker-compose` file. You can use docker to host a PostgreSQL Database and also provide a Postgres GUI via PGAdmin4.
To start the database and gui, run:

```bash
$ docker-compose up --build
```

or in detached mode:

```bash
$ docker-compose up --build -d
```

#### Local Postgres

If you have a local Postgres DB installed, you need to create a new database called `foreside_assessement` and a user called `develop` that will be used to connect to the database for development purposes. Assign the password `develop` to the user. When you use the included `docker-compose`, these will be created for you.

```sql
  CREATE USER develop;
  ALTER USER develop WITH PASSWORD 'develop';
  CREATE DATABASE foreside_assessement;
  GRANT ALL PRIVILEGES ON DATABASE foreside_assessement TO develop;
```

### NestJS and dependencies

#### Nest CLI (optional)

When creating new modules, services or middleware, it is best to use the NestCLI. To install the CLI run:

```bash
$ npm i -g @nestjs/cli
```

### Install dependencies

The boilerplate has dependencies. To install them run:

```bash
$ npm install
```

### Intial setup

This boilerplate includes TypeORM to interact with the database, define the database schema's and to seed to database with an initial dataset.

```bash
$ npm run setup
```

The setup command creates the database schema. Whenever you make changes to the schema, it's best to regenerate them via

```bash
$ rum run typeorm:generateInitialDatabaseSchema
```

#### Users

To make your life easier, we automatically create and store 3 new useraccounts in the database for you to use.

#### Postman

To make your life even easier, we have included a Postman collection for the available API's

## Running the app

```bash
# development
$ npm run start:dev
```

## Testing the app

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
