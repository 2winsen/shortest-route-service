# SHORTEST-ROUTE-SERVICE
## Approach
- I have downloaded airports and routes data from https://openflights.org/data.html, files: `airports.dat` and `routes.dat`
- Converted files to json (easy done since both files are CSV like)
- Distances are calculated using https://github.com/manuelbieh/geolib library. One limitation is that all distances are 2d based and not sphere based :( 
- For finding shortest path using Djikstra algorithm which is taken from github https://github.com/tcort/dijkstrajs
- To make sure algorithm works for limited nodes count adjusted it to store all traversed nodes paths (check `djikstra.ts`)
- Wrapped code into NestJS service + MongoDB for data
- If built locally service url is http://localhost:3000/shortestRoute/:source/:destination, where :source, and :destination are airport IATA or ICAO codes, whichever is used result will be generated in same format
- If built locally Swagger docs are found http://localhost:3000/api
- Tried to cover all the main files with unit tests

## Run locally
1. Create all dependent services using `docker:dev`
1. Start local server by `yarn start:dev`
1. To access local server go to http://localhost:3000/api (or http://localhost/api to access docker one)

## Run on production (through using docker-compose, which is not recommended by docker)
1. Create all dependent services using `docker:prod`
1. To access server go to http://localhost/api

## Most used scripts
- `yarn test` to run all unit tests
- `yarn test:cov` to run all unit tests + generate coverage report
- `yarn lint` to run linter on codebase
- `yarn start` to start service in dev mode

## Still TODO
- solve advanced part of algorithm with possible airport change within 100km 
- store passwords in docker secrets