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
		255, 127,  39, 244, // orange
		63,  72, 204, 255, // dblue
		63,  72, 204, 255, // dblue
		163,  73, 164, 255, // purple
		
		255, 127,  39, 244, // orange
		255, 242,   0, 255, // yellow
		255, 242,   0, 255, // yellow
		63,  72, 204, 255, // dblue
		63,  72, 204, 255, // dblue
		255, 127,  39, 244, // orange
		
		 63,  72, 204, 255, // dblue
		 255, 242,   0, 255, // yellow
		 255, 242,   0, 255, // yellow
		 0, 162, 232, 255, // lblue
		 0, 162, 232, 255, // lblue
		 63,  72, 204, 255, // dblue
		
		  0, 162, 232, 255, // lblue
		  255, 242,   0, 255, // yellow
		  255, 242,   0, 255, // yellow
		  34, 177,  76, 255, // dgreen
		  34, 177,  76, 255, // dgreen
		  0, 162, 232, 255, // lblue
		
		 34, 177,  76, 255, // dgreen
		 255, 242,   0, 255, // yellow
		 255, 242,   0, 255, // yellow
		 181, 230,  29, 255, // green
		 181, 230,  29, 255, // green
		 34, 177,  76, 255, // dgreen
		
		181, 230,  29, 255, // green
		255, 242,   0, 255, // yellow
		255, 242,   0, 255, // yellow
		255, 127,  39, 244, // orange
		255, 127,  39, 244, // orange
		181, 230,  29, 255, // green
		
		255, 127,  39, 244, // orange
		163,  73, 164, 255, // purple
		163,  73, 164, 255, // purple
		181, 230,  29, 255, // green
		181, 230,  29, 255, // green
		255, 127,  39, 244, // orange
		
		181, 230,  29, 255, // green
		163,  73, 164, 255, // purple
		163,  73, 164, 255, // purple
		255, 174, 201, 255, // pink
		255, 174, 201, 255, // pink
		181, 230,  29, 255, // green
		
		255, 174, 201, 255, // pink
		255, 174, 201, 255, // pink
		255, 174, 201, 255, // pink
		  0, 162, 232, 255, // lblue
		  0, 162, 232, 255, // lblue
		181, 230,  29, 255, // green
		
		181, 230,  29, 255, // green
		0, 162, 232, 255, // lblue
		0, 162, 232, 255, // lblue
		34, 177,  76, 255, // dgreen
		34, 177,  76, 255, // dgreen
		181, 230,  29, 255, // green
		
		  0, 162, 232, 255, // lblue
		  255, 174, 201, 255, // pink
		  255, 174, 201, 255, // pink
		  163,  73, 164, 255, // purple
		  163,  73, 164, 255, // purple
		  0, 162, 232, 255, // lblue
		
		163,  73, 164, 255, // purple
		63,  72, 204, 255, // dblue
		63,  72, 204, 255, // dblue
		0, 162, 232, 255, // lblue
		0, 162, 232, 255, // lblue
		163,  73, 164, 255, // pursple
		
	]);
	gl.bindBuffer(gl.ARRAY_BUFFER, unitColoursBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, unitColours, gl.STATIC_DRAW);
	
	const dz = 0.0
	const q = 0.25;
	
	const positionLocation = gl.getAttribLocation(program, "a_position");
	const positionBuffer = gl.createBuffer();
	const unitCube = new Float32Array([
		0,0,q,1, // purple
		0,0,0,1, // orange
		0,0,0,1, // orange
		q,0,q,1, // dblue
		q,0,q,1, // dblue
		0,0,q,1, // purple
		
		0,0,0,1, // orange
		q,0,0,1, // yellow
		q,0,0,1, // yellow
		q,0,q,1, // dblue
		q,0,q,1, // dblue
		0,0,0,1, // orange
		
		q,0,q,1, // dblue
		q,0,0,1, // yellow
		q,0,0,1, // yellow
		q,q,q,1, // lblue
		q,q,q,1, // lblue
		q,0,q,1, // dblue
		
		q,q,q,1, // lblue
		q,0,0,1, // yellow
		q,0,0,1, // yellow
		q,q,0,1, // dgreen
		q,q,0,1, // dgreen
		q,q,q,1, // lblue
		
		q,q,0,1, // dgreen
		q,0,0,1, // yellow
		q,0,0,1, // yellow
		0,q,0,1, // lgreen
		0,q,0,1, // lgreen
		q,q,0,1, // dgreen
		
		0,q,0,1, // lgreen
		q,0,0,1, // yellow
		q,0,0,1, // yellow
		0,0,0,1, // orange
		0,0,0,1, // orange
		0,q,0,1, // lgreen
		
		0,0,0,1, // orange
		0,0,q,1, // purple
		0,0,q,1, // purple
		0,q,0,1, // lgreen
		0,q,0,1, // lgreen
		0,0,0,1, // orange
		
		0,q,0,1, // lgreen
		0,0,q,1, // purple
		0,0,q,1, // purple
		0,q,q,1, // pink
		0,q,q,1, // pink
		0,q,0,1, // lgreen
		
		0,q,q,1, // pink
		q,q,q,1, // lblue
		q,q,q,1, // lblue
		0,q,0,1, // lgreen
		0,q,0,1, // lgreen
		0,q,q,1, // pink
		
		0,q,0,1, // lgreen
		q,q,q,1, // lblue
		q,q,q,1, // lblue
		q,q,0,1, // dgreen
		q,q,0,1, // dgreen
		0,q,0,1, // lgreen
		
		q,q,q,1, // lblue
		0,q,q,1, // pink
		0,q,q,1, // pink
		0,0,q,1, // purple
		0,0,q,1, // purple
		q,q,q,1, // lblue
		
		0,0,q,1, // purple
		q,0,q,1, // dblue
		q,0,q,1, // dblue
		q,q,q,1, // lblue
		q,q,q,1, // lblue
		0,0,q,1, // purple
		
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
		];
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
		gl.drawArrays(gl.LINES,	0,	6*2*6);
		
	}
	
	return repaint;
}

