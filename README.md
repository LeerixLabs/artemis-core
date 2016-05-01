# artemis-core

## For Developers

### DEV Machine Prerequisites
Git - can be installed from [git site](https://git-scm.com/downloads).
Node.js - can be installed from [Nodejs.org](https://nodejs.org).
Gulp - can be installed by running `npm i -g gulp`
    
### Cloning the Repository
# This will cloning the repository to your local machine
```sh
git clone https://github.com/LeerixLabs/artemis-core.git
npm install
``` 

### Launching the Dev Server
# This will launch the dev server with a dummy site on `http://localhost:8080/`
# You can change the default port on `\node_modules\webpack-dev-server\bin\webpack-dev-server.js`
```sh
npm start
```

### Building the Library Files
# This will build `artemis.core.js`, `artemis.core.js.map`, and `artemis.core.min.js` into `dist` directory
```sh
gulp
```

### Publishing to the npm Repository
# This will publish `artemis.core.min.js` to the npm registry
# first, update the new version number on package.json
```sh
gulp
npm login
npm publish
```
