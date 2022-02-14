import { SCALE_FACTOR, TILEGRID_WORLD_CRS84 } from './constants';
import { BoundingBox, LonLat, Tile, TileGrid } from './interfaces';
import { Limits, Zoom } from './types';
import { validateBoundingBox, validateLonlat, validateMetatile, validateTile, validateTileGrid, validateZoomLevel } from './validations';

function clamp(value: number, minValue: number, maxValue: number): number {
  if (value < minValue) {
    return minValue;
  }

  if (value > maxValue) {
    return maxValue;
  }

  return value;
}
function tileHeight(zoom: Zoom, referenceTileGrid: TileGrid): number {
  return (
    (referenceTileGrid.boundingBox.north - referenceTileGrid.boundingBox.south) / (referenceTileGrid.numberOfMinLevelTilesY * SCALE_FACTOR ** zoom)
  );
}
function tileWidth(zoom: Zoom, referenceTileGrid: TileGrid): number {
  return (
    (referenceTileGrid.boundingBox.east - referenceTileGrid.boundingBox.west) / (referenceTileGrid.numberOfMinLevelTilesX * SCALE_FACTOR ** zoom)
  );
}
function* tilesGenerator(limits: Limits, zoom: Zoom, metatile: number): Generator<Tile, undefined, undefined> {
  for (let y = limits[1]; y <= limits[3]; y++) {
    for (let x = limits[0]; x <= limits[2]; x++) {
      yield { x, y, z: zoom, metatile };
    }
  }

  return;
}

export function boundingBoxToTiles(
  bbox: BoundingBox,
  zoom: Zoom,
  metatile = 1,
  referenceTileGrid: TileGrid = TILEGRID_WORLD_CRS84
): Generator<Tile, undefined, undefined> {
  validateBoundingBox(bbox);
  validateMetatile(metatile);
  validateTileGrid(referenceTileGrid);
  validateZoomLevel(zoom, referenceTileGrid);

  const upperLeftTile = lonLatZoomToTile({ lon: bbox.west, lat: bbox.north }, zoom, metatile, referenceTileGrid);
  const lowerRightTile = lonLatZoomToTile({ lon: bbox.east, lat: bbox.south }, zoom, metatile, referenceTileGrid);

  return tilesGenerator([upperLeftTile.x, upperLeftTile.y, lowerRightTile.x, lowerRightTile.y], zoom, metatile);
}

export function zoomShift(zoom: Zoom, referenceTileGrid: TileGrid, targetTileGrid: TileGrid): Zoom {
  validateTileGrid(referenceTileGrid);
  validateTileGrid(targetTileGrid);
  validateZoomLevel(zoom, referenceTileGrid);

  const scale = referenceTileGrid.wellKnownScaleSet.scaleDenominators.get(zoom);
  if (scale === undefined) {
    // the value is validated before so this should be unreachable
    throw new Error('zoom level is not part of the given well known scale set');
  }

  let matchingZoom: Zoom | undefined;
  for (const [targetZoom, targetScaleDenominator] of targetTileGrid.wellKnownScaleSet.scaleDenominators) {
    if (targetScaleDenominator === scale) {
      matchingZoom = targetZoom;
      break;
    }
  }

  if (matchingZoom === undefined) {
    throw new Error('no matching target scale found for the given zoom level');
  }

  return matchingZoom;
}

export function lonLatZoomToTile(lonlat: LonLat, zoom: Zoom, metatile = 1, referenceTileGrid: TileGrid = TILEGRID_WORLD_CRS84): Tile {
  validateMetatile(metatile);
  validateTileGrid(referenceTileGrid);
  validateZoomLevel(zoom, referenceTileGrid);
  validateLonlat(lonlat, referenceTileGrid);

  const width = tileWidth(zoom, referenceTileGrid) * metatile;
  const height = tileHeight(zoom, referenceTileGrid) * metatile;

  const x = Math.floor((lonlat.lon - referenceTileGrid.boundingBox.west) / width);
  const y = Math.floor((referenceTileGrid.boundingBox.north - lonlat.lat) / height);

  // clamp the values in cases when lon is 180 which is calculated as beyond
  // the range of tile index for a given zoom level
  return {
    x: clamp(x, 0, Math.ceil((referenceTileGrid.numberOfMinLevelTilesX / metatile) * SCALE_FACTOR ** zoom - 1)),
    y: clamp(y, 0, Math.ceil((referenceTileGrid.numberOfMinLevelTilesY / metatile) * SCALE_FACTOR ** zoom - 1)),
    z: zoom,
    metatile: metatile,
  };
}

export function tileToBoundingBox(tile: Tile, metatile = 1, referenceTileGrid: TileGrid = TILEGRID_WORLD_CRS84): BoundingBox {
  validateMetatile(metatile);
  validateTileGrid(referenceTileGrid);
  validateTile(tile, metatile, referenceTileGrid);

  const width = tileWidth(tile.z, referenceTileGrid) * metatile;
  const height = tileHeight(tile.z, referenceTileGrid) * metatile;

  // clamp the values in cases where a metatile may extend tile bounding box beyond the bounding box
  // of the tile grid
  const bbox: BoundingBox = {
    west: clamp(referenceTileGrid.boundingBox.west + tile.x * width, referenceTileGrid.boundingBox.west, referenceTileGrid.boundingBox.east),
    south: clamp(
      referenceTileGrid.boundingBox.north - (tile.y + 1) * height,
      referenceTileGrid.boundingBox.south,
      referenceTileGrid.boundingBox.north
    ),
    east: clamp(referenceTileGrid.boundingBox.west + (tile.x + 1) * width, referenceTileGrid.boundingBox.west, referenceTileGrid.boundingBox.east),
    north: clamp(referenceTileGrid.boundingBox.north - tile.y * height, referenceTileGrid.boundingBox.south, referenceTileGrid.boundingBox.north),
  };

  return bbox;
}