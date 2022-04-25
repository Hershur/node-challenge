# Node Challenge

Take home test for Node.js developers.

## The challenge

This challenge has been designed to measure your knowledge of Node.js, Express, Typescript and various technologies, like monorepos, databases and testing. For your exercise, you will be enhancing this API which serves as the backend for the Pleo app. Whenever a user of the app navigates to the expenses view, it calls this API to collect the list of expenses for that user.

Your objective is to write this new route to fetch the list of expenses for a given user. Right now that domain is empty, so you'll have to build everything from scratch- but you can look over at the user domain for inspiration. Please make sure that the endpoint scales adequately and supports paging, sorting and filtering. Additionally, we would also like you to write some tests for your route.

Finally, as a bonus objective, try to improve any aspect of this API. It could be to add more TS types, better security, tests, add features, graphql support, etc. 

## Instructions

Fork this repo with your solution. Ideally, we'd like to see your progression through commits, and don't forget to update the README.md to explain your thought process.

Please let us know how long the challenge takes you. We're not looking for how speedy or lengthy you are. It's just really to give us a clearer idea of what you've produced in the time you decided to take. Feel free to go as big or as small as you want.

## Install

Make sure that you have a modern version of `yarn` that supports workspaces (`>= 1.0`), then run:

```bash
yarn
```

You will also need to [install Postgres](https://www.postgresqltutorial.com/install-postgresql-macos/), create a `challenge` database and load the sql file `dump.sql`:

```bash
psql challenge < dump.sql
```

## Start

To enable logs, use the standard `NODE_DEBUG` flag with the value `DEBUG`

```bash
NODE_DEBUG=DEBUG yarn start
```

## Test

Make sure that you have a modern version of `yarn` that supports workspaces, then run:

```bash
yarn test
```

The command above will run the following test suites sequentially:

| Test suite | Run command | Description |
-------------|-------------|-------------|
| Unit | `yarn test:unit` | Simple unit tests. |
| Mid-level | `yarn test:mid-level` | Small integration tests that integration of small components together.  |
| Acceptances | `yarn test:acceptance` | Large integration tests, system tests, end-to-end tests. |


Happy hacking 😁!


# Thought Process

- __Created *docker-compose.yml* file to configure the postgres and app server images__
    - when the postgres db container is spinned up, postgres creates the 'challenge' database from the enviroment variable __*POSTGRES_DB=challenge*__
    - on initialization of the database, postgres also runs the __*dump.sql*__ scripts mounted on the container as defined in the *docker-compose.yml* file which creates the __*expenses*__ and __*users*__ table in the __*challenge*__ db and loads the required data into each table respectively (note: postgres will only initiliaze the db if no db  exists)
    ``` ./dump.sql:/docker-entrypoint-initdb.d/dump.sql ```
    - *pgdata* is also mounted on the container to persist postgres db data 
    ``` ./pgdata:/var/lib/postgresql/data ```
    - used __*docker-compose up*__ to spin up both containers (postgresdb and app server) or __*docker-compose up --build*__ to rebuild


- __Implemented ```*/get-expense*```,  ```*/get-user-expenses*``` and ```*/get-all-expenses*``` endpoints__
    -  ```*/get-expense*``` returns a particular expense by id

    ``` 
        http://localhost:9001/expense/v1/get-expense?expenseId=3e920f54-49df-4d0b-b11b-e6f08e3a2dca 
    ```   
    
    - ```*/get-user-expenses*``` returns list of expenses tied to a particular user
    
    ```
        http://localhost:9001/expense/v1/get-user-expenses?userId=da140a29-ae80-4f0e-a62d-6c2d2bc8a474
    ```   
     
    - ```*/get-all-expenses*``` returns all the expenses with a maximum of 10 records per page, filter records based on merchant_name, currency and status, sort records based on  merchant_name,currency,status,amount_in_cents and date_created with __comma-separated values as seen in the example url below__
    
    ```
        http://localhost:9001/expense/v1/get-all-expenses?page=1&size=5&sortBy=merchant_name,amount_in_cents&filter=pending
    ```   
    
- __Added GraphQL support__
    - Implemented GraphQL endpoint ```http://localhost:9001/graphql``` wrapped around the existing  ```*/get-expense*``` and ```*/get-user-expenses*``` REST APIs
    - Implemented *__expense__* resolver to fetch expense details by given id
    
    ```
    
        curl --request POST \
          --header 'content-type: application/json' \
          --url http://localhost:9001/graphql \
          --data '{"query":"query {    expense(expenseId: \"f20866f9-7d46-45f2-822c-4b568e216a13\") }"}'
          
    ```
    
    - Implemented *__userExpenses__* resolver to fetch expenses of a specific user
    
    ```
    
        curl --request POST \
          --header 'content-type: application/json' \
          --url http://localhost:9001/graphql \
          --data '{"query":"query {    userExpenses(userId: \"da140a29-ae80-4f0e-a62d-6c2d2bc8a474\") }"}'
    
    ```
    
     - Implemented *__allExpenses__* resolver to fetch all expenses with a maximum of 10 records per page
    
    ```
    
        curl --request POST \
          --header 'content-type: application/json' \
          --url http://localhost:9001/graphql \
          --data '{"query":"query {\n    allExpenses (\n        paginationOptions: {\n            page: \"1\",\n            size: \"5\",\n            filter: \"pending\"\n            sortBy: \"merchant_name\"\n        }\n    )\n}"}'

    ```




