# tile-calc
tile-calc is a map tiles calculations utility package

# Documentation
see docs

### OGC Two Dimensional Tile Matrix Set
There is a resemblance between this implementation of `TileGrid` and OGC's definition of tile TileMatrixSet, but please notice that they are not identical. Some key differences:

* This implementation currently does not implement `TileMatrix`
    * Tile indexes are assumed to start from 0 index
    * Scale factor between zoom levels is assumed to be constant and equal to a constant value (2), affecting the number of tile columns and rows per zoom level
    * Bounding box keeps its size between zoom levels
    * Tile sizes are constant

## Installation

```bash
npm install @map-colonies/tile-calc
```

## Running Tests

```bash
npm run test
```