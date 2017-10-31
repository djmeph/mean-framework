# mean-framework
### MEAN stack framework for building an app

This is a basic MEAN stack framework to get started on building an app with signup, login, account settings and recovery.

**Requirements:**

* Node.js
* MongoDB
* Yarn
* Gulp

**Optional components:**

* nodemon
* pm2

Before you start, prepare your dependencies and compile Gulp tasks with `yarn install`.

The repository is setup to provide two environments: development and production.

## Development Environment

For the development environment, you will need to create a file called `config.json` in the root folder. It should look like this:

```
{
  "MONGODB_URI": "mongodb://localhost:27017/mean-framework",
  "PORT": 3000,
  "MACHINE_NAME": "mean-framework",
  "SECRET": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "COOKIE_DOMAIN": "localhost",
  "COOKIE_MAXAGE": "604800000",
  "APP_NAME": "MEAN Framework",
  "GMAIL_ADDRESS": "example@gmail.com",
  "GMAIL_PASSWORD": "gmail-password",
  "NOREPLY_EMAIL": "noreply@example.com",
  "SALT_WORK_FACTOR": 11
}
```

To run the app in development mode, set NODE_ENV environment variable to `dev`.

Example:

`NODE_ENV=dev npm start`

## Production Environment

Instead of using config.json, use environment variables.

Example:

```
#!/bin/bash
export MONGODB_URI="mongodb://localhost:27017/mean-framework"
export PORT="80"
export MACHINE_NAME="mean-framework"
export SECRET="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
export COOKIE_DOMAIN="example.com"
export COOKIE_MAXAGE="604800000"
export APP_NAME="MEAN Framework"
export GMAIL_ADDRESS="example@gmail.com"
export GMAIL_PASSWORD="gmail-password"
export NOREPLY_EMAIL="noreply@example.com"
export SALT_WORK_FACTOR="11"
npm start
```

To get verbose console messages in production mode set NODE_ENV to `verbose`.

## File and Folder Structure

```
.
├── _src
│   ├── controllers
│   ├── directives
│   ├── services
│   └── filters
├── less
│   └── build
├── libs
├── models
├── routes
├── services
├── views
└── www
    ├── components
    └── views
```
* src: Custom front-end javascript
* src/controllers: Angular Controllers
* src/directives: Angular Directives
* src/services: Angular Services
* src/filters: (No filters Included) Angular Filters
* less: Custom CSS structure
* less/build: LESS components for building CSS
* libs: Endpoint logic
* models: MongoDB Database Schema
* routes: Endpoint routes, middleware and handler references
* services: Services with promises for endpoints
* views: Pug html templates
* www: Root web server folder
* www/components: Symlinks to front-end dependencies
* www/views: Angular view templates

## Gulp tasks

`gulp` Compiles javascript, CSS, and HTML in debugging mode.
* pug: Compiles index.html for Angular app
* js: Concatenates javascript with mappings but doesn't minify
* less: Generates CSS and mappings for debugging stylesheet.

`gulp --type production` Compiles javascript, CSS, and HTML in production mode.
* pug: Compiles index.html for Angular app
* js: Concatenates and minifies javascript files with mappings
* less: Generates minified CSS file with mappings
