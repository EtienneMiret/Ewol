import { Direction, Wall } from './load-map';

const LINE_WIDTH = 1 / 50;

export class Square {
  static readonly WHITE_TRIANGLES_PER_WALL = 2;
  static readonly BLACK_TRIANGLES_PER_WALL = 16;
  static readonly COORDINATES_PER_WALL = 16;

  private readonly coordinates: number[];

  constructor (wall: Wall) {
    function x (f: number) {
      return wall.dir === Direction.X ? f : 0;
    }

    function y (f: number) {
      return wall.dir === Direction.Y ? f : 0;
    }

    this.coordinates = [];

    for (const corner of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
      const [h, v] = corner;

      for (const sCorner of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
        const [sH, sV] = sCorner;
        this.coordinates.push (wall.x + x (h * (1 - LINE_WIDTH) + sH * LINE_WIDTH));
        this.coordinates.push (wall.y + y (h * (1 - LINE_WIDTH) + sH * LINE_WIDTH));
        this.coordinates.push (wall.z + v * (1 - LINE_WIDTH) + sV * LINE_WIDTH);
      }

    }
  }

  getOrdinate (index: number): number {
    return this.coordinates[index];
  }

}
