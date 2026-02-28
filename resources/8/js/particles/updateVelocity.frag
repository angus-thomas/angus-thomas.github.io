precision highp float;

uniform sampler2D u_positionTex;
uniform sampler2D u_velocityTex;
uniform float u_deltaTime;

varying vec2 v_uv;

void main() {
  vec3 pos = texture2D(u_positionTex, v_uv).xyz;
  vec3 vel = texture2D(u_velocityTex, v_uv).xyz;

  if (pos.x < -0.9 && vel.x < 0.0)
    vel.x = - vel.x;
  else if (pos.x > 0.9 && vel.x > 0.0)
    vel.x = - vel.x;
  else if (vel.x > -0.2 && vel.x < 0.2)
    vel.x = vel.x * 2.0;

  gl_FragColor = vec4(vel, 0.0);
}
