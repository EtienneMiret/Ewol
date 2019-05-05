import { translate } from '../../main/ts/matrix';

describe ('matrix', () => {

  describe ('translate', () => {

    it ('should do nothing given a 0 vector', () => {
      const matrix = [
        92, 24, 36, 51,
        27, 12, 42, 71,
        91, 25, 14, 23,
        70, 86, 38, 29
      ];

      translate (matrix, 0, 0, 0);

      expect (matrix).toEqual ([
        92, 24, 36, 51,
        27, 12, 42, 71,
        91, 25, 14, 23,
        70, 86, 38, 29
      ]);
    });

    for (const x of [0, 1, 2, 3, -5]) {
      for (const y of [0, 1, 2, 3, -5]) {
        for (const z of [0, 1, 2, 3, -5]) {

          it (`should translate identity by ${x}, ${y}, ${z}`, () => {
            const matrix = [
              1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1
            ];

            translate (matrix, x, y, z);

            expect (matrix).toEqual ([
              1, 0, 0, x,
              0, 1, 0, y,
              0, 0, 1, z,
              0, 0, 0, 1
            ]);
          });

        }
      }
    }

  });

});
