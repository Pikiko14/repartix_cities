export class CityEntity {
  private _id: number;
  private _name: string;
  private _province: string;
  private _cod_city: string;
  private _lat: number;
  private _lon: number;
  private _zones: Zone[];
  private _parent_id: string;

  constructor(
    id: number,
    name: string,
    province: string,
    cod_city: string,
    lat: number,
    lon: number,
    parentId: string,
    zones: Zone[] = [],
  ) {
    this._id = id;
    this._name = name;
    this._province = province;
    this._cod_city = cod_city;
    this._lat = lat;
    this._lon = lon;
    this._zones = zones;
    this._parent_id = parentId;
  }

  // ID
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  // Name
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  // Province
  get province(): string {
    return this._province;
  }
  set province(value: string) {
    this._province = value;
  }

  // Code City
  get cod_city(): string {
    return this._cod_city;
  }
  set cod_city(value: string) {
    this._cod_city = value;
  }

  // Latitude
  get lat(): number {
    return this._lat;
  }
  set lat(value: number) {
    this._lat = value;
  }

  // Longitude
  get lon(): number {
    return this._lon;
  }
  set lon(value: number) {
    this._lon = value;
  }

  // Zones
  get zones(): Zone[] {
    return this._zones;
  }
  set zones(value: Zone[]) {
    this._zones = value;
  }

  // parent id
  get parent_id(): string {
    return this._parent_id;
  }

  set parent_id(value: string) {
    this._parent_id = value;
  }
}

export class Zone {
  private _id: number;
  private _name: string;
  private _cod_zone: string;
  private _lat: number;
  private _lon: number;

  constructor(
    id: number,
    name: string,
    cod_zone: string,
    lat: number,
    lon: number,
  ) {
    this._id = id;
    this._name = name;
    this._cod_zone = cod_zone;
    this._lat = lat;
    this._lon = lon;
  }

  // ID
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  // Name
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  // Code Zone
  get cod_zone(): string {
    return this._cod_zone;
  }
  set cod_zone(value: string) {
    this._cod_zone = value;
  }

  // Latitude
  get lat(): number {
    return this._lat;
  }
  set lat(value: number) {
    this._lat = value;
  }

  // Longitude
  get lon(): number {
    return this._lon;
  }
  set lon(value: number) {
    this._lon = value;
  }
}
