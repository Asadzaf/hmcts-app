Hello! 

This is my simple full stack application for the HMCTS application!

Below I will explain the project structure, but if you would like to keep 
it simple and just run the app, look underneath the `Running the application section`:

### Prerequisites :
Java 21
mvn

### Running the application

`mvn clean install` (install dependencies)
`mvn spring-boot:run` (run app)
`mvn test` (run all tests)

this application will run [here](http://localhost:8080/tasks)

h2 database link : http://localhost:8080/db

database login : username (hmcts) password (password)


### Project Structure :

The `/tasks` endpoint is where everything will be, the only differences is that you will have to change the request type: `GET, PUT, POST, DELETE`.
This was to ensure simplicity and follow best practices.

Controller :
I have made it a single purpose 'microservice', as we will only be dealing with tasks.

Service class:
This service class uses the TaskRepository and adds on to the more basic functions of it, allowing for pageable responses etc.

Repository:
A JPA repository for simple CRUD functions.

Database:
A non-persistent H2 in memory database was chosen for simplicity and ease of rerunning for the testing and assessment of this application.

Tests: 
2 test classes, one for the controller, one for the service, allowing for integration and unit tests.

Model : 
One Task model

Dto :
One DTO that can be added to so that more fields can be included in the update request in the future.