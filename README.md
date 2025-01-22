# Lævateinn (lavateinn)

Tiny and flexible microservice framework for fast development.

This is a microservice framework using Node.js + express.js,
provides the tree to write your service with a tidy and clear structure of project.

The framework is recommended to be used on light loading tasks.

![lavateinn](logo.png)

## Prerequisites

Lævateinn is required working with `Node.js 18` or later.

The framework is designed to be used with the following data storage:

- Sequelize - As the database interface to store the persistent data,
  using SQLite default for the development purpose,
  please change it to the other database for the production environment.
- Redis/Valkey - As the in-service memory for storing the cache data.
- RabbitMQ - As the message broker to send the message between services.

## Get Started

To create a new project with Lævateinn, you can use the following command:

```sh
npm init @lavateinn
```

## System Architecture

The framework is recommended to be used on the light loading tasks.

For fast development,
the routes of the bussiness logic can be written in the `routes` directory,
and the models of the database can be written in the `models` directory.

If you want to design as following SOLID rules,
you can create the service class in the `src/services` directory,
and create the controller class to handle the request in the `src/controllers` directory,
then mappping the route to the controller.

For example,

the service class:

```js
// src/services/example.mjs
export default class ExampleService {
  async getNow() {
    return Date.now();
  }
}
```

the controller class:

```js
// src/controllers/example.mjs
import ExampleService from "../services/example.mjs";

const exampleService = new ExampleService();

export async function getNow(req, res) {
  const now = await exampleService.getNow();
  res.json({ now });
}
```

the route mapping:

```js
// src/routes/example.mjs
import { useApp } from "../init/express.mjs";
import { getNow } from "../controllers/example.mjs";

export default () => {
    const app = useApp();
    app.get("/example/now", getNow);
};
```

Lævateinn provides a flexible structure to help you create your service,
there is no restriction on how to design your service.

## Framework Structure

The primary structure of the framework is as follows:

```plaintext
├── app.mjs (entry point)
├── src (source code)
│   ├── execute.mjs (application executor)
│   ├── config.mjs (configuration reader)
│   ├── clients (external API clients)
│   ├── init (initializers and composables)
│   ├── middleware (express middleware)
│   ├── models (sequelize models)
│   ├── routes (application routes)
│   ├── tasks (background tasks)
│   └── utils (utilities)
└── test (test code, mocha powered)
    ├── test.mjs (example test)
    ├── routes (route tests)
    └── utils (utility tests)
```

## Configuration

The framework uses the `dotenv` package to read the configuration from the `.env` file.

There is a `.env.default` file in the root directory of the project, presenting as the default configuration.
You can copy it to the `.env` file to override the default configuration.

If you want to ask users to set something not can be set in the `.env.default` file,
please leave a `.env.sample` file and show the example of the configuration which is required to be set.

If there is no `.env` file exists (such as setting configuration via system environment variables),
you have to set `APP_CONFIGURED=1` in the environment variables to start the service. Otherwise, the service will get a fatal error and exit.

## Dependencies

Install the package dependencies.

```shell
npm install
```

## Development Environment

Hot-reload to help you create your application in fast,
reducing the time while debugging.

```shell
npm run dev
```

## Production Environment

Start the service for providing to our dear clients!

```shell
npm start
```

## API Documentation

If you have no plan to create the swagger documentation,
you should write the API documentation in the `README.md` file.

For example,

the one jsdoc of OpenAPIs':

```js
/**
 * >openapi
 * /example/now:
 *   get:
 *     tags:
 *       - example
 *     summary: Get POSIX timestamp
 *     description: Example to show current POSIX timestamp.
 *     responses:
 *       200:
 *         description: Returns current POSIX timestamp.
 */
```

you should write the API documentation in the `README.md` file instead as:

```markdown
### GET /example/now

> Get POSIX timestamp

Example to show current POSIX timestamp.
```

### GET /example/now

> Get POSIX timestamp

Example to show current POSIX timestamp.

## License

Lævateinn is the microservice framework with [BSD-3-Clause licensed](LICENSE).

> (c) 2025 [Star Inc.](https://starinc.xyz)
