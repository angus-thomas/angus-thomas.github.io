uniform mat4 u_model;
uniform mat4 u_view;

attribute vec4 a_color;
attribute vec3 a_position;

varying vec4 v_color;

void main() {
    v_color = a_color;
    gl_Position =  u_view * u_model * vec4(a_position, 1);
}