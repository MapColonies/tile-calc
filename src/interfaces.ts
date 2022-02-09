import { Zoom, Longtitude, Latitude } from './types';

export interface ScaleSet {
  identifier: string;
  scaleDenominators: Map<Zoom, number>;
}

export interface CoordinateReferenceSystem {
  // partially implemented, currently unused
  identifier: string;
  name: string;
}

export interface Ellipsoid {
  name: string;
  semiMajorAxis: number;
  inverseFlattening: number;
}

export interface LonLat {
  lon: Longtitude;
  lat: Latitude;
}

export interface Tile {
  x: number;
  y: number;
  z: number;
  metatile?: number;
}

export interface BoundingBox {
  west: Longtitude;
  south: Latitude;
  east: Longtitude;
  north: Latitude;
}

export interface TileGrid {
  identifier: string;
  title?: string;
  abstract?: string;
  keywords?: string;
  boundingBox: BoundingBox;
  supportedCRS: CoordinateReferenceSystem; // Currently unused
  wellKnownScaleSet: ScaleSet; // Currently at least one must be given
  numberOfMinLevelTilesX: number;
  numberOfMinLevelTilesY: number;
  tileWidth: number;
  tileHeight: number;
}