setInterval(update, 300);
setInterval(repaint, 100);

function m4mul(m, n) {
	/* Column first matrixes
	(
	Here we multiply 2 column-first matrices. We represent the matrix with the columns (e.g., mi1) horizontally.
		m00 m10 m20 m30  x  n00 n10 n20 n30  =  mn00 mn10 mn20 mn30   < c0
		m01 m11 m21 m31  x  n01 n11 n21 n31  =  mn01 mn11 mn21 mn31   < c1
		m02 m12 m22 m32  x  n02 n12 n22 n32  =  mn02 mn12 mn22 mn32   < c2
		m03 m13 m23 m33  x  n03 n13 n23 n33  =  mn03 mn13 mn23 mn33   < c3
		^   ^   ^   ^ 
		r0  r1  r2  r3 
	
	The arrays are stored column-first, contiguously, in one array. To access the ijth element,
		mij = m[j * 4 + i]
	
	Mathematically, the ijth component of the result matrix is the ith row of the first matrix dot the jth column of the second.
		mn23 = m's r2 dot n's c3
		= m2i ni3 (Einstein summation convention
		= m[4*2+0]*n[4*0+3] + m[4*2+1]*n[4*1+3] + m[4*2+2]*n[4*2+3] + m[4*2+0]*n[4*3+3]
	
	This doesn't of course require matrix N to have only 16 items; n can be an arbitrarily large collection of 4-vectors. Our code
	uses 4-vector arrays of floats to represent shape vertices.
	*/
	
	const vecs = n.length / 4;
	if (vecs === 4) {
		return [
			m[4*0+0]*n[4*0+0] + m[4*0+1]*n[4*1+0] + m[4*1+2]*n[4*2+0] + m[4*3+0]*n[4*3+0], // mn00
			m[4*1+0]*n[4*0+0] + m[4*1+1]*n[4*1+0] + m[4*1+2]*n[4*2+0] + m[4*1+0]*n[4*3+0], // mn10
			m[4*2+0]*n[4*0+0] + m[4*2+1]*n[4*1+0] + m[4*2+2]*n[4*2+0] + m[4*2+0]*n[4*3+0], // mn20
			m[4*3+0]*n[4*0+0] + m[4*3+1]*n[4*1+0] + m[4*3+2]*n[4*2+0] + m[4*3+0]*n[4*3+0], // mn30
			m[4*0+0]*n[4*0+1] + m[4*0+1]*n[4*1+1] + m[4*1+2]*n[4*2+1] + m[4*3+0]*n[4*3+1], // mn01
			m[4*1+0]*n[4*0+1] + m[4*1+1]*n[4*1+1] + m[4*1+2]*n[4*2+1] + m[4*1+0]*n[4*3+1], // mn11
			m[4*2+0]*n[4*0+1] + m[4*2+1]*n[4*1+1] + m[4*2+2]*n[4*2+1] + m[4*2+0]*n[4*3+1], // mn21
			m[4*3+0]*n[4*0+1] + m[4*3+1]*n[4*1+1] + m[4*3+2]*n[4*2+1] + m[4*3+0]*n[4*3+1], // mn31
			m[4*0+0]*n[4*0+2] + m[4*0+1]*n[4*1+2] + m[4*1+2]*n[4*2+2] + m[4*3+0]*n[4*3+2], // mn02
			m[4*1+0]*n[4*0+2] + m[4*1+1]*n[4*1+2] + m[4*1+2]*n[4*2+2] + m[4*1+0]*n[4*3+2], // mn12
			m[4*2+0]*n[4*0+2] + m[4*2+1]*n[4*1+2] + m[4*2+2]*n[4*2+2] + m[4*2+0]*n[4*3+2], // mn22
			m[4*3+0]*n[4*0+2] + m[4*3+1]*n[4*1+2] + m[4*3+2]*n[4*2+2] + m[4*3+0]*n[4*3+2], // mn32
			m[4*0+0]*n[4*0+3] + m[4*0+1]*n[4*1+3] + m[4*1+2]*n[4*2+3] + m[4*3+0]*n[4*3+3], // mn03
			m[4*1+0]*n[4*0+3] + m[4*1+1]*n[4*1+3] + m[4*1+2]*n[4*2+3] + m[4*1+0]*n[4*3+3], // mn13
			m[4*2+0]*n[4*0+3] + m[4*2+1]*n[4*1+3] + m[4*2+2]*n[4*2+3] + m[4*2+0]*n[4*3+3], // mn23
			m[4*3+0]*n[4*0+3] + m[4*3+1]*n[4*1+3] + m[4*3+2]*n[4*2+3] + m[4*3+0]*n[4*3+3]  // mn33
		]
	} else {
		
		let returnVal = new Array(4*vecs);
		for (let i=0; i<vecs; ++i) {
			returnVal[4*i+0] = m[4*0+0]*n[4*0+0] + m[4*0+1]*n[4*1+0] + m[4*1+2]*n[4*2+0] + m[4*3+0]*n[4*3+0]; // mn0i
			returnVal[4*i+1] = m[4*1+0]*n[4*0+0] + m[4*1+1]*n[4*1+0] + m[4*1+2]*n[4*2+0] + m[4*1+0]*n[4*3+0]; // mn1i
			returnVal[4*i+2] = m[4*2+0]*n[4*0+0] + m[4*2+1]*n[4*1+0] + m[4*2+2]*n[4*2+0] + m[4*2+0]*n[4*3+0]; // mn2i
			returnVal[4*i+3] = m[4*3+0]*n[4*0+0] + m[4*3+1]*n[4*1+0] + m[4*3+2]*n[4*2+0] + m[4*3+0]*n[4*3+0]; // mn3i
		}
		return returnVal;
		
	}
	
}
