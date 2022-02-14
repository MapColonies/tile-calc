/* eslint-disable @typescript-eslint/no-magic-numbers */
import { CoordinateReferenceSystem, Ellipsoid, ScaleSet, TileGrid } from './interfaces';

export const PIXEL_SIZE = 0.00028; // meters

export const SCALE_FACTOR = 2; // factor between adjacent zoom levels

export const CRS_CRS84: CoordinateReferenceSystem = {
  identifier: 'http://www.opengis.net/def/crs/OGC/1.3/CRS84',
  name: 'WGS 84 longitude-latitude',
};

export const CRS_3857: CoordinateReferenceSystem = {
  identifier: 'http://www.opengis.net/def/crs/EPSG/0/3857',
  name: 'WGS 84 / Pseudo-Mercator',
};

export const ELLIPSOID_WGS84: Ellipsoid = {
  name: 'WGS 84',
  semiMajorAxis: 6378137,
  inverseFlattening: 298.257223563,
};

// scale denominators are calculated as the bellow formula dependant on zoom level
// zoom: ELLIPSOID_WGS84.semiMajorAxis * 2 * Math.PI / 256 / PIXEL_SIZE / 2**zoom,

export const SCALESET_GOOGLE_CRS84_QUAD: ScaleSet = {
  identifier: 'GoogleCRS84Quad',
  scaleDenominators: new Map([
    [0, 559082264.0287178],
    [1, 279541132.0143589],
    [2, 139770566.00717944],
    [3, 69885283.00358972],
    [4, 34942641.50179486],
    [5, 17471320.75089743],
    [6, 8735660.375448715],
    [7, 4367830.1877243575],
    [8, 2183915.0938621787],
    [9, 1091957.5469310894],
    [10, 545978.7734655447],
    [11, 272989.38673277234],
    [12, 136494.69336638617],
    [13, 68247.34668319309],
    [14, 34123.67334159654],
    [15, 17061.83667079827],
    [16, 8530.918335399136],
    [17, 4265.459167699568],
    [18, 2132.729583849784],
    [19, 1066.364791924892],
    [20, 533.182395962446],
  ]),
};

export const SCALESET_GOOGLE_MAPS_COMPATIBLE: ScaleSet = {
  identifier: 'GoogleMapsCompatible',
  scaleDenominators: new Map([
    [0, 279541132.0143589],
    [1, 139770566.00717944],
    [2, 69885283.00358972],
    [3, 34942641.50179486],
    [4, 17471320.75089743],
    [5, 8735660.375448715],
    [6, 4367830.1877243575],
    [7, 2183915.0938621787],
    [8, 1091957.5469310894],
    [9, 545978.7734655447],
    [10, 272989.38673277234],
    [11, 136494.69336638617],
    [12, 68247.34668319309],
    [13, 34123.67334159654],
    [14, 17061.83667079827],
    [15, 8530.918335399136],
    [16, 4265.459167699568],
    [17, 2132.729583849784],
    [18, 1066.364791924892],
    [19, 533.182395962446],
    [20, 266.591197981223],
    [21, 133.2955989906115],
    [22, 66.64779949530575],
    [23, 33.323899747652874],
    [24, 16.661949873826437],
  ]),
};

// WorldCRS84Quad uses modified version of GoogleCRS84Quad which dissmisses the first zoom level
export const SCALESET_GOOGLE_CRS84_QUAD_MODIFIED: ScaleSet = {
  identifier: 'GoogleCRS84Quad',
  scaleDenominators: new Map([
    [0, 279541132.0143589],
    [1, 139770566.00717944],
    [2, 69885283.00358972],
    [3, 34942641.50179486],
    [4, 17471320.75089743],
    [5, 8735660.375448715],
    [6, 4367830.1877243575],
    [7, 2183915.0938621787],
    [8, 1091957.5469310894],
    [9, 545978.7734655447],
    [10, 272989.38673277234],
    [11, 136494.69336638617],
    [12, 68247.34668319309],
    [13, 34123.67334159654],
    [14, 17061.83667079827],
    [15, 8530.918335399136],
    [16, 4265.459167699568],
    [17, 2132.729583849784],
    [18, 1066.364791924892],
    [19, 533.182395962446],
    [20, 266.591197981223],
  ]),
};

// some tile grid parameters are taken from https://docs.opengeospatial.org/is/17-083r2/17-083r2.html
export const TILEGRID_WORLD_CRS84: TileGrid = {
  identifier: 'WorldCRS84Quad',
  title: 'CRS84 for the World',
  boundingBox: { west: -180, south: -90, east: 180, north: 90 },
  supportedCRS: CRS_CRS84,
  wellKnownScaleSet: SCALESET_GOOGLE_CRS84_QUAD_MODIFIED,
  numberOfMinLevelTilesX: 2,
  numberOfMinLevelTilesY: 1,
  tileWidth: 256,
  tileHeight: 256,
};

export const TILEGRID_WEB_MERCATOR: TileGrid = {
  identifier: 'WebMercatorQuad',
  title: 'Google Maps Compatible for the World',
  boundingBox: { west: -180, south: -85.05112877980659, east: 180, north: 85.05112877980659 },
  supportedCRS: CRS_3857,
  wellKnownScaleSet: SCALESET_GOOGLE_MAPS_COMPATIBLE,
  numberOfMinLevelTilesX: 1,
  numberOfMinLevelTilesY: 1,
  tileWidth: 256,
  tileHeight: 256,
};
