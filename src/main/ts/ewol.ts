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
    void main (void) {
      gl_Position = vec4(coordinates, 1);
    }
  `);
  gl.compileShader (shader);
  return shader;
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

  gl.bindBuffer (gl.ARRAY_BUFFER, verticesBuffer);
  gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  const coordinates = gl.getAttribLocation (program, 'coordinates');
  gl.vertexAttribPointer (coordinates, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray (coordinates);

  gl.clearColor (0, 0, 0, 1);
  gl.enable (gl.DEPTH_TEST);
  gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport (0, 0, canvas.width, canvas.height);
  gl.drawElements (gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);
  gl.finish ();
  gl.flush ();
}

if (document.readyState === 'loading') {
  document.addEventListener ('DOMContentLoaded', init, {
    once: true,
    passive: true
  });
} else {
  init ();
}
