## Installing with Docker

To build the Postgresql container and start up a database, run:
```bash
docker-compose -f docker-compose-postgresql.yml up
```

## Creating database schema

Via Postgresql (make sure you've [installed Postgresql CLI](https://blog.timescale.com/blog/how-to-install-psql-on-mac-ubuntu-debian-windows/)):
```
psql -h hostname -U username -d databasename -f schema.postgresql.sql
```