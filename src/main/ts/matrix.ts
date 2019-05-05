export function translate (matrix: number[], x: number, y: number, z: number) {
  matrix[0] += matrix[3] * x;
  matrix[1] += matrix[3] * y;
  matrix[2] += matrix[3] * z;

  matrix[4] += matrix[7] * x;
  matrix[5] += matrix[7] * y;
  matrix[6] += matrix[7] * z;

  matrix[8] += matrix[11] * x;
  matrix[9] += matrix[11] * y;
  matrix[10] += matrix[11] * z;

  matrix[12] += matrix[15] * x;
  matrix[13] += matrix[15] * y;
  matrix[14] += matrix[15] * z;
}

export function rotateX (matrix: number[], angle: number): void {
  const cos = Math.cos (angle);
  const sin = Math.sin (angle);
  const m1 = matrix[1], m5 = matrix[5], m9 = matrix[9], m13 = matrix[13];

  matrix[1] = cos * m1 - sin * matrix[2];
  matrix[2] = sin * m1 + cos * matrix[2];

  matrix[5] = cos * m5 - sin * matrix[6];
  matrix[6] = sin * m5 + cos * matrix[6];

  matrix[9] = cos * m9 - sin * matrix[10];
  matrix[10] = sin * m9 + cos * matrix[10];

  matrix[13] = cos * m13 - sin * matrix[14];
  matrix[14] = sin * m13 + cos * matrix[14];
}

export function rotateY (matrix: number[], angle: number): void {
  const cos = Math.cos (angle);
  const sin = Math.sin (angle);
  const m0 = matrix[0], m4 = matrix[4], m8 = matrix[8], m12 = matrix[12];

  matrix[0] = cos * m0 + sin * matrix[2];
  matrix[2] = -sin * m0 + cos * matrix[2];

  matrix[4] = cos * m4 + sin * matrix[6];
  matrix[6] = -sin * m4 + cos * matrix[6];

  matrix[8] = cos * m8 + sin * matrix[10];
  matrix[10] = -sin * m8 + cos * matrix[10];

  matrix[12] = cos * m12 + sin * matrix[14];
  matrix[14] = -sin * m12 + cos * matrix[14];
}

export function rotateZ (matrix: number[], angle: number): void {
  const cos = Math.cos (angle);
  const sin = Math.sin (angle);
  const m0 = matrix[0], m4 = matrix[4], m8 = matrix[8], m12 = matrix[12];

  matrix[0] = cos * m0 - sin * matrix[1];
  matrix[1] = sin * m0 + cos * matrix[1];

  matrix[4] = cos * m4 - sin * matrix[5];
  matrix[5] = sin * m4 + cos * matrix[5];

  matrix[8] = cos * m8 - sin * matrix[9];
  matrix[9] = sin * m8 + cos * matrix[9];

  matrix[12] = cos * m12 - sin * matrix[13];
  matrix[13] = sin * m12 + cos * matrix[13];
}
