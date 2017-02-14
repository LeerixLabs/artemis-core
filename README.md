# artemis-core

[![Build Status](https://travis-ci.org/LeerixLabs/artemis-core.svg?branch=master)](https://travis-ci.org/LeerixLabs/artemis-core)
[![NPM version](http://img.shields.io/npm/v/artemis-core.svg)](https://www.npmjs.org/package/artemis-core)

## Description

TBD

## Initial Setup

1) If needed, install Git from [git-scm.com](https://git-scm.com/downloads)

2) If needed, install Node.js from [nodejs.org](https://nodejs.org)

3) Open cmd.

4) If needed, install Gulp by running cmd:
```sh
npm install -g gulp
```

5) Clone the Git repository to your local machine by running cmd:
```sh
git clone https://github.com/LeerixLabs/artemis-core.git c:/github/artemis-core
```

6) Change directory to within your local repository by running cmd:
```sh
cd c:/github/artemis-core
```

7) Import npm dependencies by running cmd:
```sh
npm i
```

8) Ensure all was done correctly by running cmd:
```sh
gulp
```

## Development

### Building the Library Files
```sh
gulp pack
```
This will build these files into the ./dist/ directory:
- artemis.core.js
- artemis.core.js.map
- artemis.core.min.js

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

If needed, the port can be changed in ./gulp/gulp-dev-server.js

## Publishing

1) Validate that everything is okay by running cmd:
```sh
gulp
```

2) Update the new version number on ./package.json

3) Commit and push the change.

4) Validate Travis build passes.

5) Create a new release on GitHub.

6) Login to npm by running cmd:
```sh
npm login
```

7) Publish artemis.core.min.js to the npm registry by running cmd:
```sh
npm publish
```

## Links

- [artemis-core on GitHub](https://github.com/LeerixLabs/artemis-core)
- [artemis-core on Travis](https://travis-ci.org/LeerixLabs/artemis-core/builds)
- [artemis-core on npm](https://www.npmjs.com/package/artemis-core)
