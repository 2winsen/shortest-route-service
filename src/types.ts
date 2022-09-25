export type GraphNode = string | number;
export type Graph = Record<GraphNode, Record<GraphNode, number>>;

export interface Airport {
  airportId: number;
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
  latitude: number;
  longitude: number;
  altitude: number;
  timezone: number;
  dst: string;
  tz: string;
  type: string;
  source: string;
}

export interface Route {
  airline: string;
  airlineId: number;
  sourceAirport: string;
  sourceAirportId: number;
  destinationAirport: string;
  destinationAirportId: number;
  codeshare: string;
  stops: number;
  equipment: string;
  distance?: number;
}

export type RouteWithDistance = Route & { distance: number };
export type AirportMap = Record<Airport['airportId'], Airport>;
