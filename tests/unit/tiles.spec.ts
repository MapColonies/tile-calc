import { boundingBoxToTiles, lonLatZoomToTile, tileToBoundingBox, zoomShift } from '../../src/tiles';
import { TILEGRID_WEB_MERCATOR, TILEGRID_WORLD_CRS84 } from '../../src/constants';
import { BoundingBox, LonLat, Tile, TileGrid } from '../../src/interfaces';
import { Zoom } from '../../src/types';

describe('#boundingBoxToTiles', () => {
  it('should return a generator function which yields tiles inside the bounding box', () => {
    const bbox: BoundingBox = { west: 30, south: 30, east: 40, north: 40 };
    const zoom: Zoom = 3;
    const expected = { value: { x: 9, y: 2, z: 3, metatile: 1 }, done: false };
    const expectedNext = { value: undefined, done: true };

    const tilesGenerator = boundingBoxToTiles(bbox, zoom);

    expect(tilesGenerator.next()).toEqual(expected);
    expect(tilesGenerator.next()).toEqual(expectedNext);
  });
  it('should return a generator function which yields tiles inside the bounding box with negative coordinates', () => {
    const bbox: BoundingBox = { west: -40, south: -40, east: -30, north: -30 };
    const zoom: Zoom = 3;
    const expected = { value: { x: 6, y: 5, z: 3, metatile: 1 }, done: false };
    const expectedNext = { value: undefined, done: true };

    const tilesGenerator = boundingBoxToTiles(bbox, zoom);

    expect(tilesGenerator.next()).toEqual(expected);
    expect(tilesGenerator.next()).toEqual(expectedNext);
  });
  it('should return a generator function which yields tiles inside the bounding box with non default metatile', () => {
    const bbox: BoundingBox = { west: 30, south: 30, east: 40, north: 40 };
    const zoom: Zoom = 3;
    const metatile = 3;
    const expected = { value: { x: 3, y: 0, z: 3, metatile: 3 }, done: false };
    const expectedNext = { value: undefined, done: true };

    const tilesGenerator = boundingBoxToTiles(bbox, zoom, metatile);

    expect(tilesGenerator.next()).toEqual(expected);
    expect(tilesGenerator.next()).toEqual(expectedNext);
  });
  it('should return a generator function which yields tiles inside the bounding box with non default tile grid', () => {
    const bbox: BoundingBox = { west: 30, south: 30, east: 40, north: 40 };
    const zoom: Zoom = 3;
    const tileGrid: TileGrid = TILEGRID_WEB_MERCATOR;
    const expected = { value: { x: 4, y: 2, z: 3, metatile: 1 }, done: false };
    const expectedNext = { value: undefined, done: true };

    const tilesGenerator = boundingBoxToTiles(bbox, zoom, undefined, tileGrid);

    expect(tilesGenerator.next()).toEqual(expected);
    expect(tilesGenerator.next()).toEqual(expectedNext);
  });
  it('should return a generator function which yields tiles inside the bounding box with non default tile grid & non default metatile', () => {
    const bbox: BoundingBox = { west: 30, south: 30, east: 40, north: 40 };
    const zoom: Zoom = 3;
    const metatile = 3;
    const tileGrid: TileGrid = TILEGRID_WEB_MERCATOR;
    const expected = { value: { x: 1, y: 0, z: 3, metatile: 3 }, done: false };
    const expectedNext = { value: undefined, done: true };

    const tilesGenerator = boundingBoxToTiles(bbox, zoom, metatile, tileGrid);

    expect(tilesGenerator.next()).toEqual(expected);
    expect(tilesGenerator.next()).toEqual(expectedNext);
  });
  it("should throw an error when the given bounding box's east value is more or equal to the west value", () => {
    const bbox: BoundingBox = { west: 30, south: 30, east: 30, north: 40 };
    const zoom: Zoom = 3;

    const badTilesGenerator = (): void => {
      boundingBoxToTiles(bbox, zoom);
    };

    expect(badTilesGenerator).toThrow(Error("bounding box's east must be larger than west"));
  });
  it("should throw an error when the given bounding box's south value is more or equal to the north value", () => {
    const bbox: BoundingBox = { west: 30, south: 30, east: 40, north: 30 };
    const zoom: Zoom = 3;

    const badTilesGenerator = (): void => {
      boundingBoxToTiles(bbox, zoom);
    };

    expect(badTilesGenerator).toThrow(Error("bounding box's north must be larger than south"));
  });
  it("should throw an error when the given bounding box's west value is less than tile grid's bounding box west value", () => {
    const bbox: BoundingBox = { west: -190, south: -30, east: 40, north: 30 };
    const zoom: Zoom = 3;

    const badTilesGenerator = (): void => {
      boundingBoxToTiles(bbox, zoom);
    };

    expect(badTilesGenerator).toThrow(RangeError("longtitude -190 is out of range of tile grid's bounding box"));
  });
  it("should throw an error when the given bounding box's east value is larger than tile grid's bounding box east value", () => {
    const bbox: BoundingBox = { west: 30, south: -30, east: 190, north: 30 };
    const zoom: Zoom = 3;

    const badTilesGenerator = (): void => {
      boundingBoxToTiles(bbox, zoom);
    };

    expect(badTilesGenerator).toThrow(RangeError("longtitude 190 is out of range of tile grid's bounding box"));
  });
  it("should throw an error when the given bounding box's south value is less than tile grid's bounding box south value", () => {
    const bbox: BoundingBox = { west: 30, south: -100, east: 40, north: 30 };
    const zoom: Zoom = 3;

    const badTilesGenerator = (): void => {
      boundingBoxToTiles(bbox, zoom);
    };

    expect(badTilesGenerator).toThrow(RangeError("latitude -100 is out of range of tile grid's bounding box"));
  });
  it("should throw an error when the given bounding box's north value is larger than tile grid's bounding box north value", () => {
    const bbox: BoundingBox = { west: 30, south: -30, east: 40, north: 100 };
    const zoom: Zoom = 3;

    const badTilesGenerator = (): void => {
      boundingBoxToTiles(bbox, zoom);
    };

    expect(badTilesGenerator).toThrow(RangeError("latitude 100 is out of range of tile grid's bounding box"));
  });
});

