import { Direction } from '../../main/ts/load-map';
import { Square } from '../../main/ts/shape';

describe ('shape', () => {

  describe ('square', () => {

    it ('should draw on the X axis', () => {
      const square = new Square ({
        x: 12,
        y: 25,
        z: 2,
        dir: Direction.X
      });

      const expected = [
        12, 25, 2,
        12.02, 25, 2,
        12, 25, 2.02,
        12.02, 25, 2.02,

        12.98, 25, 2,
        13, 25, 2,
        12.98, 25, 2.02,
        13, 25, 2.02,

        12, 25, 2.98,
        12.02, 25, 2.98,
        12, 25, 3,
        12.02, 25, 3,

        12.98, 25, 2.98,
        13, 25, 2.98,
        12.98, 25, 3,
        13, 25, 3
      ];
      expect (expected.length).toEqual (Square.COORDINATES_PER_WALL * 3);
      for (let i = 0; i < expected.length; i++) {
        expect (square.getOrdinate (i)).toBeCloseTo (expected[i], 3);
      }
    });

    it ('should draw on the Y axis', () => {
      const square = new Square ({
        x: 37,
        y: 14,
        z: -1,
        dir: Direction.Y
      });

      const expected = [
        37, 14, -1,
        37, 14.02, -1,
        37, 14, -0.98,
        37, 14.02, -0.98,

        37, 14.98, -1,
        37, 15, -1,
        37, 14.98, -0.98,
        37, 15, -0.98,

        37, 14, -0.02,
        37, 14.02, -0.02,
        37, 14, 0,
        37, 14.02, 0,

        37, 14.98, -0.02,
        37, 15, -0.02,
        37, 14.98, 0,
        37, 15, 0
      ];
      expect (expected.length).toEqual (Square.COORDINATES_PER_WALL * 3);
      for (let i = 0; i < expected.length; i++) {
        expect (square.getOrdinate (i)).toBeCloseTo (expected[i], 3);
      }
    });

  });

});
