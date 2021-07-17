export enum Direction {
  X = 'x',
  Y = 'y'
}

export const enum Edge {
  Walled,
  Open
}

export interface Wall {
  x: number;
  y: number;
  z: number;
  dir: Direction
}

interface RawMap {
  walls: Wall[];
}

export class Tile {
  forward = Edge.Open;
  backward = Edge.Open;
  right = Edge.Open;
  left = Edge.Open;

  constructor (
      readonly x: number,
      readonly y: number,
      readonly z: number
  ) {
  }

  register (wall: Wall): void {
    if (wall.z !== this.z) {
      return;
    }
    switch (wall.dir) {
      case Direction.X:
        if (wall.x !== this.x) {
          return;
        }
        if (wall.y === this.y) {
          this.backward = Edge.Walled;
        }
        if (wall.y === this.y + 1) {
          this.forward = Edge.Walled;
        }
        break;
      case Direction.Y:
        if (wall.y !== this.y) {
          return;
        }
        if (wall.x === this.x) {
          this.left = Edge.Walled;
        }
        if (wall.x === this.x + 1) {
          this.right = Edge.Walled;
        }
        break;
    }
  }
}

export class WorldMap {
  readonly walls: Wall[];
  private readonly tiles: Tile[][][];

  constructor (map: RawMap) {
    this.walls = map.walls;

    let minX = 0;
    let maxX = 0;
    let minY = 0;
    let maxY = 0;
    let minZ = 0;
    let maxZ = 0;

    this.walls.forEach (wall => {
      minX = Math.min (minX, wall.x);
      maxX = Math.max (maxX, wall.x + (wall.dir === Direction.X ? 1 : 0));
      minY = Math.min (minY, wall.y);
      maxY = Math.max (maxY, wall.y + (wall.dir === Direction.Y ? 1 : 0));
      minZ = Math.min (minZ, wall.z);
      maxZ = Math.max (maxZ, wall.z + 1);
    });

    this.tiles = [];
    for (let x = minX; x < maxX; x++) {
      this.tiles[x] = [];
      for (let y = minY; y < maxY; y++) {
        this.tiles[x][y] = [];
        for (let z = minZ; z < maxZ; z++) {
          this.tiles[x][y][z] = new Tile (x, y, z);
        }
      }
    }

    this.walls.forEach (wall => {
      const {x, y, z} = wall;
      if (this.tiles[x]) {
        if (this.tiles[x][y]) {
          this.tiles[x][y][z].register (wall);
        }
        if (this.tiles[x][y - 1]) {
          this.tiles[x][y - 1][z].register (wall);
        }
      }
      if (this.tiles[x - 1] && this.tiles[x - 1][y]) {
        return this.tiles[x - 1][y][z].register (wall);
      }
    });
  }

  getTile (x: number, y: number, z: number): Tile {
    if (this.tiles[x] && this.tiles[x][y] && this.tiles[x][y][z]) {
      return this.tiles[x][y][z];
    }
    return new Tile (x, y, z);
  }
}

const PASSIVE: AddEventListenerOptions = {
  once: true,
  passive: true
};

export function loadMap (successCallback: (m: WorldMap) => void): void {
  const xhr = new XMLHttpRequest ();
  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      const map: RawMap = JSON.parse (xhr.response);
      successCallback (new WorldMap (map));
    }
  }, PASSIVE);
  xhr.open ('GET', 'map');
  xhr.setRequestHeader ('Accept', 'application/json');
  xhr.send ();
}
