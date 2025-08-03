precision highp float;

uniform sampler2D u_positionTex;
uniform sampler2D u_velocityTex;
uniform float u_deltaTime;

varying vec2 v_uv;

void main() {
  vec3 pos = texture2D(u_positionTex, v_uv).xyz;
  vec3 vel = texture2D(u_velocityTex, v_uv).xyz;

  vec3 toOrigin = -pos;
  vel += normalize(toOrigin) * 0.1 * u_deltaTime;

  gl_FragColor = vec4(vel, 0.0);
}
