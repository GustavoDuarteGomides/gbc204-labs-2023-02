"use strict";

var gl;
var points = [];
var colors = [];

var velocidade = 100;
var direction = 0;

// Variáveis para armazenar a posição atual de cada triângulo
var posTriangulo1 = 0;
var posTriangulo2 = 0;
var posTriangulo3 = 0;

window.onload = function init(){
    var canvas = document.getElementById( "gl-canvas" );
     gl = WebGLUtils.setupWebGL( canvas );    
     if ( !gl ) { alert( "WebGL isn't available" ); 
  
}        

//Frag shader: var Tx = 0.5; //diferença de posição (movimentação no eixo x)
//var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
//gl.uniform4f(u_Translation, Tx, 0, 0, 0.0);

gl.viewport( 0, 0, canvas.width, canvas.height );
gl.clearColor( 0.90, 0.85, 0.75, 1);  
gl.enable( gl.DEPTH_TEST ); 

var program = initShaders( gl, "vertex-shader", "fragment-shader" );
gl.useProgram( program ); 
           
var vertices = [
    //triângulo 1
    vec2(-1, -1), 
    vec2(-0.70,-0.40 ),
    vec2(-0.40, -1),
    //triângulo 2
    vec2(-0.30, -1),
    vec2(0, -0.40 ),
    vec2(0.30, -1),  
    //triângulo 3
    vec2(0.40, -1),
    vec2( 0.70, -0.40 ),
    vec2( 1, -1)
]; 

var cores = [
vec4(0.0, 0.7, 0.75, 1.0),
vec4(0.7, 0.0, 0.75, 1.0),
vec4(0.7, 0.7, 0.0, 1.0)
]; 

//são criados triangulos extras para dar a impressão de circularidade
//3 "triangulos 1"
triangle(vertices[0], vertices[1], vertices[2], cores[0]);
triangle(vertices[0], vertices[1], vertices[2], cores[0]);
triangle(vertices[0], vertices[1], vertices[2], cores[0]);

//3 "triangulos 2"
triangle(vertices[3], vertices[4], vertices[5], cores[1]);
triangle(vertices[3], vertices[4], vertices[5], cores[1]);
triangle(vertices[3], vertices[4], vertices[5], cores[1]);

//3 "triangulos 3"
triangle(vertices[6], vertices[7], vertices[8], cores[2]);
triangle(vertices[6], vertices[7], vertices[8], cores[2]);
triangle(vertices[6], vertices[7], vertices[8], cores[2]);


var bufferId = gl.createBuffer();
gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );    

var cBuffer = gl.createBuffer();
gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

var vColor = gl.getAttribLocation( program, "vColor" );
gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
gl.enableVertexAttribArray( vColor );

var vBuffer = gl.createBuffer();
gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

var vPosition = gl.getAttribLocation( program, "vPosition" );
gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
gl.enableVertexAttribArray( vPosition );

// Escolha do triângulo
document.getElementById("Controls" ).onclick = function(event) {
    switch( event.target.index ) {
        case 0: //Triângulo 1
            direction = 0;
            break;
        case 1: //Triângulo 2
            direction = 1;
            break;
        case 2: //Triângulo 3
            direction = 2;
            break;
   }
};

window.onkeydown = function(event) {
    var key = String.fromCharCode(event.keyCode);
    switch(key) {
        case 0: //Triângulo 1
            direction = 0;
            break;
        case 1: //Triângulo 2
            direction = 1;
            break;
        case 2: //Triângulo 3
            direction = 2;
            break;
    }
};

// Mover para direita
document.getElementById("Right").onclick = function () {
    moveTriangle(1);
};
// Mover para esquerda
document.getElementById("Left").onclick = function () {
    moveTriangle(-1);
};

render();
};

function moveTriangle(dir) {
    switch (direction) {
        case 0:
            posTriangulo1 = (posTriangulo1+ dir*0.1)%2;

            break;
        case 1:
            posTriangulo2 = (posTriangulo2+ dir*0.1)%2;
            break;
        case 2:
            posTriangulo3 = (posTriangulo3+ dir*0.1)%2;
            break;
    }
}

function triangle( a, b, c, color ){

    colors.push(color);
    points.push( a );
    colors.push(color);
    points.push( b );
    colors.push(color);
    points.push( c );
}

function render() {
gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

// Atualizar a posição dos triângulos
var valor = -2
var vertices = [
    //triângulo 1
    vec2(-1 + posTriangulo1, -1), 
    vec2(-0.70 + posTriangulo1,-0.40 ),
    vec2(-0.40 + posTriangulo1, -1),
    //triângulo extra 1
    vec2(valor-1 + posTriangulo1, -1), 
    vec2(valor-0.70 + posTriangulo1,-0.40 ),
    vec2(valor-0.40 + posTriangulo1, -1),
    //triângulo extra 1.1
    vec2(-valor-1 + posTriangulo1, -1), 
    vec2(-valor-0.70 + posTriangulo1,-0.40 ),
    vec2(-valor-0.40 + posTriangulo1, -1),


    //triângulo 2
    vec2(-0.30 + posTriangulo2, -1),
    vec2(0 + posTriangulo2, -0.40 ),
    vec2(0.30 + posTriangulo2, -1),  
    //triângulo extra 2
    vec2(valor-0.30 + posTriangulo2, -1),
    vec2(valor+0 + posTriangulo2, -0.40 ),
    vec2(valor+0.30 + posTriangulo2, -1),  
    //triângulo extra 2.1
    vec2(-valor-0.30 + posTriangulo2, -1),
    vec2(-valor+0 + posTriangulo2, -0.40 ),
    vec2(-valor+0.30 + posTriangulo2, -1),  
    
    //triângulo 3
    vec2(0.40 + posTriangulo3, -1),
    vec2( 0.70 + posTriangulo3, -0.40 ),
    vec2( 1 + posTriangulo3, -1),
    //triângulo extra 3
    vec2(valor+0.40 + posTriangulo3, -1),
    vec2(valor+0.70 + posTriangulo3, -0.40 ),
    vec2(valor+1 + posTriangulo3, -1),
    //triângulo extra 3.1
    vec2(-valor+0.40 + posTriangulo3, -1),
    vec2(-valor+0.70 + posTriangulo3, -0.40 ),
    vec2(-valor+1 + posTriangulo3, -1),
    
];


gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

gl.drawArrays( gl.TRIANGLES, 0, points.length);
setTimeout(
    function (){requestAnimFrame(render);}, velocidade
);
}
