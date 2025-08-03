precision highp float;

uniform sampler2D u_positionTex;
uniform float u_texSize;

attribute float a_index;

void main() {
  float x = mod(a_index, u_texSize);
  float y = floor(a_index / u_texSize);
  vec2 uv = (vec2(x, y) + 0.5) / u_texSize;

  vec3 pos = texture2D(u_positionTex, uv).xyz;

  gl_Position = vec4(pos, 1.0);
  gl_PointSize = 5.0;
}
