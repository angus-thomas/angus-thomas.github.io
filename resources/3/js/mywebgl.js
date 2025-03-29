const RESOURCES_LIB = "/resources/3"

const KEY_UP = 0
const KEY_DOWN = 1
const KEY_LEFT = 2
const KEY_RIGHT = 3
const KEY_W = 4
const KEY_A = 5
const KEY_S = 6
const KEY_D = 7
/**
 * @type {boolean[]}
 */
const keysPressed = [false, false, false, false, false, false, false, false]

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

let program;
await gl_init();

var playerSpeed = 1;
const playerPosition = new Float32Array([0,	0,	0]);
const playerVelocity = new Float32Array([0,	0,	0]);

canvas.addEventListener("keydown", function (ev) {
	switch (ev.key) {
		case "w": case "W":
			keysPressed[KEY_W] = true; break;
		case "a": case "A":
			keysPressed[KEY_A] = true; break;
		case "s": case "S":
			keysPressed[KEY_S] = true; break;
		case "d": case "D":
			keysPressed[KEY_D] = true; break;
	}
});
canvas.addEventListener("keyup", function (ev) {
	switch (ev.key) {
		case "w": case "W":
			keysPressed[KEY_W] = false; break;
		case "a": case "A":
			keysPressed[KEY_A] = false; break;
		case "s": case "S":
			keysPressed[KEY_S] = false; break;
		case "d": case "D":
			keysPressed[KEY_D] = false; break;
	}
});


let lastCall = Date.now();
function update() {
	const now = Date.now();
	const elapsed = (now - lastCall) / 1000.0;
	lastCall = now;

	// Physics update

	playerPosition[0] += elapsed * playerVelocity[0];
	playerPosition[1] += elapsed * playerVelocity[1];
	playerPosition[2] += elapsed * playerVelocity[2];

	// Player control
	if (keysPressed[KEY_W] && !keysPressed[KEY_S]) {
		playerVelocity[1] = playerSpeed;
	} else if (keysPressed[KEY_S] && !keysPressed[KEY_W]) {
		playerVelocity[1] = -playerSpeed;
	} else {
		playerVelocity[1] = 0;
	}

	if (keysPressed[KEY_D] && !keysPressed[KEY_A]) {
		playerVelocity[0] = playerSpeed;
	} else if (keysPressed[KEY_A] && !keysPressed[KEY_D]) {
		playerVelocity[0] = -playerSpeed;
	} else {
		playerVelocity[0] = 0;
	}
//	console.log("("+playerVelocity[0]+", "+playerVelocity[1] + "); ("+playerPosition[0]+", "+playerPosition[1]+")");
}

setInterval(update,	300);
setInterval(repaint,	100);


async function loadShaderFromFile(url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to load shader: ${url}`);
	}
	const fuck = await response.text();
	return fuck;
}

// Usage
async function gl_init() {
	/** @type {HTMLCanvasElement} */

	if (!gl) {
		throw Error("WebGL is not supported.")
	}
	// Clear the canvas to transparent
	gl.clearColor(0.0,	0.0,	0.0,	0.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Vertex shader source code
	const vertexShaderResponse = await fetch(RESOURCES_LIB + "/js/vertexShader.glsl");
	const vertexShaderSource = await vertexShaderResponse.text();
	
	// Fragment shader source codex
	const fragmentShaderSource = `
		precision mediump float;
		void main() {
			gl_FragColor = vec4(1.0,	0.0,	0.0,	1.0);  // Red color
		}
	`;

	// Compile shaders
	function compileShader(source, type) {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error("ERROR compiling shader:", gl.getShaderInfoLog(shader));
		}
		return shader;
	}

	// Create shaders and program
	const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
	const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

	program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	gl.useProgram(program);
	
}
var playerTheta = 0

let then = Date.now()
function repaint() {
	const now = Date.now();
	const deltaTime = now - then;
	then = now;
	
	//webglUtils.resizeCanvasToDisplaySize(gl.canvas);
	
    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Turn on culling. By default backfacing triangles
    // will be culled.

    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);
	
	gl.useProgram(program);
	
	// Set the uniform transformation matrix
	var theta = now /1000 % (2 * Math.PI);
	var c = Math.cos(theta); // Temporarily use depth as rotation
	var s = Math.sin(theta);
	var px = playerPosition[0];
	var py = playerPosition[1];
	var pz = playerPosition[2];
	var transformLocation = gl.getUniformLocation(program, "u_transform");
	var transformValues = [
		c,	0,	-s,	0,
		0,	1,	0,	0,
		s,	0,	c,	0,
		px,	py,	pz,	1
	]
	gl.uniformMatrix4fv(transformLocation, false, new Float32Array(transformValues));
	
	const dz = 0.0
	const q = 0.25;
	const o = -q
	const l = q
	const vertices = new Float32Array([
		-q,-q,-q    +dz, 1,
		 q,-q,-q    +dz, 1,
		-q, q,-q    +dz, 1,
		 q, q,-q    +dz, 1,
		 
		 -q, q, q    +dz, 1,
		  q, q, q    +dz, 1,
		 -q,-q, q    +dz, 1,
		  q,-q, q    +dz, 1,
		 
	]);
	// Create a buffer and load the vertices
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	// Get attribute location and enable it
	const position = gl.getAttribLocation(program, "a_position");
	gl.enableVertexAttribArray(position);
	gl.vertexAttribPointer(position,	4, gl.FLOAT, false,	0,	0);

	// Draw the red square
	gl.drawArrays(gl.TRIANGLE_STRIP,	0,	8);

}

