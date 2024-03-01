"use strict";

var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var colors = [];

var velocidade = 100;
var direction = 0;
var posicaoSeta = vec2(0, 0);


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    cria_seta();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

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
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    //Movimentação via teclado (wasd)
    window.addEventListener("keydown", function(event) {
        switch(event.key) {
            case 'w':
                posicaoSeta[1] += 0.1;
                break;
            case 's':
                posicaoSeta[1] -= 0.1;
                break;
            case 'a':
                posicaoSeta[0] -= 0.1;
                break;
            case 'd':
                posicaoSeta[0] += 0.1;
                break;
        }
    });

    render();
}

function cria_seta()
{
    quad( 1, 0, 3, 2 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
    quad( 8, 9, 11,10);

    tri(0,1,4,0)
    tri(1,3,4,1)
    tri(3,2,4,2)
    tri(2,0,4,3)


}


function colorPiramide()
{
    quad( 0, 3, 7, 4 );
    tri(0, 1, 4, 1);
    tri(1, 3, 4, 2);
    tri(2, 3, 4, 3);
    tri(2, 0, 4, 4);
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
    
}

var escala = 0.2
function quad(a, b, c, d)
{
    var vertices = [
        //paralelepipedo
        vec4( -0.6*escala, -0.2*escala,  0.3*escala, 1.0 ),  //0   
        vec4( -0.6*escala,  0.2*escala,  0.3*escala, 1.0 ),  //1
        vec4(  0.6*escala,  0.2*escala,  0.3*escala, 1.0 ),  //2 
        vec4(  0.6*escala, -0.2*escala,  0.3*escala, 1.0 ),  //3
        vec4( -0.6*escala, -0.2*escala, -0.3*escala, 1.0 ),  //4
        vec4( -0.6*escala,  0.2*escala, -0.3*escala, 1.0 ),  //5
        vec4(  0.6*escala,  0.2*escala, -0.3*escala, 1.0 ),  //6
        vec4(  0.6*escala, -0.2*escala, -0.3*escala, 1.0 ),  //7

        //piramide
        vec4(  0.6*escala,  0.6*escala,  0.6*escala, 1.0 ),  //8
        vec4(  0.6*escala, -0.6*escala,  0.6*escala, 1.0 ),
        vec4(  0.6*escala,  0.6*escala, -0.6*escala, 1.0 ),  
        vec4(  0.6*escala, -0.6*escala, -0.6*escala, 1.0 )
    ];

    var vertexColors = [
        [ 0.27, 0.15, 0.2, 1.0 ],  
        [ 0.57, 0.13, 0.3, 1.0 ],  
        [ 0.89, 0.52, 0.29, 1.0 ], 
        [ 0.91, 0.85, 0.34, 1.0 ],  
        [ 0.89, 1.0, 0.81, 1.0 ],  
        [ 0.89, 1.0, 1.0, 1.0 ],  
        [ 0.75, 0.35, 0.3, 0.8 ],
        [ 0.8, 0.8, 0.8, 1.0 ] 
    ];

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push(vertexColors[a%8]);

    }
}

function tri(a ,b ,c ,color){
    var vertices = [
        vec4(  0.6*escala,  0.6*escala,  0.6*escala, 1.0 ),  
        vec4(  0.6*escala, -0.6*escala,  0.6*escala, 1.0 ),
        vec4(  0.6*escala,  0.6*escala, -0.6*escala, 1.0 ),  
        vec4(  0.6*escala, -0.6*escala, -0.6*escala, 1.0 ),
        vec4(  1.2*escala,    0,           0,        1.0)
    ];

    var vertexColors = [
        [ 0.27, 0.15, 0.2, 1.0 ],  
        [ 0.57, 0.13, 0.3, 1.0 ],  
        [ 0.89, 0.52, 0.29, 1.0 ], 
        [ 0.91, 0.85, 0.34, 1.0 ],  
        [ 0.89, 1.0, 0.81, 1.0 ],  
        [ 0.89, 1.0, 1.0, 1.0 ],  
        [ 0.75, 0.35, 0.3, 0.8 ],
        [ 0.8, 0.8, 0.8, 1.0 ] 
    ];

    var indices = [ a, b, c];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push(vertexColors[color]);

    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Calcular as novas posições dos vértices com base na posição da seta
    var translatedPoints = [];
    for (var i = 0; i < points.length; i++) {
        translatedPoints.push(vec4(points[i][0] + posicaoSeta[0], points[i][1] + posicaoSeta[1], points[i][2], points[i][3]));
    }

    // Atualizar buffer
    gl.bufferData(gl.ARRAY_BUFFER, flatten(translatedPoints), gl.STATIC_DRAW);

    gl.drawArrays(gl.TRIANGLES, 0, points.length);

    setTimeout(function (){requestAnimFrame(render);}, velocidade);
}