import { onReady } from './on-ready';
import { rotateY, translate } from './matrix';
import { loadMap, WorldMap } from './load-map';
import { Square } from './shape';

const SPEED = 0.1;
const ANGULAR_SPEED = Math.PI / 10;

let x = 0.5;
let y = 0.5;
let z = 0.5;
let orientation = 0;

function createFragmentShader (gl: WebGLRenderingContext): WebGLShader {
  const shader = gl.createShader (gl.FRAGMENT_SHADER)!;
  gl.shaderSource (shader, `
    precision mediump float;
    varying vec3 vColor;
    void main (void) {
      gl_FragColor = vec4 (vColor, 1);
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
    uniform mat4 vMatrix;
    uniform mat4 pMatrix;
    uniform vec3 color;
    varying vec3 vColor;
    void main (void) {
      gl_Position = pMatrix * vMatrix * mMatrix * vec4(coordinates, 1);
      vColor = color;
    }
  `);
  gl.compileShader (shader);
  return shader;
}

function project (
    angle: number,
    ratio: number,
    zMin: number,
    zMax: number
): number[] {
  const tan = Math.tan (angle / 2);
  return [
    0.5 / tan, 0, 0, 0,
    0, 0.5 * ratio / tan, 0, 0,
    0, 0, -(zMax + zMin) / (zMax - zMin), -1,
    0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
  ];
}

function view (): number[] {
  const matrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
  translate (matrix, -x, -z, y);
  rotateY (matrix, -orientation);
  return matrix;
}

function model (): number[] {
  return [
    1, 0, 0, 0,
    0, 0, -1, 0,
    0, 1, 0, 0,
    0, 0, 0, 1
  ];
}

