import * as mth from "./mth/mth_def";

let canvas,
  gl,
  timeLoc,
  mousePos = { x: 0, y: 0, scale: 1 },
  mouseLoc,
  cam;

function main() {
  initGL();
  window.dk6_wh = [canvas.width, canvas.height];

  const draw = () => {
    render();

    window.requestAnimationFrame(draw);
  };

  cam = mth.camera();
  cam.setPos(mth.vec3(5), mth.vec3(), mth.vec3(0, 1, 0));
  cam.setProj(0.1, 0.1, 100000);
  cam.setFrameSize(window.dk6_wh[0], window.dk6_wh[1]);

  draw();
}

// OpenGL initialization function
function initGL() {
  canvas = document.getElementById("myCan");
  gl = canvas.getContext("webgl2");
  gl.clearColor(0.3, 0.47, 0.8, 1);

  window.dk6_wh = [canvas.width, canvas.height];

  // Shader creation
  let vs_txt = `#version 300 es
  precision highp float;
  in vec3 InPosition;
    
  out vec2 DrawPos;
  uniform float Time;
 
  void main( void )
  {
    gl_Position = vec4(InPosition, 1);
    DrawPos = InPosition.xy;
  }
  `;
  let fs_txt = `#version 300 es
  precision highp float;

  out vec4 OutColor;
  
  in vec2 DrawPos;
  uniform float Time;
  uniform vec3 Mouse;

  vec2 Mul( vec2 Z1, vec2 Z2 )
  {
    return vec2(Z1.x * Z2.x - Z1.y * Z2.y, Z1.x * Z2.y + Z2.x * Z1.y);
  }
 
  void main( void )
  {
    float n = 0.0;
    vec2 Z = (DrawPos + Mouse.xy) / Mouse.z;
    
    while(n < 255.0 && Z.x * Z.x + Z.y * Z.y < 4.0)
    {
      Z = Mul(Z, Z) + vec2(sin(Time) / 6.0, tan(Time) * sin(Time) / 1.5);
      n += 1.0;
    }

    OutColor = vec4(n / 255.0, n / 510.0, 2.0 * n / 255.0, 1.0);
  }
  `;
  let vs = loadShader(gl.VERTEX_SHADER, vs_txt),
    fs = loadShader(gl.FRAGMENT_SHADER, fs_txt),
    prg = gl.createProgram();
  gl.attachShader(prg, vs);
  gl.attachShader(prg, fs);
  gl.linkProgram(prg);
  if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
    let buf = gl.getProgramInfoLog(prg);
    console.log("Shader program link fail: " + buf);
  }

  // Vertex buffer creation
  const size = 0.99;
  const vertexes = [
    -size,
    size,
    0,
    -size,
    -size,
    0,
    size,
    size,
    0,
    size,
    -size,
    0,
  ];
  const posLoc = gl.getAttribLocation(prg, "InPosition");
  let vertexArray = gl.createVertexArray();
  gl.bindVertexArray(vertexArray);
  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexes), gl.STATIC_DRAW);
  if (posLoc != -1) {
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLoc);
  }

  // Uniform data
  timeLoc = gl.getUniformLocation(prg, "Time");
  mouseLoc = gl.getUniformLocation(prg, "Mouse");

  gl.useProgram(prg);
} // End of 'initGL' function

// Load and compile shader function
function loadShader(shaderType, shaderSource) {
  const shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    let buf = gl.getShaderInfoLog(shader);
    console.log("Shader compile fail: " + buf);
  }
  return shader;
} // End of 'loadShader' function

// Main render frame function
function render() {
  // console.log(`Frame ${x++}`);
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (timeLoc != -1) {
    const date = new Date();
    let t =
      date.getMinutes() * 60 +
      date.getSeconds() +
      date.getMilliseconds() / 1000;

    gl.uniform1f(timeLoc, t);
  }

  if (mouseLoc != -1) {
    gl.uniform3f(mouseLoc, mousePos.x, mousePos.y, mousePos.scale);
  }

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
} // End of 'render' function

/**
 * @param {Number} mouseX
 * @param {Number} mouseY
 * @param {Number} tick
 */
export function mouseScroll(mouseX, mouseY, tick) {
  mousePos.x = 2 * mouseX + 1;
  mousePos.y = 2 * mouseY - 1;
  mousePos.scale += tick;
}

window.addEventListener("load", () => {
  main();
});

console.log("CGSG forever!!! mylib.js imported");
