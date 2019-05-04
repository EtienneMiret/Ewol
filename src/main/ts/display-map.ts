import { onReady } from './on-ready';
import { Direction, loadMap, Wall, WorldMap } from './load-map';

const TILE_SIZE = 10;

class Dimensions {
  private minX: number;
  private maxX: number;
  private minY: number;
  private maxY: number;
  private minZ: number;
  private maxZ: number;

  constructor () {
    this.minX = 0;
    this.maxX = 0;
    this.minY = 0;
    this.maxY = 0;
    this.minZ = 0;
    this.maxZ = 0;
  }

  register (wall: Wall): void {
    if (wall.x < 0) {
      this.minX = Math.min (this.minX, wall.x);
    } else if (wall.dir === Direction.X) {
      this.maxX = Math.max (this.maxX, wall.x + 1);
    } else {
      this.maxX = Math.max (this.maxX, wall.x);
    }
    if (wall.y < 0) {
      this.minY = Math.min (this.minY, wall.y);
    } else if (wall.dir === Direction.Y) {
      this.maxY = Math.max (this.maxY, wall.y + 1);
    } else {
      this.maxY = Math.max (this.maxY, wall.y);
    }
    if (wall.z < 0) {
      this.minZ = Math.min (this.minZ, wall.z);
    } else {
      this.maxZ = Math.max (this.maxZ, wall.z + 1);
    }
  }

  get width (): number {
    return this.maxX - this.minX;
  }

  get height (): number {
    return this.maxY - this.minY;
  }

  get floors (): number {
    return this.maxZ - this.minZ;
  }

  get origin (): {x: number, y: number, z: number} {
    return {
      x: this.minX,
      y: this.maxY,
      z: this.maxZ
    }
  }
}

function draw (map: WorldMap): void {
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  const ctx = canvas.getContext ('2d');
  if (!ctx) return;

  const d = new Dimensions ();
  map.walls.forEach (w => d.register (w));

  canvas.width = (d.width + 2) * TILE_SIZE;
  canvas.height = (d.height + 1) * d.floors * TILE_SIZE + TILE_SIZE;

  ctx.save ();
  ctx.clearRect (0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  map.walls.forEach (wall => {
    const x0 = wall.x - d.origin.x;
    const y0 = d.origin.y - wall.y;
    const x1 = wall.dir === Direction.X ? x0 + 1 : x0;
    const y1 = wall.dir === Direction.Y ? y0 - 1 : y0;
    const floors = d.origin.z - wall.z - 1;
    ctx.beginPath ();
    ctx.moveTo ((x0 + 1) * TILE_SIZE, (floors * (d.height + 1) + y0 + 1) * TILE_SIZE);
    ctx.lineTo ( (x1 + 1) * TILE_SIZE, (floors * (d.height + 1) + y1 +1) * TILE_SIZE);
    ctx.stroke ();
  });
  ctx.restore();
}

function init () {
  loadMap (draw);
}

onReady (init);
