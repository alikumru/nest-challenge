/**
 * README
 * This file is referenced in the docker-compose file and mounted to the docker container of the Postgres Database
 * This script is automatically executed everytime the database container is (re)started
 **/

/**
 * Create a new database user called `develop` that will be used to connect to the database for development purposes
 * Assign the password `develop` to the user
 **/
CREATE USER develop;
ALTER USER develop WITH PASSWORD 'develop';

/**
 * Create a new database called 'foreside_assessement'
 * Grant the user: `develop` all privilges on this database
 **/
CREATE DATABASE foreside_assessement;
GRANT ALL PRIVILEGES ON DATABASE foreside_assessement TO develop;