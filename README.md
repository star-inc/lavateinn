# lavateinn

Tiny microservice framework with flexible.

This is a microservice framework using Node.js + express.js,
provides the tree to write your service with a tidy and clear structure of project.

The framework is recommended to be used on light payload tasks.

![lavateinn](logo.png)

## Installation

Install the dependencies.

```shell
npm install
```

## Development

Hot-reload to help you create your application in fast,
reducing the time while debugging.

```shell
npm run dev
```

## Production

Start the service for providing to our dear clients!

```shell
npm start
```

## API

If you have no plan to create the swagger documentation,
you should write the API documentation in the `README.md` file.

For example,

the one jsdoc of OpenAPIs':
```js
/**
 * @openapi
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

Get POSIX timestamp

### License

lavateinn is the microservice framework with [MIT licensed](LICENSE).

> (c) 2024 [Star Inc.](https://starinc.xyz)
