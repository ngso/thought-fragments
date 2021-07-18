Demo social media application.

## Tech

- React
- Next.js
- Node.js
- Fastify
- GraphQL
- Apollo Server/Client
- PostgreSQL
- Prisma
- TypeScript
- Tailwind CSS

## Getting started

Requirement(s):

- Node.js
- PostgreSQL

Clone the repo

```shell
$ git clone https://github.com/ngso/minipost.git
```

Install dependencies

```shell
$ cd minipost
$ yarn # or npm install
```

Add a ```.env``` file with the following content:

```
DATABASE_URL=<your postgres connection string>
COOKIE_SECRET=<your secret for signing the cookie>
```

Migrate the database schema

```shell
$ npx prisma migrate dev
```

Run the development server

```shell
$ yarn dev # or npm run dev
```
