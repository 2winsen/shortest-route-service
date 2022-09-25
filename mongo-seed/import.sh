#!/bin/sh

mongoimport --host mongodb \
--authenticationDatabase admin \
--username root \
--password example \
--db shortest-path-service \
--type json \
--collection airports \
--file /airports.json --jsonArray
mongoimport --host mongodb \
--authenticationDatabase admin \
--username root \
--password example \
--db shortest-path-service \
--type json \
--collection routes \
--file /routes.json --jsonArray