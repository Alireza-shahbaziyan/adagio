// import { PaginatedResponse } from "./response";

export interface Province {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  province_id: number;
}

export type ProvinceResponse = Province[];
export type CityResponse =City[];