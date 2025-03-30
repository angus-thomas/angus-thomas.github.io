"use strict";

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


const canvas = document.getElementById("glCanvas");
const repaint = await gl_init(canvas);

var playerSpeed = 1;
var playerTheta = 0
const playerPosition = new Float32Array([0, 0, 0]);
const playerVelocity = new Float32Array([0, 0, 0]);

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
	// console.log("("+playerVelocity[0]+", "+playerVelocity[1] + "); ("+playerPosition[0]+", "+playerPosition[1]+")");
}


/**
 * @param {HTMLCanvasElement} canvas
 */
async function gl_init(canvas) {
	
	const gl = canvas.getContext("webgl");
	
	let program;
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
	const fragmentShaderResponse = await fetch(RESOURCES_LIB + "/js/fragmentShader.glsl");
	const fragmentShaderSource = await fragmentShaderResponse.text();
	
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
	
	const colourArr = new Float32Array([
		Math.random(), Math.random(), Math.random(), 1
	])
	
	// Retrieve the attribute location (outside the render loop)
	const transformLocation = gl.getUniformLocation(program, "u_transform");
	const colourLocation = gl.getAttribLocation(program, "a_color");
	
	// Load the shapes and colours into the GPU
	const unitColoursBuffer = gl.createBuffer();
	const unitColours = new Uint8Array([
		163,  73, 164, 255, // purple
		255, 127,  39, 244, // orange
		63,  72, 204, 255, // dblue
		
		255, 127,  39, 244, // orange
		255, 242,   0, 255, // yellow
		 63,  72, 204, 255, // dblue
		
		 63,  72, 204, 255, // dblue
		255, 242,   0, 255, // yellow
		  0, 162, 232, 255, // lblue
		
		  0, 162, 232, 255, // lblue
		255, 242,   0, 255, // yellow
		 34, 177,  76, 255, // dgreen
		
		 34, 177,  76, 255, // dgreen
		255, 242,   0, 255, // yellow
		181, 230,  29, 255, // green
		
		181, 230,  29, 255, // green
		255, 242,   0, 255, // yellow
		255, 127,  39, 244, // orange
		
		255, 127,  39, 244, // orange
		163,  73, 164, 255, // purple
		181, 230,  29, 255, // green
		
		181, 230,  29, 255, // green
		163,  73, 164, 255, // purple
		255, 174, 201, 255, // pink
		
		255, 174, 201, 255, // pink
		  0, 162, 232, 255, // lblue
		181, 230,  29, 255, // green
		
		181, 230,  29, 255, // green
		  0, 162, 232, 255, // lblue
		 34, 177,  76, 255, // dgreen
		
		  0, 162, 232, 255, // lblue
		255, 174, 201, 255, // pink
		163,  73, 164, 255, // purple
		
		163,  73, 164, 255, // purple
		 63,  72, 204, 255, // dblue
		  0, 162, 232, 255, // lblue
		
	]);
	gl.bindBuffer(gl.ARRAY_BUFFER, unitColoursBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, unitColours, gl.STATIC_DRAW);
	
	const dz = 0.0
	const q = 0.25;
	
	const positionLocation = gl.getAttribLocation(program, "a_position");
	const positionBuffer = gl.createBuffer();
	const unitCube = new Float32Array([
		-q,-q,q + dz, 1, // purple
		-q,-q,-q + dz, 1, // orange
		q,-q,q + dz, 1, // dblue
		
		-q,-q,-q + dz, 1, // orange
		-q,q,-q + dz, 1, // yellow
		q,-q,q + dz, 1, // dblue
		
		q,-q,q + dz, 1, // dblue
		-q,q,-q + dz, 1, // yellow
		q,q,q + dz, 1, // lblue
		
		q,q,q + dz, 1, // lblue
		-q,q,-q + dz, 1, // yellow
		q,q,-q + dz, 1, // dgreen
		
		q,q,-q + dz, 1, // dgreen
		-q,q,-q + dz, 1, // yellow
		-q,q,-q + dz, 1, // lgreen
		
		-q,q,-q + dz, 1, // lgreen
		-q,q,-q + dz, 1, // yellow
		-q,-q,-q + dz, 1, // orange
		
		-q,-q,-q + dz, 1, // orange
		-q,-q,q + dz, 1, // purple
		-q,q,-q + dz, 1, // lgreen
		
		-q,q,-q + dz, 1, // lgreen
		-q,-q,q + dz, 1, // purple
		-q,q,q + dz, 1, // pink
		
		-q,q,q + dz, 1, // pink
		q,q,q + dz, 1, // lblue
		-q,q,-q + dz, 1, // lgreen
		
		-q,q,-q + dz, 1, // lgreen
		q,q,q + dz, 1, // lblue
		q,q,-q + dz, 1, // dgreen
		
		q,q,q + dz, 1, // lblue
		-q,q,q + dz, 1, // pink
		-q,-q,q + dz, 1, // purple
		
		-q,-q,q + dz, 1, // purple
		q,-q,q + dz, 1, // dblue
		q,q,q + dz, 1 // lblue
		
	]);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, unitCube, gl.STATIC_DRAW);
	
	let then = Date.now()
	function repaint() {
		const now = Date.now();
		const deltaTime = now - then;
		then = now;
		
		// Clear the canvas AND the depth buffer.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		// Turn on culling. By default backfacing triangles
		// will be culled.
		gl.enable(gl.CULL_FACE);

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
		var transformValues = [
			c,	0,	-s,	0,
			0,	1,	0,	0,
			s,	0,	c,	0,
			px,	py,	pz,	1
		]
		gl.uniformMatrix4fv(transformLocation, false, new Float32Array(transformValues));
		
		/*
		const cubeColours = new Uint8Array([
			255, 127,  39, 244, // orange
			255, 242,   0, 255, // yellow
			163,  73, 164, 255, // purple
			 63,  72, 204, 255, // dblue
			181, 230,  29, 255, // lgreen
			 34, 177,  76, 255, // dgreen
			  0, 162, 232, 255, // lblue
			255, 174, 201, 255, // pink
		])
		
		0,0,0, // orange
		0,1,0, // yellow
		0,0,1, // purple
		1,0,1, // dblue
		0,1,0, // lgreen
		1,1,0, // dgreen
		0,1,1, // pink
		1,1,1, // lblue
		*/
		
		// Set up the loading of the (filled) vertex & colour buffers
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0); // 4-vectors of floats
		
		gl.bindBuffer(gl.ARRAY_BUFFER, unitColoursBuffer);
		gl.enableVertexAttribArray(colourLocation);
		gl.vertexAttribPointer(colourLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0); // 4-vectors of 8-bit unsigned integers hich should be normalised to range 0-1
		
		// Draw the red square
		gl.drawArrays(gl.TRIANGLES,	0,	6*2*3);
		
	}
	
	return repaint;
}

setInterval(update, 300);
setInterval(repaint, 100);