function load (map: WorldMap) {
  const canvas = <HTMLCanvasElement>document.getElementById ('canvas');
  const gl = canvas.getContext ('webgl');
  if (!gl) {
    return;
  }

  const vertices = new Float32Array (3 * Square.COORDINATES_PER_WALL * map.walls.length);
  for (let i = 0; i < map.walls.length; i++) {
    const n = 3 * Square.COORDINATES_PER_WALL * i;
    const square = new Square (map.walls[i]);
    for (let j = 0; j < 3 * Square.COORDINATES_PER_WALL; j++) {
      vertices[n + j] = square.getOrdinate (j);
    }
  }

  const vertexBuffer = gl.createBuffer ();
  gl.bindBuffer (gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData (gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bindBuffer (gl.ARRAY_BUFFER, null);

  const blackIndices = new Uint16Array (3 * Square.BLACK_TRIANGLES_PER_WALL * map.walls.length);
  for (let i = 0; i < map.walls.length; i++) {
    for (let j = 0; j < 4; j++) {
      const n = 3 * Square.BLACK_TRIANGLES_PER_WALL * i + 6 * j;
      const m = Square.COORDINATES_PER_WALL * i + 4 * j;
      blackIndices[n] = m;
      blackIndices[n + 1] = m + 1;
      blackIndices[n + 2] = m + 2;

      blackIndices[n + 3] = m + 1;
      blackIndices[n + 4] = m + 2;
      blackIndices[n + 5] = m + 3;
    }

    const n = 3 * Square.BLACK_TRIANGLES_PER_WALL * i;
    const m = Square.COORDINATES_PER_WALL * i;
    blackIndices[n + 24] = m + 1;
    blackIndices[n + 25] = m + 4;
    blackIndices[n + 26] = m + 3;

    blackIndices[n + 27] = m + 4;
    blackIndices[n + 28] = m + 3;
    blackIndices[n + 29] = m + 6;

    blackIndices[n + 30] = m + 2;
    blackIndices[n + 31] = m + 3;
    blackIndices[n + 32] = m + 8;

    blackIndices[n + 33] = m + 3;
    blackIndices[n + 34] = m + 8;
    blackIndices[n + 35] = m + 9;

    blackIndices[n + 36] = m + 6;
    blackIndices[n + 37] = m + 7;
    blackIndices[n + 38] = m + 12;

    blackIndices[n + 39] = m + 7;
    blackIndices[n + 40] = m + 12;
    blackIndices[n + 41] = m + 13;

    blackIndices[n + 42] = m + 9;
    blackIndices[n + 43] = m + 12;
    blackIndices[n + 44] = m + 11;

    blackIndices[n + 45] = m + 12;
    blackIndices[n + 46] = m + 11;
    blackIndices[n + 47] = m + 14;
  }

  const blackIndexBuffer = gl.createBuffer ();
  gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, blackIndexBuffer);
  gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, blackIndices, gl.STATIC_DRAW);
  gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, null);

  const whiteIndices = new Uint16Array (3 * Square.WHITE_TRIANGLES_PER_WALL * map.walls.length);
  for (let i = 0; i < map.walls.length; i++) {
    const n = 3 * Square.WHITE_TRIANGLES_PER_WALL * i;
    const m = Square.COORDINATES_PER_WALL * i;
    whiteIndices[n] = m + 3;
    whiteIndices[n + 1] = m + 6;
    whiteIndices[n + 2] = m + 9;
    whiteIndices[n + 3] = m + 6;
    whiteIndices[n + 4] = m + 9;
    whiteIndices[n + 5] = m + 12;
  }

  const whiteIndexBuffer = gl.createBuffer ();
  gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, whiteIndexBuffer);
  gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, whiteIndices, gl.STATIC_DRAW);
  gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, null);

  const program = gl.createProgram ()!;
  gl.attachShader (program, createVertexShader (gl));
  gl.attachShader (program, createFragmentShader (gl));
  gl.linkProgram (program);
  gl.useProgram (program);

  const coordinates = gl.getAttribLocation (program, 'coordinates');
  const mMatrixLoc = gl.getUniformLocation (program, 'mMatrix');
  const vMatrixLoc = gl.getUniformLocation (program, 'vMatrix');
  const pMatrixLoc = gl.getUniformLocation (program, 'pMatrix');
  const colorLoc = gl.getUniformLocation (program, 'color');

  const modelMatrix = model ();
  const projectionMatrix = project (Math.PI / 2, canvas.width / canvas.height, 0.1, 100);

  const draw = function (): void {
    const viewMatrix = view ();

    gl.bindBuffer (gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer (coordinates, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray (coordinates);

    gl.clearColor (.5, .5, .5, 1);
    gl.enable (gl.DEPTH_TEST);
    gl.depthFunc (gl.LEQUAL);
    gl.clearDepth(1.0);

    gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport (0, 0, canvas.width, canvas.height);
    gl.uniformMatrix4fv (mMatrixLoc, false, modelMatrix);
    gl.uniformMatrix4fv (vMatrixLoc, false, viewMatrix);
    gl.uniformMatrix4fv (pMatrixLoc, false, projectionMatrix);

    gl.uniform3f (colorLoc, 0, 0, 0);
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, blackIndexBuffer);
    gl.drawElements (gl.TRIANGLES, blackIndices.length, gl.UNSIGNED_SHORT, 0);

    gl.uniform3f (colorLoc, 1, 1, 1);
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, whiteIndexBuffer);
    gl.drawElements (gl.TRIANGLES, whiteIndices.length, gl.UNSIGNED_SHORT, 0);

    gl.finish ();
    gl.flush ();

    window.requestAnimationFrame (draw);
  };
  draw ();

  const onKeyDown = function (e: KeyboardEvent): void {
    const theta = orientation + Math.PI / 2;
    const location = map.getTile (Math.floor (x), Math.floor (y), Math.floor (z));
    let newX = x;
    let newY = y;
    switch (e.code) {
      case 'KeyW':
        newX += Math.cos (theta) * SPEED;
        newY += Math.sin (theta) * SPEED;
        break;
      case 'KeyS':
        newX -= Math.cos (theta) * SPEED;
        newY -= Math.sin (theta) * SPEED;
        break;
      case 'KeyQ':
        newX -= Math.sin (theta) * SPEED;
        newY += Math.cos (theta) * SPEED;
        break;
      case 'KeyE':
        newX += Math.sin (theta) * SPEED;
        newY -= Math.cos (theta) * SPEED;
        break;
      case 'KeyA':
        orientation += ANGULAR_SPEED;
        break;
      case 'KeyD':
        orientation -= ANGULAR_SPEED;
        break;
    }
    if (!map.isCloseToWall(newX, newY, z)) {
      x = newX;
      y = newY;
    }
  };
  document.addEventListener ('keydown', onKeyDown);
}

function init (): void {
  loadMap (load);
}

onReady (init);