describe('#zoomShift', () => {
  it('should return a shifted zoom level given a zoom level, reference tile grid & target tile grid', () => {
    const zoom: Zoom = 3;
    const referenceTileGrid: TileGrid = TILEGRID_WORLD_CRS84;
    const targetTileGrid: TileGrid = TILEGRID_WEB_MERCATOR;
    const expected = 3;

    const shiftedZoom = zoomShift(zoom, referenceTileGrid, targetTileGrid);

    expect(shiftedZoom).toEqual(expected);
  });
  it('should throw an error given a zoom level, reference tile grid & target tile grid when no match for scale denominator', () => {
    const zoom: Zoom = 3;
    const referenceTileGrid: TileGrid = TILEGRID_WORLD_CRS84;
    const targetTileGrid: TileGrid = {
      ...TILEGRID_WEB_MERCATOR,
      ...{
        wellKnownScaleSet: {
          identifier: 'badScaleSet',
          scaleDenominators: new Map([[0, 5000]]),
        },
      },
    };

    const badShiftedZoom = (): void => {
      zoomShift(zoom, referenceTileGrid, targetTileGrid);
    };

    expect(badShiftedZoom).toThrow(new Error('no matching target scale found for the given zoom level'));
  });
});

describe('#lonLatZoomToTile', () => {
  it('should return a tile for a given longtitude, latitude & zoom', () => {
    const lonLat: LonLat = { lon: 30, lat: 30 };
    const zoom: Zoom = 2;
    const expected: Tile = { x: 4, y: 1, z: 2, metatile: 1 };

    const tile = lonLatZoomToTile(lonLat, zoom);

    expect(tile).toEqual(expected);
  });
  it('should return a tile for a given negative longtitude, latitude & zoom', () => {
    const lonLat: LonLat = { lon: -30, lat: -30 };
    const zoom: Zoom = 2;
    const expected: Tile = { x: 3, y: 2, z: 2, metatile: 1 };

    const tile = lonLatZoomToTile(lonLat, zoom);

    expect(tile).toEqual(expected);
  });
  it('should return a tile for a given longtitude, latitude & zoom with non default metatile', () => {
    const lonLat: LonLat = { lon: 30, lat: 30 };
    const zoom: Zoom = 2;
    const metatile = 3;
    const expected: Tile = { x: 1, y: 0, z: 2, metatile: 3 };

    const tile = lonLatZoomToTile(lonLat, zoom, metatile);

    expect(tile).toEqual(expected);
  });
  it('should return a tile for a given longtitude, latitude & zoom with non default tile grid', () => {
    const lonLat: LonLat = { lon: 30, lat: 30 };
    const zoom: Zoom = 2;
    const tileGrid: TileGrid = TILEGRID_WEB_MERCATOR;
    const expected: Tile = { x: 2, y: 1, z: 2, metatile: 1 };

    const tile = lonLatZoomToTile(lonLat, zoom, undefined, tileGrid);

    expect(tile).toEqual(expected);
  });
  it('should return a tile for a given longtitude, latitude & zoom with non default tile grid & non default metatile', () => {
    const lonLat: LonLat = { lon: 90, lat: 30 };
    const zoom: Zoom = 2;
    const metatile = 3;
    const tileGrid: TileGrid = TILEGRID_WEB_MERCATOR;
    const expected: Tile = { x: 1, y: 0, z: 2, metatile: 3 };

    const tile = lonLatZoomToTile(lonLat, zoom, metatile, tileGrid);

    expect(tile).toEqual(expected);
  });
  it("should return a tile when logtitude is equal to tile grid's bounding box extent", () => {
    const lonLat: LonLat = { lon: 180, lat: 30 };
    const zoom: Zoom = 2;
    const expected: Tile = { x: 7, y: 1, z: 2, metatile: 1 };

    const tile = lonLatZoomToTile(lonLat, zoom);

    expect(tile).toEqual(expected);
  });
  it("should return a tile when latitude is equal to tile grid's bounding box extent", () => {
    const lonLat: LonLat = { lon: 30, lat: -90 };
    const zoom: Zoom = 2;
    const expected: Tile = { x: 4, y: 3, z: 2, metatile: 1 };

    const tile = lonLatZoomToTile(lonLat, zoom);

    expect(tile).toEqual(expected);
  });
  it("should throw an error when longtitude is outside of tile grid's bounding box", () => {
    const lonLat: LonLat = { lon: -190, lat: 30 };
    const zoom: Zoom = 0;

    const badLonLatZoomToTile = (): void => {
      lonLatZoomToTile(lonLat, zoom);
    };

    expect(badLonLatZoomToTile).toThrow(RangeError("longtitude -190 is out of range of tile grid's bounding box"));
  });
  it("should throw an error when latitude is outside of tile grid's bounding box", () => {
    const lonLat: LonLat = { lon: 30, lat: 100 };
    const zoom: Zoom = 0;

    const badLonLatZoomToTile = (): void => {
      lonLatZoomToTile(lonLat, zoom);
    };

    expect(badLonLatZoomToTile).toThrow(RangeError("latitude 100 is out of range of tile grid's bounding box"));
  });
  it("should throw an error when the zoom level is not part of zoom levels of tile grid's scale set", () => {
    const lonLat: LonLat = { lon: 30, lat: 30 };
    const zoom: Zoom = 1.5;

    const badLonLatZoomToTile = (): void => {
      lonLatZoomToTile(lonLat, zoom);
    };

    expect(badLonLatZoomToTile).toThrow(Error('zoom level is not part of the given well known scale set'));
  });
  it('should throw an error when metatile is zero or less', () => {
    const lonLat: LonLat = { lon: 30, lat: 30 };
    const zoom: Zoom = 0;
    const metatile = 0;

    const badLonLatZoomToTile = (): void => {
      lonLatZoomToTile(lonLat, zoom, metatile);
    };

    expect(badLonLatZoomToTile).toThrow(Error('metatile must be larger than 0'));
  });
});

