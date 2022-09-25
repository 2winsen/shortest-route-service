import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { getDistance } from 'geolib';
import { groupBy, keyBy } from 'lodash';
import { Airport, AirportMap, Graph, Route, RouteWithDistance } from './types';
import { dijkstra } from './utils/dijkstra';
import { Db } from 'mongodb';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private graph: Partial<Graph> = {};
  private icaoToAirport: Partial<Record<string, Airport>> = {};
  private iataToAirport: Partial<Record<string, Airport>> = {};
  private idToAirport: Partial<Record<string, Airport>> = {};

  constructor(@Inject('DATABASE_CONNECTION') private db: Db) { }

  private async findAirports(): Promise<Airport[]> {
    return await this.db.collection<Airport>('airports').find().toArray();
  }

  private async findRoutes(): Promise<Route[]> {
    return await this.db.collection<Route>('routes').find().toArray();
  }

  private createGraph(airports: Airport[], routes: Route[]): Graph {
    const validRoutes = this.filterValidRoutes(routes, this.idToAirport);
    const bySourceAirportId = groupBy(validRoutes, 'sourceAirportId');
    for (const airport of airports) {
      const adjacentRoutes = bySourceAirportId[airport.airportId] ?? [];
      // Optimization: much faster than reduce
      const graphAdjacentNodes: Partial<Record<string, number>> = {};
      for (const route of adjacentRoutes) {
        graphAdjacentNodes[route.destinationAirportId] = route.distance;
      }
      this.graph[airport.airportId] = graphAdjacentNodes;
    }
    return this.graph;
  }

  private filterValidRoutes(routes: Route[], airportsMap: AirportMap): RouteWithDistance[] {
    const validRoutes: RouteWithDistance[] = [];
    for (const route of routes) {
      const { sourceAirportId, destinationAirportId } = route;
      const sourceAirport = airportsMap[sourceAirportId];
      const destinationAirport = airportsMap[destinationAirportId];
      const validAirportId = typeof sourceAirportId === 'number' && typeof destinationAirportId === 'number';
      const existingAirportId = sourceAirport && destinationAirport;
      if (validAirportId && existingAirportId) {
        const distance = getDistance(
          { latitude: sourceAirport.latitude, longitude: sourceAirport.longitude },
          { latitude: destinationAirport.latitude, longitude: destinationAirport.longitude },
        );
        validRoutes.push({ ...route, distance: distance });
      }
    }
    return validRoutes;
  }

  async onModuleInit() {
    const airports = await this.findAirports();
    const routes = await this.findRoutes();
    this.icaoToAirport = keyBy(airports, (item) => item.icao);
    this.iataToAirport = keyBy(airports, (item) => item.iata);
    this.idToAirport = keyBy(airports, (item) => item.airportId);
    const t0 = Date.now();
    this.graph = this.createGraph(airports, routes);
    const t1 = Date.now();
    this.logger.log(`Creating a GRAPH took ${t1 - t0} millis.`);
  }

  private isIATA(value: string) {
    return value.length === 3;
  }

  private formatResult([path, distance]: [string[], number], iata: boolean): string {
    const formattedPath = [];
    for (const airportId of path) {
      formattedPath.push(this.idToAirport[airportId][iata ? "iata" : "icao"]);
    }
    const distanceKm = distance / 1000;
    return `${formattedPath.join('->')} distance ${distanceKm.toFixed(2)} km`;
  }

  getShortestPath(source: string, destination: string): string {
    const iata = [source, destination].every(this.isIATA);
    let sourceAirport: Airport;
    let destinationAirport: Airport;
    if (iata) {
      sourceAirport = this.iataToAirport[source];
      destinationAirport = this.iataToAirport[destination];
    } else {
      sourceAirport = this.icaoToAirport[source];
      destinationAirport = this.icaoToAirport[destination];
    }
    if (!sourceAirport || !destinationAirport) {
      throw new BadRequestException('Invalid source or destination airport codes (please use IATA or ICAO).');
    }
    try {
      const t2 = Date.now();
      const MAX_NODES = 5;
      const pathWrapper = dijkstra.find_path(
        this.graph,
        sourceAirport.airportId,
        destinationAirport.airportId,
        MAX_NODES
      );
      const t3 = Date.now();
      this.logger.log(`Finding shortest path took ${t3 - t2} millis.`);
      return this.formatResult(pathWrapper, iata);
    } catch (e) {
      this.logger.log(e.message);
      throw new BadRequestException(`Could not find a path from ${source} to ${destination}.`);
    }

  }
}
