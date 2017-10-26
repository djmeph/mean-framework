# mean-framework
MEAN stack framework for building an app

This is a basic MEAN stack framework to get started on building an app with basic signup, login, account settings and recovery. 

Basic requirements:

* Node.js
* MongoDB
* Grunt-cli

Optional components:

* nodemon
* pm2

The repository is setup to provide two environments: development and production.

** Development Environment **

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

To run the app in development mode, set NODE_ENV environment variable to "dev."

Example: 

`NODE_ENV=dev npm start`

** Production Environment **

Instead of using config.json, use environment variables. 

Example:

```
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
```

To get verbose console messages in production mode set NODE_ENV to "verbose."

