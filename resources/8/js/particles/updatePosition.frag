precision highp float;

uniform sampler2D u_positionTex;
uniform sampler2D u_velocityTex;
uniform float u_deltaTime;

varying vec2 v_uv;

void main() {
  vec3 pos = texture2D(u_positionTex, v_uv).xyz;
  vec3 vel = texture2D(u_velocityTex, v_uv).xyz;

  pos += vel * u_deltaTime;

  gl_FragColor = vec4(pos, 1.0);
}
