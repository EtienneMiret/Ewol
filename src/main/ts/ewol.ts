import { onReady } from './on-ready';

const PRECISION = 20;

function createFragmentShader (gl: WebGLRenderingContext): WebGLShader {
  const shader = gl.createShader (gl.FRAGMENT_SHADER)!;
  gl.shaderSource (shader, `
    void main (void) {
      gl_FragColor = vec4 (1, 0, 0, 1);
    }
  `);
  gl.compileShader (shader);
  return shader;
}

function createVertexShader (gl: WebGLRenderingContext): WebGLShader {
  const shader = gl.createShader (gl.VERTEX_SHADER)!;
  gl.shaderSource (shader, `
    attribute vec3 coordinates;
    uniform mat4 mMatrix;
    void main (void) {
      gl_Position = mMatrix * vec4(coordinates, 1);
    }
  `);
  gl.compileShader (shader);
  return shader;
}

function rotateX (matrix: Float32Array, angle: number): void {
  const cos = Math.cos (angle);
  const sin = Math.sin (angle);
  const mv1 = matrix[1], mv5 = matrix[5], mv9 = matrix[9];

  matrix[1] = matrix[1] * cos - matrix[2] * sin;
  matrix[5] = matrix[5] * cos - matrix[6] * sin;
  matrix[9] = matrix[9] * cos - matrix[10] * sin;

  matrix[2] = matrix[2] * cos + mv1 * sin;
  matrix[6] = matrix[6] * cos + mv5 * sin;
  matrix[10] = matrix[10] * cos + mv9 * sin;
}

function rotateY (matrix: Float32Array, angle: number) {
  const cos = Math.cos (angle);
  const sin = Math.sin (angle);
  const mv0 = matrix[0], mv4 = matrix[4], mv8 = matrix[8];

  matrix[0] = cos * matrix[0] + sin * matrix[2];
  matrix[4] = cos * matrix[4] + sin * matrix[6];
  matrix[8] = cos * matrix[8] + sin * matrix[10];

  matrix[2] = cos * matrix[2] - sin * mv0;
  matrix[6] = cos * matrix[6] - sin * mv4;
  matrix[10] = cos * matrix[10] - sin * mv8;
}

function rotateZ (matrix: Float32Array, angle: number): void {
  const cos = Math.cos (angle);
  const sin = Math.sin (angle);
  const mv0 = matrix[0], mv4 = matrix[4], mv8 = matrix[8];

  matrix[0] = cos * matrix[0] - sin * matrix[1];
  matrix[4] = cos * matrix[4] - sin * matrix[5];
  matrix[8] = cos * matrix[8] - sin * matrix[9];
  matrix[1] = cos * matrix[1] + sin * mv0;
  matrix[5] = cos * matrix[5] + sin * mv4;
  matrix[9] = cos * matrix[9] + sin * mv8;
}

function init () {
  const canvas = <HTMLCanvasElement>document.getElementById ('canvas');
  const gl = canvas.getContext ('webgl');
  if (!gl) {
    return;
  }

  const vertices = new Float32Array (6 * PRECISION);
  for (let index = 0; index < PRECISION; index++) {
    const n = 6 * index;
    const angle = index * 2 * Math.PI / PRECISION;
    const x = Math.cos (angle);
    const y = Math.sin (angle);
    vertices[n] = x;
    vertices[n + 1] = y;
    vertices[n + 2] = -1;
    vertices[n + 3] = x;
    vertices[n + 4] = y;
    vertices[n + 5] = 1;
  }

  const verticesBuffer = gl.createBuffer ();
  gl.bindBuffer (gl.ARRAY_BUFFER, verticesBuffer);
  gl.bufferData (gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bindBuffer (gl.ARRAY_BUFFER, null);

  const indices = new Uint16Array (6 * PRECISION);
  for (let index = 0; index < PRECISION; index++) {
    const n = 6 * index;
    const m = 2 * index;
    indices[n] = m;
    indices[n + 1] = m + 1;
    indices[n + 2] = m + 1;
    indices[n + 3] = (m + 3) % (2 * PRECISION);
    indices[n + 4] = (m + 2 * PRECISION - 2) % (2 * PRECISION);
    indices[n + 5] = m;
  }

  const indicesBuffer = gl.createBuffer ();
  gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, null);

  const program = gl.createProgram ()!;
  gl.attachShader (program, createVertexShader (gl));
  gl.attachShader (program, createFragmentShader (gl));
  gl.linkProgram (program);
  gl.useProgram (program);

  const coordinates = gl.getAttribLocation (program, 'coordinates');
  const mMatrixLoc = gl.getUniformLocation (program, 'mMatrix');
  const moveMatrix = new Float32Array ([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
  ]);

  const draw = function (): void {
    gl.bindBuffer (gl.ARRAY_BUFFER, verticesBuffer);
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.vertexAttribPointer (coordinates, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray (coordinates);

    gl.clearColor (0, 0, 0, 1);
    gl.enable (gl.DEPTH_TEST);
    gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport (0, 0, canvas.width, canvas.height);
    gl.uniformMatrix4fv (mMatrixLoc, false, moveMatrix);
    gl.drawElements (gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);
    gl.finish ();
    gl.flush ();
    window.requestAnimationFrame (draw);
  };

  const rotate = function (e: MouseEvent): void {
    if (e.buttons & 1) {
      rotateX (moveMatrix, e.movementY * Math.PI / 100);
      rotateY (moveMatrix, e.movementX * Math.PI / 100);
    }
  };
  document.addEventListener ('mousemove', rotate, {
    once: false,
    passive: true
  });

  const zoom = function (e: WheelEvent): void {
    const factor = Math.exp (-e.deltaY / 100);
    moveMatrix[0] *= factor;
    moveMatrix[1] *= factor;
    moveMatrix[2] *= factor;
    moveMatrix[4] *= factor;
    moveMatrix[5] *= factor;
    moveMatrix[6] *= factor;
    moveMatrix[8] *= factor;
    moveMatrix[9] *= factor;
    moveMatrix[10] *= factor;
  };
  document.addEventListener ('wheel', zoom, {
    once: false,
    passive: true
  });

  draw ();
}

onReady (init);
