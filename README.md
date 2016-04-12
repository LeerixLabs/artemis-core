# artemis-core

## For Developers

### DEV Machine Prerequisites
Node.js - can be installed from `https://nodejs.org`
Gulp - can be installed by running `npm i -g gulp`
    
### One time Installation
Clone the GitHub repository to your local machine.

    npm install

### On Work Start
Starts the dev server on `http://localhost:8080/webpack-dev-server/`
    npm start

### Build development

    gulp //runs webpack

### Build

    npm run build # runs webpack

### Publishing
```sh
# for publishing to npm registry:
npm run build
npm publish
```
