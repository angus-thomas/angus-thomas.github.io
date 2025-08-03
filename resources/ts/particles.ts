const canvas = document.getElementById("particlesCanvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl")!;
gl.getExtension("OES_texture_float");

const texSize = 10;
const numParticles = texSize * texSize;

// ===== Helper functions =====
function toFloat32TextureArray(vec3s: Float32Array): Float32Array {
	const out = new Float32Array(numParticles * 4);
	for (let i = 0; i < numParticles; i++) {
		out[i * 4 + 0] = vec3s[i * 3 + 0];
		out[i * 4 + 1] = vec3s[i * 3 + 1];
		out[i * 4 + 2] = vec3s[i * 3 + 2];
		out[i * 4 + 3] = 0.0;
	}
	return out;
}

function createDataTexture(data: Float32Array): WebGLTexture {
	const tex = gl.createTexture()!;
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.FLOAT, data);
	return tex;
}

function createFramebuffer(texture: WebGLTexture): WebGLFramebuffer {
	const fb = gl.createFramebuffer()!;
	gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
	return fb;
}

async function createProgramFromSources(gl: WebGLRenderingContext, vertSource: string, fragSource: string) {
	
	const RESOURCES_LIB = "/resources/7"
	
	let vertexShaderResponse = await fetch(RESOURCES_LIB + "/js/particles/" + vertSource);
	let vertexShaderSource = await vertexShaderResponse.text();
	let vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
	gl.shaderSource(vertexShader, vertexShaderSource);
	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		throw Error("Error compiling vertex shader: " + gl.getShaderInfoLog(vertexShader));
	}
	
	let fragmentShaderResponse = await fetch(RESOURCES_LIB + "/js/particles/" + fragSource);
	let fragmentShaderSource = await fragmentShaderResponse.text();
	let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
	gl.shaderSource(fragmentShader, fragmentShaderSource);
	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		throw Error("Error compiling fragment shader:" + gl.getShaderInfoLog(fragmentShader));
	}
	
	// Link the two shaders into a program
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		gl.deleteProgram(program);
		throw Error("Error compiling program." + gl.getProgramInfoLog(program))
	}
	
	return program;
	
}


// ===== Initial data =====


async function main() {
	
	const initialPositions = new Float32Array(numParticles * 3).map(() => Math.random() * 2 - 1);
	const initialVelocities = new Float32Array(numParticles * 3).map(() => (Math.random() - 0.5) * 0.01);

	let posTexA = createDataTexture(toFloat32TextureArray(initialPositions));
	let posTexB = createDataTexture(toFloat32TextureArray(initialPositions));
	let velTexA = createDataTexture(toFloat32TextureArray(initialVelocities));
	let velTexB = createDataTexture(toFloat32TextureArray(initialVelocities));

	let posFB_A = createFramebuffer(posTexA);
	let posFB_B = createFramebuffer(posTexB);
	let velFB_A = createFramebuffer(velTexA);
	let velFB_B = createFramebuffer(velTexB);

	// ===== Fullscreen quad =====
	const quadVerts = new Float32Array([
		-1, -1, 1, -1, -1, 1,
		-1, 1, 1, -1, 1, 1
	]);
	const quadBuffer = gl.createBuffer()!;
	gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);

	// ===== Particle indices for render shader =====
	const indices = new Float32Array(numParticles);
	for (let i = 0; i < numParticles; i++) indices[i] = i;
	const indexBuffer = gl.createBuffer()!;
	gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW);

	// ===== Shader programs =====
	// (Assume `createProgramFromSources(gl, vsSrc, fsSrc)` exists)
	const velocityUpdateProgram = await createProgramFromSources(gl, "passThrough.vert", "updateVelocity.frag");
	const positionUpdateProgram = await createProgramFromSources(gl, "passThrough.vert", "updatePosition.frag");
	const renderProgram = await createProgramFromSources(gl, "render.vert", "render.frag");

	// ===== Render loop =====
	let time = 0;
	function update() {
		time += 0.016;

		// --- Velocity Update ---
		gl.useProgram(velocityUpdateProgram);
		gl.bindFramebuffer(gl.FRAMEBUFFER, velFB_B);
		gl.viewport(0, 0, texSize, texSize);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, posTexA);
		gl.uniform1i(gl.getUniformLocation(velocityUpdateProgram, "u_positionTex"), 0);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, velTexA);
		gl.uniform1i(gl.getUniformLocation(velocityUpdateProgram, "u_velocityTex"), 1);

		gl.uniform1f(gl.getUniformLocation(velocityUpdateProgram, "u_deltaTime"), 0.016);

		gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, 6);

		// --- Position Update ---
		gl.useProgram(positionUpdateProgram);
		gl.bindFramebuffer(gl.FRAMEBUFFER, posFB_B);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, posTexA);
		gl.uniform1i(gl.getUniformLocation(positionUpdateProgram, "u_positionTex"), 0);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, velTexB);
		gl.uniform1i(gl.getUniformLocation(positionUpdateProgram, "u_velocityTex"), 1);

		gl.uniform1f(gl.getUniformLocation(positionUpdateProgram, "u_deltaTime"), 0.016);
		gl.drawArrays(gl.TRIANGLES, 0, 6);

		// --- Render Particles ---
		gl.useProgram(renderProgram);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, posTexB);
		gl.uniform1i(gl.getUniformLocation(renderProgram, "u_positionTex"), 0);
		gl.uniform1f(gl.getUniformLocation(renderProgram, "u_texSize"), texSize);

		gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer);
		const aIndexLoc = gl.getAttribLocation(renderProgram, "a_index");
		gl.enableVertexAttribArray(aIndexLoc);
		gl.vertexAttribPointer(aIndexLoc, 1, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.POINTS, 0, numParticles);

		// --- Ping-pong ---
		[posTexA, posTexB] = [posTexB, posTexA];
		[velTexA, velTexB] = [velTexB, velTexA];
		[posFB_A, posFB_B] = [posFB_B, posFB_A];
		[velFB_A, velFB_B] = [velFB_B, velFB_A];

		requestAnimationFrame(update);
	}

	update();
	
}

main();