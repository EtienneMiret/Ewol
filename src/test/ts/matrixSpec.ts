import { rotateX, rotateY, rotateZ, translate } from '../../main/ts/matrix';

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
              1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              x, y, z, 1
            ]);
          });

        }
      }
    }

  });

  describe ('rotateX', () => {

    it ('should do nothing with a 0 angle', () => {
      const matrix = [
        12, 36, 23, 32,
        41, 27, 18, 90,
        45, 56, 81, 27,
        15, 62, 60, 85
      ];

      rotateX (matrix, 0);

      expect (matrix).toEqual ([
        12, 36, 23, 32,
        41, 27, 18, 90,
        45, 56, 81, 27,
        15, 62, 60, 85
      ]);
    });

    for (const angle of [1, 2, -2, Math.PI / 2, -Math.PI / 2, Math.PI]) {

      it (`should rotate identity on the X axis by ${angle}`, () => {
        const matrix = [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ];

        rotateX (matrix, angle);

        const expected = [
          1, 0, 0, 0,
          0, Math.cos (angle), Math.sin (angle), 0,
          0, -Math.sin (angle), Math.cos (angle), 0,
          0, 0, 0, 1
        ];
        expect (matrix.length).toEqual (expected.length);
        for (let i = 0; i < expected.length; i++) {
          expect (matrix[i]).toBeCloseTo (expected[i], 3);
        }
      });

    }

  });

  describe ('rotateY', () => {

    it ('should do nothing with a 0 angle', () => {
      const matrix = [
        76, 82, 18, 29,
        51, 10, 14, 23,
        60, 42, 58, 16,
        43, 22, 17, 11
      ];

      rotateY (matrix, 0);

      expect (matrix).toEqual ([
        76, 82, 18, 29,
        51, 10, 14, 23,
        60, 42, 58, 16,
        43, 22, 17, 11
      ]);
    });

    for (const angle of [1, 2, -2, Math.PI / 2, -Math.PI / 2, Math.PI]) {

      it (`should rotate identity on the Y axis by ${angle}`, () => {
        const matrix = [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ];

        rotateY (matrix, angle);

        const expected = [
          Math.cos (angle), 0, -Math.sin (angle), 0,
          0, 1, 0, 0,
          Math.sin (angle), 0, Math.cos (angle), 0,
          0, 0, 0, 1
        ];
        expect (matrix.length).toEqual (expected.length);
        for (let i = 0; i < expected.length; i++) {
          expect (matrix[i]).toBeCloseTo (expected[i], 3);
        }
      });

    }

  });

  describe ('rotateZ', () => {

    it ('should do nothing with a 0 angle', () => {
      const matrix = [
        80, 92, 61, 28,
        32, 40, 51, 36,
        28, 78, 84, 53,
        12, 40, 58, 62
      ];

      rotateZ (matrix, 0);

      expect (matrix).toEqual ([
        80, 92, 61, 28,
        32, 40, 51, 36,
        28, 78, 84, 53,
        12, 40, 58, 62
      ]);
    });

    for (const angle of [1, 2, -2, Math.PI / 2, -Math.PI / 2, Math.PI]) {

      it (`should rotate identity on the Z axis by ${angle}`, () => {
        const matrix = [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ];

        rotateZ (matrix, angle);

        const expected = [
          Math.cos (angle), Math.sin (angle), 0, 0,
          -Math.sin (angle), Math.cos (angle), 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ];
        expect (matrix.length).toEqual(expected.length);
        for (let i = 0; i < expected.length; i++) {
          expect (matrix[i]).toBeCloseTo (expected[i], 3);
        }
      });

    }

  })

});
