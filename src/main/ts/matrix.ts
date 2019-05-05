export function translate (matrix: number[], x: number, y: number, z: number) {
  matrix[0] += x * matrix[12];
  matrix[1] += x * matrix[13];
  matrix[2] += x * matrix[14];
  matrix[3] += x * matrix[15];
  matrix[4] += y * matrix[12];
  matrix[5] += y * matrix[13];
  matrix[6] += y * matrix[14];
  matrix[7] += y * matrix[15];
  matrix[8] += z * matrix[12];
  matrix[9] += z * matrix[13];
  matrix[10] += z * matrix[14];
  matrix[11] += z * matrix[15];
}

export function rotateX (matrix: number[], angle: number): void {
  const cos = Math.cos (angle);
  const sin = Math.sin (angle);
  const m4 = matrix[4], m5 = matrix[5], m6 = matrix[6], m7 = matrix[7];

  matrix[4] = cos * matrix[4] - sin * matrix[8];
  matrix[5] = cos * matrix[5] - sin * matrix[9];
  matrix[6] = cos * matrix[6] - sin * matrix[10];
  matrix[7] = cos * matrix[7] - sin * matrix[11];

  matrix[8] = sin * m4 + cos * matrix[8];
  matrix[9] = sin * m5 + cos * matrix[9];
  matrix[10] = sin * m6 + cos * matrix[10];
  matrix[11] = sin * m7 + cos * matrix[11];
}

export function rotateY (matrix: number[], angle: number): void {
  const cos = Math.cos (angle);
  const sin = Math.sin (angle);
  const m0 = matrix[0], m1 = matrix[1], m2 = matrix[2], m3 = matrix[3];

  matrix[0] = cos * matrix[0] + sin * matrix[8];
  matrix[1] = cos * matrix[1] + sin * matrix[9];
  matrix[2] = cos * matrix[2] + sin * matrix[10];
  matrix[3] = cos * matrix[3] + sin * matrix[11];

  matrix[8] = cos * matrix[8] - sin * m0;
  matrix[9] = cos * matrix[9] - sin * m1;
  matrix[10] = cos * matrix[10] - sin * m2;
  matrix[11] = cos * matrix[11] - sin * m3;
}
