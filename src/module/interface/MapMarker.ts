export class MapMarker {
  public position: Position;
  constructor(lat: number, lng: number) {
    this.position = {
      lat: lat,
      lng: lng
    }
  }
}

export interface Position {
  lat: number;
  lng: number;
}
