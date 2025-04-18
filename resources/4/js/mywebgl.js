"use strict";

const RESOURCES_LIB = "/resources/4"

const KEY_UP = 0
const KEY_DOWN = 1
const KEY_LEFT = 2
const KEY_RIGHT = 3
const KEY_W = 4
const KEY_A = 5
const KEY_S = 6
const KEY_D = 7
const progStart = Date.now();

/**
 * @type {boolean[]}
 */
const keysPressed = [false, false, false, false, false, false, false, false]
const cubeVerts = [
	
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
		
		0,0,1, // orange
		0,0,0, // yellow
		0,1,1, // purple
		1,1,1, // dblue
		0,0,0, // lgreen
		1,0,0, // dgreen
		0,1,0, // pink
		1,1,0, // lblue
		*/
	0,1,1, // purple
	0,0,1, // orange
	0,0,1, // orange
	1,1,1, // dblue
	1,1,1, // dblue
	0,1,1, // purple
	
	0,0,1, // orange
	1,0,1, // yellow
	1,0,1, // yellow
	1,1,1, // dblue
	1,1,1, // dblue
	0,0,1, // orange
	
	1,1,1, // dblue
	1,0,1, // yellow
	1,0,1, // yellow
	1,1,0, // lblue
	1,1,0, // lblue
	1,1,1, // dblue
	
	1,1,0, // lblue
	1,0,1, // yellow
	1,0,1, // yellow
	1,0,0, // dgreen
	1,0,0, // dgreen
	1,1,0, // lblue
	
	1,0,0, // dgreen
	1,0,1, // yellow
	1,0,1, // yellow
	0,0,0, // lgreen
	0,0,0, // lgreen
	1,0,0, // dgreen
	
	0,0,0, // lgreen
	1,0,1, // yellow
	1,0,1, // yellow
	0,0,1, // orange
	0,0,1, // orange
	0,0,0, // lgreen
	
	0,0,1, // orange
	0,1,1, // purple
	0,1,1, // purple
	0,0,0, // lgreen
	0,0,0, // lgreen
	0,0,1, // orange
	
	0,0,0, // lgreen
	0,1,1, // purple
	0,1,1, // purple
	0,1,0, // pink
	0,1,0, // pink
	0,0,0, // lgreen
	
	0,1,0, // pink
	1,1,0, // lblue
	1,1,0, // lblue
	0,0,0, // lgreen
	0,0,0, // lgreen
	0,1,0, // pink
	
	0,0,0, // lgreen
	1,1,0, // lblue
	1,1,0, // lblue
	1,0,0, // dgreen
	1,0,0, // dgreen
	0,0,0, // lgreen
	
	1,1,0, // lblue
	0,1,0, // pink
	0,1,0, // pink
	0,1,1, // purple
	0,1,1, // purple
	1,1,0, // lblue
	
	0,1,1, // purple
	1,1,1, // dblue
	1,1,1, // dblue
	1,1,0, // lblue
	1,1,0, // lblue
	0,1,1, // purple
	
]
const cubeColours = [
	
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
	
]

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
	const viewLocation = gl.getUniformLocation(program, "u_view");
	const modelLocation = gl.getUniformLocation(program, "u_model");
	const colourLocation = gl.getAttribLocation(program, "a_color");
	
	// Load the shapes and colours into the GPU
	const unitColoursBuffer = gl.createBuffer();
	const unitCubeLineColours = new Uint8Array(cubeColours);
	gl.bindBuffer(gl.ARRAY_BUFFER, unitColoursBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, unitCubeLineColours, gl.STATIC_DRAW);
	
	const dz = 0.0
	const q = 0.25;
	
	const scaler = [q,0,0,0,0,q,0,0,0,0,q,0,0,0,0,1]
	
	const cubeLocation = gl.getAttribLocation(program, "a_position");
	const cubeBuffer = gl.createBuffer();
	const cubeLines = new Float32Array(cubeVerts);
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, cubeLines, gl.STATIC_DRAW);
	
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
		
		// Compute and set the observer's camera transformation
		const negx = new Matrix4([-1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]); // Negate the X coordinate to make the axes right handed.
		var perspectiveTransform = new Matrix4()
		.translate(-playerPosition[0],-playerPosition[1],-playerPosition[2])
		.multiply(negx);
		gl.uniformMatrix4fv(viewLocation, false, new Float32Array(perspectiveTransform.arr));
		
		// Compute the model transformations (the cube vertexes and colours are reused).
		const cube1Model = new Matrix4()
			.rotate((now - progStart) /4000 % (2 * Math.PI), Math.sqrt(2)/2, Math.sqrt(2)/2, 0)
			.scale(0.25, 0.25, 0.25)
			.translate(0.25, 0.25, 0.25);
			
		const cube2Model = new Matrix4()
			.rotate((now - progStart) /4500 % (2 * Math.PI), 0, 1, 0)
			.scale(0.35, 0.35, 0.35)
			.translate(-0.35, -0.45, -0.15);
			
		// Set up the loading of the (filled) vertex & colour buffers
		gl.bindBuffer(gl.ARRAY_BUFFER, unitColoursBuffer);
		gl.enableVertexAttribArray(colourLocation);
		gl.vertexAttribPointer(colourLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0); // 4-vectors of 8-bit unsigned integers hich should be normalised to range 0-1
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
		gl.enableVertexAttribArray(cubeLocation);
		gl.vertexAttribPointer(cubeLocation, 3, gl.FLOAT, false, 0, 0); // 3-vectors of floats
		
		// Draw the first cube
		gl.uniformMatrix4fv(modelLocation, false, new Float32Array(cube1Model.arr));
		gl.drawArrays(gl.LINES,	0,	6*2*6);
		
		// Draw the second cube
		gl.uniformMatrix4fv(modelLocation, false, new Float32Array(cube2Model.arr));
		gl.drawArrays(gl.LINES,	0,	6*2*6);
		
	}
	
	return repaint;
}

