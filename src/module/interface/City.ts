import {User} from "@/module/interface/User";

export interface City {
  brand_id: number;
  id: number;
  name: string;
  thumb: string;
  shipping_base_km: number;
  shipping_base_fee: number;
  shipping_increment_fee: number;
  settings: Settings;
}

export interface Settings {
  tax_rate: string;
}

export interface CityCategory {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

