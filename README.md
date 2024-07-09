### Mama's Hub


This is an admin web application created to
1. Support the [Electronic version of the MCH Booklet that leverages the Android FHIR SDK](https://github.com/IntelliSOFT-Consulting/kabarak-mhmis-provider-app) 
2. Support Administration Functionality such as user management, reporting etc of the same application.


### Running the application

#### Development Mode

To run the app in a development environment,

- Install the dependencies at the root of the project directory

```

yarn install
```

- Run the dev command which starts both the ui and backend servers

```

yarn dev
```
### Production

To run a production build

##### Prequisites
- Docker
- Docker Compose


#### Using Docker

Use Docker and docker-compose to build and run the images for the entire project or just for the respective repos.

#### Build entire project

```

docker-compose up -d --build`
```
This should bring up the following application.

NOTE: By default, the application will be exposed on ports 8080 and 8081

http://[YOUR-IP-HERE]:8081 - Web UI for the application.
http://[YOUR-IP-HERE]:8080 - Swagger UI Docs for the application's API.


#### Build the UI only

```

docker build -t ./ui
``` 
or 

```

yarn docker:build:ui
```

#### Build the API only

```

docker build -t ./api
```

 or
 
```

yarn docker:build:api
```

Confirm the services are up and running.

```

docker-compose ps
```

If this is the case. Ensure to run Prisma migrations to apply any pending database schema changes with

```

./api/run-dev-migrations.sh
```
