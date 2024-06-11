#version 300 es
precision highp float;

in vec3 DrawNormal;
in vec3 DrawPos;
out vec4 OutColor;

uniform float Time;

void main( void )
{
  vec3 color = vec3(1.0, 0.1, 8.0);
  vec3 L = vec3(0, 0, 2);

  vec3 N = normalize(faceforward(DrawNormal, -L, DrawNormal));

  OutColor = vec4(vec3(1.0, 0.0, 0.74) * dot(N, L), 1.0);
  //OutColor = vec4(N, 1.0);
}