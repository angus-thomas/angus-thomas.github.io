uniform mat4 u_transform;

attribute vec4 a_color;
attribute vec4 a_position;

varying vec4 v_color;

void main() {
    v_color = a_color;
    gl_Position = u_transform * a_position;
}