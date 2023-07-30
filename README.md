# Apart microservices backend monorepo

Microservices architecture backend, built with Node.js and Typescript using Turborepo.

![alt text](https://github.com/otedesco/authorization/blob/main/docs/diagram.png?raw=true)

## Folder structure

    .
    ├── docker                      # docker-compose infrastructure definitions              
    ├── packages                    # Utilities libraries and services abstractions
    |   ├── cache                   # Cache implementation for Redis
    │   ├── common                  # Common utilities (JWT, Encryption...)
    │   ├── eslint-config-custom    # Common Eslint configuration for every project
    |   ├── notifier                # Kafka implementation abstraction
    |   ├── server-utils            # Server implementation utilities
    |   └── tsconfig                # Common ts config files
    ├── services
    |   ├── auth                    # Authentication server
    │   ├── notifications           # Notifications worker
    │   └── properties              # Properties server
    ├── .dockerignore
    ├── .editorconfig
    ├── .eslintrc
    ├── .gitattributes
    ├── .gitignore
    ├── .lintstagedrc.json
    ├── .npmrc
    ├── package.json
    ├── pnpm-lock.yaml
    ├── pnpm-workspace.yaml
    ├── README.md
    ├── tsconfig.json               
    └── turbo.json


## Requirements

- node v18.x
- pnpm v7.15.x
- docker
- docker-compose v2.19.x

## Run locally in development mode

Install required dependencies

```bash
  pnpm install
```

For local development every service will use ```.env.development.local``` file, which is not included on this repository, every service has its own ```.env.example.local``` with the example environment variables that can be used for development proposes

```bash
  cd services/{service}
  cp .env.example.local .env.development.local
```

Some services will need an specific infrastructure, in that case there is a docker compose file with the infrastructure required for every service for example for the authentication service (`services/auth`) will run Redis, Postgres and another docker-compose file with Kafka and Zookeeper.

```bash
  pnpm run deploy:local:auth
```

Some services will use a Database like Postgres for those services there is an script to run required migrations (This will run ```migrate``` script on every service where the script is defined)

```bash
pnpm run migrate
```

The following command will run every service with nodemon on watch mode also will use `tsup` on watch mode for every package with the dev script defined

```bash
  pnpm run dev
```

## Useful commands

Transpile and build every package and service where ```build``` script is defined

```bash
  pnpm run build
```

Run every package and service on development mode

```bash
  pnpm run dev
```

Run every service builded with the ```start``` script defined

```bash
  pnpm run start
```

Run linter for every project

```bash
  pnpm run lint
```

Fix all autofixable linter errors for every project

```bash
  pnpm run lint:fix
```

Runs migrations for every service with that script defined

```bash
  pnpm run migrate
```

Runs migrations rollback for every service with that script defined

```bash
  pnpm run rollback
```

Deploy all the infrastructure required for ```services/auth``` including the auth service using docker compose

```bash
  pnpm run deploy:local:auth
```

Shutdown all the infrastructure required for ```services/auth``` including the auth service using docker-compose

```bash
  pnpm run down:local:auth
```

Runs every project clean script if it is defined, used to delete ```dist``` and ```node_modules``` folders

```bash
  pnpm run clean
```
