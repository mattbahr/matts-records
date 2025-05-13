#!/bin/bash

printf "\ndb.createUser({ user: '$MONGODB_BASIC_USERNAME', pwd: '$MONGODB_BASIC_PASSWORD', roles: [{ role: 'read', db: 'records_db' }]});" >> "./docker-entrypoint-initdb.d/mongo-init.js"