precision highp float;

uniform sampler2D u_fishTexture;
varying float v_flip;

void main() {
    vec2 uv;
    if (v_flip > 0.0)
      uv = vec2(1.0-gl_PointCoord.x, gl_PointCoord.y);
    else
      uv = vec2(gl_PointCoord.x, gl_PointCoord.y);
    
    gl_FragColor = texture2D(u_fishTexture, uv);

}