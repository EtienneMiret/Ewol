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

  const buffer = gl.createBuffer ();
  gl.bindBuffer (gl.ARRAY_BUFFER, buffer);
  gl.bufferData (gl.ARRAY_BUFFER, new Float32Array ([
    -0.5, 0, 0,
    0.5, 0, 0,
    0, 1, 0
  ]), gl.STATIC_DRAW);
  gl.bindBuffer (gl.ARRAY_BUFFER, null);

  const program = gl.createProgram ()!;
  gl.attachShader (program, createVertexShader (gl));
  gl.attachShader (program, createFragmentShader (gl));
  gl.linkProgram (program);
  gl.useProgram (program);

  gl.bindBuffer (gl.ARRAY_BUFFER, buffer);
  const coordinates = gl.getAttribLocation (program, 'coordinates');
  gl.vertexAttribPointer (coordinates, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray (coordinates);

  gl.clearColor (0, 0, 0, 1);
  gl.enable (gl.DEPTH_TEST);
  gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport (0, 0, canvas.width, canvas.height);
  gl.drawArrays (gl.TRIANGLES, 0, 3);
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
