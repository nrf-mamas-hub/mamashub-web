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

This application uses the **postgresql** database and **prisma** for database migrations. Note that prisma will be installed as a dependency in later steps.
Postgres needs to be installed, however. Please follow the installation guide for your specific platform. The steps outlined below are for a **Linux** platform. (If you already have installed postgresql, proceed to the database or user creation step).

- Install postgresql
  
```
sudo apt install postgresql
```

- Start the postgresql service
```
sudo systemctl start postgresql
```
 or

```
sudo service postgresql start
```

- Switch to the _postgres_ user and open the postgresql prompt
```
sudo -i -u postgres
psql
```
- Create a new user (matching the credentials of your database)
 ```
CREATE USER yourusername WITH PASSWORD 'yourpassword';
```
You can look to grant the necessary privileges to your created user

- Create a new database (dbname should match the database name provided in the database configurations in your code)
```
CREATE DATABASE dbname;
```
You can now proceed to your IDE terminal (or where your project folder is open)

- Navigate into the `api` directory
```
cd api
```
- Run database migrations
```
yarn run prisma:migrate
```
Once the migrations are succesful, you can now proceed to set up the HAPI Server. Skip this step if you already have the server ready. 
If you do not have docker installed, please ensure to install it for your appropriate platform

In your terminal,
- Run the following command to get the latest image of HAPI FHIR
```
sudo docker pull hapiproject/hapi:latest
```

- Create a HAPI FHIR container
```
sudo docker run -p 8080:8080 hapiproject/hapi:latest
```

- Run the dev command which starts both the ui and backend servers (at the root of your project).

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
docker-compose up -d --build
```
This should bring up the following application.

NOTE: By default, the HAPI FHIR server will be exposed on ports 8080.

http://[YOUR-IP-HERE]:8080 - Web UI for the HAPI FHIR application.
http://[YOUR-IP-HERE]:8080/fhir/swagger-ui/ - Swagger UI Docs for the application's API.


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
