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
