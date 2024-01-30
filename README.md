# SQL Tracing Example
This repository contains a demonstration environment for a prototype that extracts traces from PostgreSQL logs.
The demonstration can be run using `docker compose` since all components are available as containers.

The following is a high-level overview over the components and flows of the environment:

![high level overview over the test environment](./complete_local_setup.png "High level overview over the test environment")

## Initial Setup
To start the environment navigate to the `infra` directory and run
```sh
docker compose up
```

Connect to `Adminer` to setup the database on [Adminer UI](http://localhost:8080/?pgsql=db&username=postgres). Enter `db` in the server field and use the user `postgres` and password `example` to log in.

Once connected create a database `knexdb`. Select the database and chose link "SQL Command" to enter any SQL command or use this link [SQL Command on Adminer](http://localhost:8080/?pgsql=db&username=postgres&db=knexdb&ns=public&sql=).

Enter the following SQL statements into the field and execute it:
```sql
On db knexdb
CREATE USER knexuser WITH PASSWORD 'knexpw';
GRANT ALL PRIVILEGES ON SCHEMA public to knexuser;

CREATE USER oteluser WITH PASSWORD 'otelpw';

GRANT pg_monitor TO oteluser;

CREATE EXTENSION pg_stat_statements
```

The database should now be ready and the application and OpenTelemetry Collector should be able to connect. But the schema will still need to be created and example data be loaded. Use the following commands to do it:

```sh
docker run -e POSTGRES_HOST=host.docker.internal -e DATABASE_NAME=knexdb -e POSTGRES_USER=knexuser -e POSTGRES_USER_PW=knexpw -e POSTGRES_PORT=5432 --entrypoint npm infra-node-example-app run migrate

docker run -e POSTGRES_HOST=host.docker.internal -e DATABASE_NAME=knexdb -e POSTGRES_USER=knexuser -e POSTGRES_USER_PW=knexpw -e POSTGRES_PORT=5432 --entrypoint npm infra-node-example-app run seed
```

## Interacting with the example node application
The example node application is a very simple model of a web shopping backend.
It has a login and authentication functionality and provides the ability to add
products to a shopping cart, as well as an order action on that cart, which clears
the cart and puts the items in a purchase table.

You can request an authentication token for a user using the following command:
```sh
curl -v -H "Content-Type: application/json" -X POST --data '{"email": "johnwick@example.com", "password": "Password"}' http://localhost:3000/api/user/login
```

You will receive a response of sort:
```json
{"id":3,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozfSwiaWF0IjoxNzA2NjQyMjM5LCJleHAiOjE3MDY4MTUwMzl9.1daPjANrgqZPiu9S7xfGZIOZW7-EpLy-mrDuk21Bu7M"}
```

Copy the token and set it as your `AUTHTOKEN` environment variable:
```sh
AUTHTOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozfSwiaWF0IjoxNzA2NjQyMjM5LCJleHAiOjE3MDY4MTUwMzl9.1daPjANrgqZPiu9S7xfGZIOZW7-EpLy-mrDuk21Bu7M
```

You can now run the following requests:

Query your cart:
```sh
curl -v -H "x-auth-token: $AUTHTOKEN" http://localhost:3000/api/cart
```

Add an item to your cart:
```sh
curl -v -H "x-auth-token: $AUTHTOKEN" -H "Content-Type: application/json" -X POST --data '{"productId":1,"quantity":1}' http://localhost:3000/api/cart
```

Order the content of your cart:
```sh
curl -v -H "x-auth-token: $AUTHTOKEN" -X POST http://localhost:3000/api/cart/order
```

View your past "purchases":
```sh
curl -v -H "x-auth-token: $AUTHTOKEN" http://localhost:3000/api/purchase
```

View the items of a specific purchase:
```sh
curl -v -H "x-auth-token: $AUTHTOKEN" http://localhost:3000/api/purchase/4/items
```


## Viewing Telemetry
- Traces can be viewed in Jaeger on [http://localhost:16686](http://localhost:16686)
- Metrics can be viewed in Prometheus on [http://localhost:9090/](http://localhost:9090/)
- Logs can be viewed using the `docker logs <container name>` command