const canvas = document.getElementById('rotate_canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}
//vértices
const vertexData = [
    0, 1, 0,    
    1, -1, 0,   
    -1, -1, 0,  
];
//cores por vértices
const colorData = [
    1, 0, 0,    // vermelho
    0, 1, 0,    // verde
    0, 0, 1,    // azul
];
/*========================cria os buffers==================================*/
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

/*========================cria os os shaders==================================*/

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;

uniform mat4 matrix;

void main() {
    vColor = color;
    gl_Position = matrix * vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;

varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor, 1);
}
`);
gl.compileShader(fragmentShader);
console.log(gl.getShaderInfoLog(fragmentShader));

//cria o programa principal e anexa os shaders

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

 /* ===========Associa os shaders aos buffers criados anteriormente============*/

 const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

// cria as matrizes para as transformações

const uniformLocations = {
    matrix: gl.getUniformLocation(program, `matrix`),
};

const matrix = mat4.create();



mat4.translate(matrix, matrix, [-.03, -.03, 0]);

// mat4.scale(matrix, matrix, [0.5, 0.5, 0.25]);


 var time_old = 0;
 var animate = function(time)  {
   var dt = time-time_old;//fator que controla a animação
   
   time_old = time;
   requestAnimationFrame(animate);
   gl.enable(gl.DEPTH_TEST);
   gl.depthFunc(gl.LEQUAL);
   gl.clearColor(0.5, 0.5, 0.5, 0.9);
   gl.clearDepth(1.0);
   gl.viewport(0.0, 0.0, canvas.width, canvas.height);
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  mat4.rotateZ(matrix, matrix, dt*0.002*Math.PI/2);
//    mat4.translate(matrix, matrix, [dt*0.002, 0, 0]);
  //  mat4.scale(matrix, matrix, [0.9, 0.9, 0.25]);
   
    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

animate(0);





















// /*=================Obtém o canvas=========================*/
// var canvas = document.getElementById('rotate_canvas');
// gl = canvas.getContext('experimental-webgl');

// /*===========Define os vértices da geometria==============*/

// var vertices = [ -1,-1,-1,
//                   1,-1,-1, 
//                   1, 1,-1 ];

// var colors = [ 1,1,1,
//                1,1,1, 
//                1,1,1 ];

// var indices = [ 0,1,2 ];

// //Cria e armazena os vértices no buffer
// var vertex_buffer = gl.createBuffer ();
// gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// //Cria e armazena as cores no buffer
// var color_buffer = gl.createBuffer ();
// gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);



// /*==========================Shaders=========================*/

// var vertCode = `
// precision mediump float;

// attribute vec3 position;
// attribute vec3 color;
// varying vec3 vColor;

// uniform mat4 matrix;

// void main() {
//     vColor = color;
//     gl_Position = matrix * vec4(position, 1);
// }
// `;

// var fragCode = `
// precision mediump float;

// varying vec3 vColor;

// void main() {
//     gl_FragColor = vec4(vColor, 1);
// }
// `;

// var vertShader = gl.createShader(gl.VERTEX_SHADER);
// gl.shaderSource(vertShader, vertCode);
// gl.compileShader(vertShader);

// var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
// gl.shaderSource(fragShader, fragCode);
// gl.compileShader(fragShader);

// var shaderProgram = gl.createProgram();
// gl.attachShader(shaderProgram, vertShader);
// gl.attachShader(shaderProgram, fragShader);
// gl.linkProgram(shaderProgram);

// /*===========associa os atributos ao vertex shader ============*/

// const positionLocation = gl.getAttribLocation(shaderProgram, `position`);
// gl.enableVertexAttribArray(positionLocation);
// gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
// gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

// const colorLocation = gl.getAttribLocation(shaderProgram, `color`);
// gl.enableVertexAttribArray(colorLocation);
// gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
// gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
// gl.useProgram(shaderProgram);

// const uniformLocations = {
//    matrix: gl.getUniformLocation(shaderProgram, `matrix`),
// };

// const matrix = mat4.create();

// mat4.translate(matrix, matrix, [.2, .5, 0]);

// mat4.scale(matrix, matrix, [0.25, 0.25, 0.25]);

// function animate() {
//    // gl.enable(gl.DEPTH_TEST);
//    // gl.depthFunc(gl.LEQUAL);
//    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
//    // gl.clearDepth(1.0);
//    // gl.viewport(0.0, 0.0, canvas.width, canvas.height);
//    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//    requestAnimationFrame(animate);
//    mat4.rotateZ(matrix, matrix, Math.PI/2 / 70);
//    mat4.translate(matrix, matrix, [.0, 0.05, 0]);
//    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
//    gl.drawArrays(gl.TRIANGLES, 0, 3);
// }

// animate();
// /*=================Desenha e faz a animação===========================*/

// // var time_old = 0;
// // var animate = function(time) {
// //    var dt = time-time_old;
// //    rotateZ(mov_matrix, dt*0.002);
// //    time_old = time;

// //    gl.enable(gl.DEPTH_TEST);
// //    gl.depthFunc(gl.LEQUAL);
// //    gl.clearColor(0.5, 0.5, 0.5, 0.9);
// //    gl.clearDepth(1.0);
// //    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
// //    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// //    gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
// //    gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
// //    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);

// //    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
// //    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
// //    window.requestAnimationFrame(animate);
// // }
// // animate(0);