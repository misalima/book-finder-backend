# Book Finder

## Description

This is the backend of the application **Book Finder**, built with Nest.js.

## Installation

Before running the application, you need to install its dependencies:

```bash
$ npm install
```

## Getting Started

### Prerequisites

Make sure you have the following tools installed on your machine:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Environment Variables

Before running the application, copy the `.env.example` file to a new `.env` file in the project root:

```bash
$ cp .env.example .env
````

### Running the Database

Before running the Nest.js application, you need to start the PostgreSQL database using Docker Compose. Make sure you have Docker running, and run:
```bash
$ docker-compose up
```

### Prisma Commands

We are using Prisma ORM, so if it's the first time you're running the application, you will need to run Prisma commands to set up the database schema and apply migrations. Here are the common commands:

```bash
# install Prisma
$ npm install prisma@latest @prisma/client

# apply database migrations
$ npx prisma migrate dev

# generate Prisma client
$ npx prisma generate
```

## Running the app
The server should be on port 3333 after you run one of the following commands:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## License

Book Finder is [MIT licensed](LICENSE).