setInterval(update, 300);
setInterval(repaint, 100);


class Matrix4 {
	arr;
	
	constructor(arr = null) {
		if (arr === null) {
			this.arr = [
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			];
		} else {
			this.arr = arr;
		}
	}
	
	translate(x,y,z) {
		this.arr = matmul4([
			1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			x,y,z,1], this.arr);
		return this;
	}
	
	scale(x,y,z) {
		this.arr = matmul4([
			x,0,0,0,
			0,y,0,0,
			0,0,z,0,
			0,0,0,1
		], this.arr);
		return this;
	}
	
	rotate(theta, ux, uy, uz) {
		// See https://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle
		let c = Math.cos(theta);
		let s = Math.sin(theta);
		let oneMinusC = 1 - c;
		
		let r00 = ux * ux * oneMinusC + c;
		let r10 = ux * uy * oneMinusC + uz * s;
		let r20 = ux * uz * oneMinusC - uy * s;
		
		let r01 = uy * ux * oneMinusC - uz * s;
		let r11 = uy * uy * oneMinusC + c;
		let r21 = uy * uz * oneMinusC + ux * s;
		
		let r02 = uz * ux * oneMinusC + uy * s;
		let r12 = uz * uy * oneMinusC - ux * s;
		let r22 = uz * uz * oneMinusC + c;
		
		this.arr = matmul4([
			r00, r10, r20, 0,
			r01, r11, r21, 0,
			r02, r12, r22, 0,
			0,   0,   0,   1
		], this.arr);
		
		return this;
		
	}
	
	multiply(m) {
		if (m instanceof Matrix4) {
			this.arr = matmul4(m.arr, this.arr);
		} else {
			this.arr = matmul4(m, this.arr);
		}1
		return this;
	}
}

