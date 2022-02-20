import { SCALE_FACTOR } from './constants';
import { BoundingBox, LonLat, ScaleSet, Tile, TileGrid } from './interfaces';
import { Zoom } from './types';

export function validateScaleSet(scaleSet: ScaleSet): void {
  const arr = [...scaleSet.scaleDenominators.entries()];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i][0] + 1 !== arr[i + 1][0]) {
      throw new Error("scale set must have it's zoom levels ordered in ascending order and must be larger then the previous by 1");
    }

    if (arr[i][1] <= arr[i + 1][1]) {
      throw new Error("scale set must have it's scales ordered in ascending order and must be larger then the previous");
    }
  }
}

export function validateTileGrid(tileGrid: TileGrid): void {
  validateBoundingBox(tileGrid.boundingBox);
  validateScaleSet(tileGrid.wellKnownScaleSet);

  if (tileGrid.numberOfMinLevelTilesX < 1) {
    throw new Error('number of tiles on the x axis of a tile grid at the min zoom level must be at least 1');
  }

  if (tileGrid.numberOfMinLevelTilesY < 1) {
    throw new Error('number of tiles on the y axis of a tile grid at the min zoom level must be at least 1');
  }

  if (tileGrid.tileWidth < 1) {
    throw new Error('tile width of a tile grid must be at least 1');
  }

  if (tileGrid.tileHeight < 1) {
    throw new Error('tile height of a tile grid must be at least 1');
  }
}

export function validateBoundingBox(bbox: BoundingBox): void {
  if (bbox.east <= bbox.west) {
    throw new Error("bounding box's east must be larger than west");
  }

  if (bbox.north <= bbox.south) {
    throw new Error("bounding box's north must be larger than south");
  }
}

export function validateLonlat(lonlat: LonLat, referenceTileGrid: TileGrid): void {
  if (lonlat.lon < referenceTileGrid.boundingBox.west || lonlat.lon > referenceTileGrid.boundingBox.east) {
    throw new RangeError("longtitude out of range of tile grid's bounding box");
  }

  if (lonlat.lat < referenceTileGrid.boundingBox.south || lonlat.lat > referenceTileGrid.boundingBox.north) {
    throw new RangeError("latitude out of range of tile grid's bounding box");
  }
}

export function validateZoomLevel(zoom: Zoom, referenceTileGrid: TileGrid): void {
  if (!referenceTileGrid.wellKnownScaleSet.scaleDenominators.has(zoom)) {
    throw new Error('zoom level is not part of the given well known scale set');
  }
}

export function validateTile(tile: Tile, referenceTileGrid: TileGrid): void {
  validateZoomLevel(tile.z, referenceTileGrid);
  if (tile.metatile !== undefined) {
    validateMetatile(tile.metatile);
  }

  if (tile.x < 0 || tile.x >= (referenceTileGrid.numberOfMinLevelTilesX / (tile.metatile ?? 1)) * SCALE_FACTOR ** tile.z) {
    throw new RangeError('x index out of range of tile grid');
  }

  if (tile.y < 0 || tile.y >= (referenceTileGrid.numberOfMinLevelTilesY / (tile.metatile ?? 1)) * SCALE_FACTOR ** tile.z) {
    throw new RangeError('y index out of range of tile grid');
  }
}

export function validateMetatile(metatile: number): void {
  if (metatile <= 0) {
    throw new Error('metatile must be larger than 0');
  }
}
