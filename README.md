# Ghostmeme Public API

> Uploaded memes are stored in a public imgur album:
> [https://imgur.com/a/TytqlvJ][1]

The live API used by solutions to the 2021 NHSCC problem statement. It was built
according to [JAMstack principles][2] using TypeScript (JavaScript) and MongoDB.
The production instance is hosted on [Vercel][3] with [MongoDB Atlas][4]. The
code is highly documented. You can clone this repo and run a fully functional
version of this API locally following the instructions below.

> This project has been tested on Linux (Kubuntu). If you encounter any issues
> (especially Windows-specific issues), please [report them][5]. If you're on
> Windows and you're not using WSL, [start using WSL][6].

## Table of Contents

- [Accessing the Production API][7]
- [Running a local instance of the API][8]
- [Project structure][9]
  - [Files and directories][10]
  - [External scripts][11]
- [Contributing][16]

## Accessing the Production API

- Version 1 root URI: [https://ghostmeme.api.hscc.bdpa.org/v1][22]
- Version 1 documentation and playground with examples:
  [https://hscc6xt8cqqf.docs.apiary.io/][23]

## Running a local instance of the API

You should be using the production API (and your real key) for your application.
However, for development purposes, you can also run a local version of the API
to make requests against. This API is entirely self-contained; everything you
need to run it locally is in this repo (except a running MongoDB instance).

To run a local instance of the API:

1.  Ensure the latest [NodeJS][24] and [MongoDB][25] are installed.
    - Typically, once you run their installers, no further configuration is
      required. Easy peasy!
    - If you're using WSL on Windows, [read this][26].
    - Check out [MongoDB Compass][27]!
2.  Clone this repo using your favorite terminal.
3.  From the terminal, with the repo as the current working directory, run
    `npm install`.
4.  Copy the file `.env.example` to `.env`.
    - Add your MongoDB connect URI to the MONGODB_URI environment variable in
      `.env`.
      - Using `mongodb://127.0.0.1:27017/test` as the connect URI should work
        out of the box.
      - A valid URI looks something like this:
        `mongodb://your-server-uri:your-port-number/your-test-db-name`
      - It is important that you include **the name of the test database** after
        the slash (you can just make something up) like in the above examples.
    - You may need to add values for a few other environment variables. Pay
      attention to any error messages you receive.
5.  At this point you should test that the API will work on your system. To do
    this, run the command `npm test` in your terminal.
6.  If all tests passed, you can start up the API in development mode by running
    the `npm run dev` command.
7.  You can now interact with the API using your browser, [Postman][28], or
    otherwise.
    - You should see a line on the console that looks like
      `ready - started server on http://<HOST:PORT>`. Use that URI at the end to
      access the API.
    - If you're using MongoDB Compass, you'll be able to visually explore the
      dummy database's data at this point.

## Project structure

This project uses the following technologies:

- [Node and NPM][24] to run JavaScript locally
- [TypeScript][29] for producing typed JavaScript
- [Babel][30] for compiling (transpiling) TypeScript + ESNext syntax
- [Git][32] for version control and deploying to production
- [ESLint][33] for TypeScript and JavaScript linting
- [Webpack][34] for tree-shaking and asset bundling
- [JSX][35], [React][36], and [Next.js][37] for modern web development
- [MongoDB][38] [Node driver][39] for database access
- [Jest][40] for unit and integration testing
- [API Blueprint][41] (APIB) for describing the API
- [JSON][42] (JavaScript Object Notation) for storing and transferring
  information

### Files and directories

The various `tsconfig.*.json` files control the TypeScript settings used when
type checking the project, building the docs, etc.

`package.json` and `package-lock.json` are used by NPM to describe the
dependencies that will be automatically installed when executing `npm install`.

`next.config.js` returns a JSON object used to configure [Next.js][45].
`vercel.json` serves a similar purpose.

`.env.example` is the [distributed environment file][46]. It's meaningless on
its own, but when copied and renamed to `.env`, it will be used by the API to
define certain environment variables.

The files listed in `.gitignore` are ignored when Git uploads your code to the
internet. This is useful for hiding secrets like the `.env` file.
`.gitattributes` is another Git configuration file.

`next-env.d.ts` is a TypeScript types file. It's a special type of JavaScript
file that globally defines TypeScript types used by other files. The `types/`
folder serves a similar purpose.

`LICENSE` is an license file that says you can do whatever you want with the
code in this project. Might switch to a CopyFair license eventually.

`babel.config.js` returns a JSON object used to configure [Babel][48], our
transpiler. `webpack.config.js` returns a JSON object used to configure how
[Webpack][49] builds the [external scripts][11]. `jest.config.js` returns a JSON
object used to configure [Jest][50], our [test runner][51]. `.eslintrc.js`
returns a JSON object used to configure [ESLint][52], our code correctness
checker or "linter".

`.codecov.yml`, `.editorconfig`, `.prettierignore`, `.spellcheckignore`,
`.vercelignore`, and all `*.config.js` files are configuration files for various
other tools (google 'em!).

`data/` contains any dummy data used during activity simulation not covered by
[Faker.js][31].

`docs/` contains further documentation.

`external-scripts/` contains the source code for all the [external scripts][11].
`external-scripts/bin/` is created when running `npm run build-externals`, which
compiles the scripts in `external-scripts/` into `external-scripts/bin/`.

`lib/` contains TypeScript modules shared between projects. These are candidates
for becoming new NPM packages.

`public/` contains files served directly by Vercel out of band.

`src/` contains the source code of the application. `test` contains the unit and
integration tests for the API. `src/backend` contains backend business logic and
the database ORM layer (kept thin thanks to MongoDB). `src/frontend` contains
frontend business logic and the API client ORM layer for the API's tools UI.
`src/pages` contains React (JSX) TypeScript code (`.tsx` files). `src/pages/api`
contains the actual API endpoints. The directories and files are so named to
take advantage of [Next.js's dynamic routing][57].

### External scripts

The files found under `external-scripts/bin` are independently bundled
standalone executables meant to be invoked manually by processes external to the
app itself (usually as cron jobs).

These scripts must be configured using the appropriate `.env` variables. See
`.env.example` for details.

You can use `npm run` to build any external scripts. The executable will be
placed in `external-scripts/bin`:

```Bash
npm run build-externals
```

> Warning: when you change `.env` you must (re-)build external scripts using the
> above command.

All executables under `external-scripts/bin` can be run like so:

```Bash
node external-scripts/bin/script-name-here.js
```

Currently, the following external scripts exist:

- `prune-logs.js` - Responsible for ensuring the mongodb request-log collection
  never grows too large. Should be run every hour or so.
- `ban-hammer.js` - Responsible for rate limiting (banning) keys and ips that
  hit the API too often. Should be run every minute.

## Contributing

**New issues and pull requests are always welcome and greatly appreciated!** See
[CONTRIBUTING.md][58] and [SUPPORT.md][59] for more information.

[1]: https://imgur.com/a/TytqlvJ
[2]: https://jamstack.org/
[3]: https://vercel.com
[4]: https://www.mongodb.com/cloud/atlas
[5]: https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/issues/new
[6]: https://docs.microsoft.com/en-us/windows/wsl/install-win10
[7]: #accessing-the-production-api
[8]: #running-a-local-instance-of-the-api
[9]: #project-structure
[10]: #files-and-directories
[11]: #external-scripts
[16]: #contributing
[22]: https://ghostmeme.api.hscc.bdpa.org/v1
[23]: https://hscc6xt8cqqf.docs.apiary.io/
[24]: https://nodejs.org/en
[25]: https://docs.mongodb.com/manual/installation
[26]:
  https://docs.microsoft.com/en-us/windows/wsl/tutorials/wsl-database#install-mongodb
[27]: https://docs.mongodb.com/compass/master/install
[28]: https://www.postman.com/
[29]: https://www.typescriptlang.org/
[30]: https://babeljs.io/
[32]: https://git-scm.com/
[33]: https://eslint.org/
[34]: https://webpack.js.org/
[35]: https://reactjs.org/docs/introducing-jsx.html
[36]: https://reactjs.org/
[37]: https://nextjs.org/
[38]: https://www.mongodb.com/
[39]: https://mongodb.github.io/node-mongodb-native
[40]: https://jestjs.io/
[41]: https://apiblueprint.org/
[42]:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
[45]: https://www.npmjs.com/package/next
[46]: https://www.npmjs.com/package/dotenv
[48]: https://babeljs.io
[49]: https://webpack.js.org
[50]: https://jestjs.io
[51]: https://jestjs.io/docs/en/getting-started
[52]: https://eslint.org
[57]: https://nextjs.org/docs/routing/dynamic-routes
[58]: ./CONTRIBUTING.md
[59]: .github/SUPPORT.md
[31]: https://www.npmjs.com/package/faker
