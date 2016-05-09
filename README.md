# artemis-core

## Description

TBD

## Initial Setup

1) If needed, install Git from [git-scm.com](https://git-scm.com/downloads)

2) If needed, install Node.js from [nodejs.org](https://nodejs.org)

3) Open cmd.

4) Clone the Git repository to your local machine by running cmd:
```sh
git clone https://github.com/LeerixLabs/artemis-core.git c:/github/artemis-core
```

5) Change directory to within your local repository by running cmd:
```sh
cd c:/github/artemis-core
```

6) Import npm dependencies by running cmd:
```sh
npm i
```

7) Ensure all was done correctly by running cmd:
```sh
gulp
```

## Development

### Building the Library Files
```sh
gulp pack
```
This will build 3 files  - artemis.core.js, artemis.core.js.map, and artemis.core.min.js
The files will be created in the ./dist/ directory.

### Running the Tests
```sh
gulp test
```
This will execute all the tests inside the ./test/jasmine/ directory

### Launching the Dev Server
```sh
gulp serve
```
This will launch the dev server with a dummy site on http://localhost:8082/
Note: The port can be changed in ./gulp/gulp-dev-server.js

## Publishing

1) Update the new version number on package.json

2) Run these via cmd:
```sh
gulp
npm login
npm publish
```
This will publish artemis.core.min.js to the npm Registry.

## Links

- [artemis-core on GitHub](https://github.com/LeerixLabs/artemis-core)
- [artemis-core on Travis](https://travis-ci.org/LeerixLabs/artemis-core/builds)
- [artemis-core on npm](https://www.npmjs.com/package/artemis-core)
