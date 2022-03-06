import { Zoom, Longtitude, Latitude } from './types';

/**
 * An interface for a well known scale set. {link https://docs.opengeospatial.org/is/17-083r2/17-083r2.html#56|OGC spec}
 */
export interface ScaleSet {
  identifier: string;
  scaleDenominators: Map<Zoom, number>;
}

/**
 * An interface for a coordinate reference system (CRS)
 */
export interface CoordinateReferenceSystem {
  // partially implemented, currently unused
  identifier: string;
  name: string;
}

/**
 * An interface for an oblate ellipsoid
 */
export interface Ellipsoid {
  name: string;
  semiMajorAxis: number;
  inverseFlattening: number;
}

/**
 * An interface for a longtitude and latitude pair on an ellipsoid
 */
export interface LonLat {
  lon: Longtitude;
  lat: Latitude;
}

/**
 * An interface for a tile that supports a metatile definition
 */
export interface Tile {
  x: number;
  y: number;
  z: number;
  metatile?: number;
}

/**
 * Represents a bounding box in terms of longtitude and latitude
 */
export interface BoundingBox {
  /**Longtitude of the west edge of the bounding box */
  west: Longtitude;
  /**Latitude of the south edge of the bounding box */
  south: Latitude;
  /**Longtitude of the east edge of the bounding box */
  east: Longtitude;
  /**Latitude of the north edge of the bounding box */
  north: Latitude;
}

/**
 * An interface for a two dimmensional tile grid. See `TileMatrixSet2D` in {@link https://docs.opengeospatial.org/is/17-083r2/17-083r2.html#15|OGC spec}
 */
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
