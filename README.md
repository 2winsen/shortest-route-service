# SHORTEST-ROUTE-SERVICE
## Approach
- I have downloaded airports and routes data from https://openflights.org/data.html, files: `airports.dat` and `routes.dat`
- Converted files to json (easy done since both files are CSV like)
- For finding shortest path using Djikstra algorithm which is taken from github https://github.com/tcort/dijkstrajs
- To make sure algorithm works for limited nodes count adjusted it to store all traversed nodes paths (check `djikstra.ts`)
- Wrapped code into NestJS service
- If built locally Swagger docs are found http://localhost:3000/api
- Tried to cover all the main files with unit tests

## Most used scripts
- `yarn test` to run all unit tests
- `yarn test:cov` to run all unit tests + generate coverage report
- `yarn lint` to run linter on codebase
- `yarn start` to start service in dev mode