function matmul4(m, n) {
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
	.
	
	Mathematically, the ijth component of the result matrix is the ith row of the first matrix dot the jth column of the second.
		mn23 = m's r2 dot n's c3
		= m2i ni3 (Einstein summation convention)
		= m[4*i+2]n[4*3+i] (Einstein summation convention)
	
	This does of course generalise to matrices n with more columns ci; n can be an arbitrarily large collection of 4-vectors. 
	Our code uses 4-vector arrays of floats to represent shape vertices. Translating a shape S with matrix T is:
		T * S
	.
	
	Translations can be chained; applying transformation T1 then T2 to shape S is
		T2 * (T1 * S)
		= (T2 * T1) * S
	due to the associativity of matrix multiplication.
	
	*/
	const vecs = n.length / 4;
	if (vecs === 4) {
		return [
			m[4*0+0]*n[4*0+0] + m[4*1+0]*n[4*0+1] + m[4*2+0]*n[4*0+2] + m[4*3+0]*n[4*0+3], // mn00
			m[4*0+1]*n[4*0+0] + m[4*1+1]*n[4*0+1] + m[4*2+1]*n[4*0+2] + m[4*3+1]*n[4*0+3], // mn10
			m[4*0+2]*n[4*0+0] + m[4*1+2]*n[4*0+1] + m[4*2+2]*n[4*0+2] + m[4*3+2]*n[4*0+3], // mn20
			m[4*0+3]*n[4*0+0] + m[4*1+3]*n[4*0+1] + m[4*2+3]*n[4*0+2] + m[4*3+3]*n[4*0+3], // mn30
			m[4*0+0]*n[4*1+0] + m[4*1+0]*n[4*1+1] + m[4*2+0]*n[4*1+2] + m[4*3+0]*n[4*1+3], // mn01
			m[4*0+1]*n[4*1+0] + m[4*1+1]*n[4*1+1] + m[4*2+1]*n[4*1+2] + m[4*3+1]*n[4*1+3], // mn11
			m[4*0+2]*n[4*1+0] + m[4*1+2]*n[4*1+1] + m[4*2+2]*n[4*1+2] + m[4*3+2]*n[4*1+3], // mn21
			m[4*0+3]*n[4*1+0] + m[4*1+3]*n[4*1+1] + m[4*2+3]*n[4*1+2] + m[4*3+3]*n[4*1+3], // mn31
			m[4*0+0]*n[4*2+0] + m[4*1+0]*n[4*2+1] + m[4*2+0]*n[4*2+2] + m[4*3+0]*n[4*2+3], // mn02
			m[4*0+1]*n[4*2+0] + m[4*1+1]*n[4*2+1] + m[4*2+1]*n[4*2+2] + m[4*3+1]*n[4*2+3], // mn12
			m[4*0+2]*n[4*2+0] + m[4*1+2]*n[4*2+1] + m[4*2+2]*n[4*2+2] + m[4*3+2]*n[4*2+3], // mn22
			m[4*0+3]*n[4*2+0] + m[4*1+3]*n[4*2+1] + m[4*2+3]*n[4*2+2] + m[4*3+3]*n[4*2+3], // mn32
			m[4*0+0]*n[4*3+0] + m[4*1+0]*n[4*3+1] + m[4*2+0]*n[4*3+2] + m[4*3+0]*n[4*3+3], // mn03
			m[4*0+1]*n[4*3+0] + m[4*1+1]*n[4*3+1] + m[4*2+1]*n[4*3+2] + m[4*3+1]*n[4*3+3], // mn13
			m[4*0+2]*n[4*3+0] + m[4*1+2]*n[4*3+1] + m[4*2+2]*n[4*3+2] + m[4*3+2]*n[4*3+3], // mn23
			m[4*0+3]*n[4*3+0] + m[4*1+3]*n[4*3+1] + m[4*2+3]*n[4*3+2] + m[4*3+3]*n[4*3+3]  // mn33
		]
	} else {
		
		let returnVal = new Array(4*vecs);
		for (let i=0; i<vecs; ++i) {
			returnVal[4*i+0] = m[4*0+0]*n[4*i+0] + m[4*1+0]*n[4*i+1] + m[4*2+0]*n[4*i+2] + m[4*3+0]*n[4*i+3]; // mn0i
			returnVal[4*i+1] = m[4*0+1]*n[4*i+0] + m[4*1+1]*n[4*i+1] + m[4*2+1]*n[4*i+2] + m[4*3+1]*n[4*i+3]; // mn1i
			returnVal[4*i+2] = m[4*0+2]*n[4*i+0] + m[4*1+2]*n[4*i+1] + m[4*2+2]*n[4*i+2] + m[4*3+2]*n[4*i+3]; // mn2i
			returnVal[4*i+3] = m[4*0+3]*n[4*i+0] + m[4*1+3]*n[4*i+1] + m[4*2+3]*n[4*i+2] + m[4*3+3]*n[4*i+3]; // mn3i
		}
		return returnVal;
		
	}
	
}


function printMatrix(m) {
	console.log([m[4*0+0],m[4*0+1],m[4*0+2],m[4*0+3]]);
	console.log([m[4*1+0],m[4*1+1],m[4*1+2],m[4*1+3]]);
	console.log([m[4*2+0],m[4*2+1],m[4*2+2],m[4*2+3]]);
	console.log([m[4*3+0],m[4*3+1],m[4*3+2],m[4*3+3]]);
	console.log("");
}

function debugMatmul() {
	
	function debugMatmulElem(i,j) {
		console.log([m[4*0+i], m[4*1+i], m[4*2+i], m[4*3+i]]); // With j = 0, need m[2,6,10,14]
		console.log([n[4*j+0], n[4*j+1], n[4*j+2], n[4*j+3]]);
		console.log(m[4*j+0]*n[4*0+i] + m[4*j+1]*n[4*1+i] + m[4*j+2]*n[4*2+i] + m[4*j+3]*n[4*3+i]);
	}
	const swapxz = [
		0,0,1,0,
		0,1,0,0,
		1,0,0,0,
		0,0,0,1
	];
	const m1 = [
		1,2,3,0,
		4,5,6,0,
		7,8,9,0,
		1,1,1,1
	];
	const m = swapxz;
	const n = m1;
	
	printMatrix(m);
	console.log(" * ");
	printMatrix(n);
	console.log(" = ");
	printMatrix(matmul4(m, n));
	
}