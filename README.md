# SHORTEST-ROUTE-SERVICE
## Approach
- I have downloaded airports and routes data from https://openflights.org/data.html, files: `airports.dat` and `routes.dat`
- Converted files to json (easy done since both files are CSV like)
- Distances are calculated using https://github.com/manuelbieh/geolib library. One limitation is that all distances are 2d based and not sphere based :( 
- For finding shortest path using Djikstra algorithm which is taken from github https://github.com/tcort/dijkstrajs
- To make sure algorithm works for limited nodes count adjusted it to store all traversed nodes paths (check `djikstra.ts`)
- Wrapped code into NestJS service
- If built locally service url is http://localhost:3000/shortestPath/:source/:destination, where :source, and :destination are airport IATA or ICAO codes, whichever is used result will be generated in same format
- If built locally Swagger docs are found http://localhost:3000/api
- Tried to cover all the main files with unit tests
- Initial data is stored in mongoDB database

## Most used scripts
- `yarn test` to run all unit tests
- `yarn test:cov` to run all unit tests + generate coverage report
- `yarn lint` to run linter on codebase
- `yarn start` to start service in dev mode

## Still ToDO
- solve advanced part of algorithm with possible airport change within 100km 
- store passwords in docker secrets
- use env variables for build on different environments