# artemis-core

## For Developers

### DEV Machine Prerequisites
Git - can be installed ([git site](https://git-scm.com/downloads)).

Node.js - can be installed from [Nodejs.org](https://nodejs.org).

Gulp - can be installed by running `npm i -g gulp`
    
### One time Installation
```sh
git clone https://github.com/LeerixLabs/artemis-core.git
npm install
``` 

### Starts the dev server
Starts the dev server on `http://localhost:8080/webpack-dev-server/`
    
    npm start

### Build development
Сompiles in directory `dist` the file `artemis.core.js` with sourse-map and `artemis.core.min.js`
```sh
gulp  # runs webpack
```

### Publishing
```sh
# for publishing `artemis.core.min.js` to npm registry:
update version on package.json
gulp
npm login
npm publish
```