describe('#tileToBoundingBox', () => {
  it('should return a bounding box for a given tile', () => {
    const tile: Tile = { x: 1, y: 1, z: 1 };
    const expected: BoundingBox = { west: -90, south: -90, east: 0, north: 0 };

    const boundingBox = tileToBoundingBox(tile);

    expect(boundingBox).toEqual(expected);
  });
  it('should return a bounding box for a given tile which contains a metatile size that overrides the default', () => {
    const tile: Tile = { x: 1, y: 0, z: 1, metatile: 2 };
    const expected: BoundingBox = { west: 0, south: -90, east: 180, north: 90 };

    const boundingBox = tileToBoundingBox(tile);

    expect(boundingBox).toEqual(expected);
  });
  it('should return a bounding box for a given tile with non default tile grid', () => {
    const tile: Tile = { x: 0, y: 0, z: 0 };
    const tileGrid: TileGrid = TILEGRID_WEB_MERCATOR;
    const expected: BoundingBox = {
      west: TILEGRID_WEB_MERCATOR.boundingBox.west,
      south: TILEGRID_WEB_MERCATOR.boundingBox.south,
      east: TILEGRID_WEB_MERCATOR.boundingBox.east,
      north: TILEGRID_WEB_MERCATOR.boundingBox.north,
    };

    const boundingBox = tileToBoundingBox(tile, tileGrid);

    expect(boundingBox).toEqual(expected);
  });
  it('should return a bounding box for a given tile with non default tile grid & non default metatile', () => {
    const tile: Tile = { x: 1, y: 0, z: 2, metatile: 3 };
    const tileGrid: TileGrid = TILEGRID_WEB_MERCATOR;
    const expected: BoundingBox = {
      west: 90,
      south: -42.525564389903295,
      east: 180,
      north: 85.05112877980659,
    };

    const boundingBox = tileToBoundingBox(tile, tileGrid);

    expect(boundingBox).toEqual(expected);
  });
  it("should throw an error when the tile's x index is outside of tile grid", () => {
    const tile: Tile = { x: 2, y: 1, z: 0 };

    const badTileToBoundingBox = (): void => {
      tileToBoundingBox(tile);
    };

    expect(badTileToBoundingBox).toThrow(RangeError('x index out of range of tile grid'));
  });
  it("should throw an error when the tile's y index is outside of tile grid", () => {
    const tile: Tile = { x: 1, y: 1, z: 0 };

    const badTileToBoundingBox = (): void => {
      tileToBoundingBox(tile);
    };

    expect(badTileToBoundingBox).toThrow(RangeError('y index out of range of tile grid'));
  });
  it("should throw an error when the tile's z index is not part of zoom levels of tile grid's scale set", () => {
    const tile: Tile = { x: 2, y: 1, z: 1.5 };

    const badTileToBoundingBox = (): void => {
      tileToBoundingBox(tile);
    };

    expect(badTileToBoundingBox).toThrow(Error('zoom level is not part of the given well known scale set'));
  });
  it("should throw an error when the tile's x index is outside of tile grid because of large enough metatile", () => {
    const tile: Tile = { x: 1, y: 0, z: 0, metatile: 2 };

    const badTileToBoundingBox = (): void => {
      tileToBoundingBox(tile);
    };

    expect(badTileToBoundingBox).toThrow(RangeError('x index out of range of tile grid'));
  });
  it("should throw an error when the tile's y index is outside of tile grid because of large enough metatile", () => {
    const tile: Tile = { x: 0, y: 1, z: 0, metatile: 2 };

    const badTileToBoundingBox = (): void => {
      tileToBoundingBox(tile);
    };

    expect(badTileToBoundingBox).toThrow(RangeError('y index out of range of tile grid'));
  });
  it('should throw an error when metatile is zero or less', () => {
    const tile: Tile = { x: 0, y: 0, z: 0, metatile: 0 };

    const badTileToBoundingBox = (): void => {
      tileToBoundingBox(tile);
    };

    expect(badTileToBoundingBox).toThrow(new Error('metatile must be larger than 0'));
  });
  test.each([
    {
      testCaseName: 'bounding box east is equal or larger than west',
      expected: "bounding box's east must be larger than west",
      tile: { x: 0, y: 0, z: 0 },
      tileGrid: { ...TILEGRID_WORLD_CRS84, ...{ boundingBox: { west: 90, south: -90, east: 90, north: 90 } } },
    },
    {
      testCaseName: 'bounding box south is equal or larger than north',
      expected: "bounding box's north must be larger than south",
      tile: { x: 0, y: 0, z: 0 },
      tileGrid: { ...TILEGRID_WORLD_CRS84, ...{ boundingBox: { west: -90, south: 90, east: 90, north: 90 } } },
    },
    {
      testCaseName: 'well known scale set has equal or less than following zoom levels',
      expected: "scale set must have it's zoom levels ordered in ascending order and must be larger then the previous by 1",
      tile: { x: 0, y: 0, z: 0 },
      tileGrid: {
        ...TILEGRID_WORLD_CRS84,
        ...{
          wellKnownScaleSet: {
            identifier: 'test',
            scaleDenominators: new Map([
              [0, 15000],
              [2, 5000],
            ]),
          },
        },
      },
    },
    {
      testCaseName: 'well known scale set has equal or less than following scales',
      expected: "scale set must have it's scales ordered in ascending order and must be larger then the previous",
      tile: { x: 0, y: 0, z: 0 },
      tileGrid: {
        ...TILEGRID_WORLD_CRS84,
        ...{
          wellKnownScaleSet: {
            identifier: 'test',
            scaleDenominators: new Map([
              [0, 5000],
              [1, 5000],
            ]),
          },
        },
      },
    },
    {
      testCaseName: 'number of tiles on the x axis at min zoom is less than 1',
      expected: 'number of tiles on the x axis of a tile grid at the min zoom level must be at least 1',
      tile: { x: 0, y: 0, z: 0 },
      tileGrid: { ...TILEGRID_WORLD_CRS84, ...{ numberOfMinLevelTilesX: 0 } },
    },
    {
      testCaseName: 'number of tiles on the y axis at min zoom is less than 1',
      expected: 'number of tiles on the y axis of a tile grid at the min zoom level must be at least 1',
      tile: { x: 0, y: 0, z: 0 },
      tileGrid: { ...TILEGRID_WORLD_CRS84, ...{ numberOfMinLevelTilesY: 0 } },
    },
    {
      testCaseName: 'tile width is less than 1',
      expected: 'tile width of a tile grid must be at least 1',
      tile: { x: 0, y: 0, z: 0 },
      tileGrid: { ...TILEGRID_WORLD_CRS84, ...{ tileWidth: 0 } },
    },
    {
      testCaseName: 'tile height is less than 1',
      expected: 'tile height of a tile grid must be at least 1',
      tile: { x: 0, y: 0, z: 0 },
      tileGrid: { ...TILEGRID_WORLD_CRS84, ...{ tileHeight: 0 } },
    },
  ])("should throw an error when the tile grid's $testCaseName", ({ tile, tileGrid, expected }) => {
    const badTileToBoundingBox = (): void => {
      tileToBoundingBox(tile, tileGrid);
    };

    expect(badTileToBoundingBox).toThrow(new Error(expected));
  });
});
