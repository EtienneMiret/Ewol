import { onReady } from './on-ready';
import { rotateY, translate } from './matrix';
import { Direction, loadMap, Wall, WorldMap } from './load-map';

const SPEED = 0.1;
const ANGULAR_SPEED = Math.PI / 10;

let x = 0.5;
let y = 0;
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

class Square {
  private readonly coordinates: number[];

  constructor (wall: Wall) {
    this.coordinates = [];
    this.coordinates.push (wall.x);
    this.coordinates.push (wall.y);
    this.coordinates.push (wall.z);
    this.coordinates.push (wall.x);
    this.coordinates.push (wall.y);
    this.coordinates.push (wall.z + 1);
    this.coordinates.push (wall.x + (wall.dir === Direction.X ? 1 : 0));
    this.coordinates.push (wall.y + (wall.dir === Direction.Y ? 1 : 0));
    this.coordinates.push (wall.z);
    this.coordinates.push (wall.x + (wall.dir === Direction.X ? 1 : 0));
    this.coordinates.push (wall.y + (wall.dir === Direction.Y ? 1 : 0));
    this.coordinates.push (wall.z + 1);
  }

  get (index: number) {
    return this.coordinates[index];
  }
}

function load (map: WorldMap) {
  const canvas = <HTMLCanvasElement>document.getElementById ('canvas');
  const gl = canvas.getContext ('webgl');
  if (!gl) {
    return;
  }

  const vertices = new Float32Array (12 * map.walls.length);
  for (let i = 0; i < map.walls.length; i++) {
    const n = 12 * i;
    const square = new Square (map.walls[i]);
    for (let j = 0; j < 12; j++) {
      vertices[n + j] = square.get (j);
    }
  }

  const verticesBuffer = gl.createBuffer ();
  gl.bindBuffer (gl.ARRAY_BUFFER, verticesBuffer);
  gl.bufferData (gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bindBuffer (gl.ARRAY_BUFFER, null);

  const lineIndices = new Uint16Array (8 * map.walls.length);
  for (let i = 0; i < map.walls.length; i++) {
    const n = 8 * i;
    const m = 4 * i;
    lineIndices[n] = m;
    lineIndices[n + 1] = m + 1;
    lineIndices[n + 2] = m;
    lineIndices[n + 3] = m + 2;
    lineIndices[n + 4] = m + 2;
    lineIndices[n + 5] = m + 3;
    lineIndices[n + 6] = m + 1;
    lineIndices[n + 7] = m + 3;
  }

  const lineIndexBuffer = gl.createBuffer ();
  gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, lineIndexBuffer);
  gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, lineIndices, gl.STATIC_DRAW);
  gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, null);

  const triangleIndices = new Uint16Array (6 * map.walls.length);
  for (let i = 0; i < map.walls.length; i++) {
    const n = 6 * i;
    const m = 4 * i;
    triangleIndices[n] = m;
    triangleIndices[n + 1] = m + 1;
    triangleIndices[n + 2] = m + 2;
    triangleIndices[n + 3] = m + 1;
    triangleIndices[n + 4] = m + 2;
    triangleIndices[n + 5] = m + 3;
  }

  const triangleIndexBuffer = gl.createBuffer();
  gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, triangleIndexBuffer);
  gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, triangleIndices, gl.STATIC_DRAW);
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

    gl.bindBuffer (gl.ARRAY_BUFFER, verticesBuffer);
    gl.vertexAttribPointer (coordinates, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray (coordinates);

    gl.clearColor (0, 0, 0, 1);
    gl.enable (gl.DEPTH_TEST);
    gl.depthFunc (gl.LEQUAL);
    gl.clearDepth(1.0);

    gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport (0, 0, canvas.width, canvas.height);
    gl.uniformMatrix4fv (mMatrixLoc, false, modelMatrix);
    gl.uniformMatrix4fv (vMatrixLoc, false, viewMatrix);
    gl.uniformMatrix4fv (pMatrixLoc, false, projectionMatrix);

    gl.uniform3f (colorLoc, 1, 1, 1);
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, triangleIndexBuffer);
    gl.drawElements (gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_SHORT, 0);

    gl.uniform3f (colorLoc, 0, 0, 0);
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, lineIndexBuffer);
    gl.drawElements (gl.LINES, lineIndices.length, gl.UNSIGNED_SHORT, 0);

    gl.finish ();
    gl.flush ();

    window.requestAnimationFrame (draw);
  };
  draw ();

  const onKeyDown = function (e: KeyboardEvent): void {
    const theta = orientation + Math.PI / 2;
    switch (e.code) {
      case 'KeyW':
        x += Math.cos (theta) * SPEED;
        y += Math.sin (theta) * SPEED;
        break;
      case 'KeyS':
        x -= Math.cos (theta) * SPEED;
        y -= Math.sin (theta) * SPEED;
        break;
      case 'KeyA':
        orientation += ANGULAR_SPEED;
        break;
      case 'KeyD':
        orientation -= ANGULAR_SPEED;
        break;
    }
  };
  document.addEventListener ('keydown', onKeyDown);
}

function init (): void {
  loadMap (load);
}

onReady (init);
