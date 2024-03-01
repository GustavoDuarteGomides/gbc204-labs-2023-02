"use strict";

var canvas;
var gl;

var NumVertices  = 36;

var escala = 0.2; //escala inicial

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
//var theta = [ 30, 30, 30 ];
var theta = [ 0, 0, 0 ];

var thetaLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    cria_seta(escala);
    //colorCube();
    //colorPiramide();

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

    thetaLoc = gl.getUniformLocation(program, "theta");

    //event listeners for buttons
    document.getElementById( "Dobrar" ).onclick = function () {
        //dobrar tamanho
        //Escala: P’’ = 2(sx1*sx2, sy1*sy2)P
        escala *= 2.0;
        // Limpa os pontos e cores antigos
        points = [];
        colors = [];

        // Recalcula os pontos e cores com a nova escala
        cria_seta(escala);

        // Atualiza o buffer dos pontos
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    };
    document.getElementById( "Dividir" ).onclick = function () {
        //Dividir tamanho pela metade
        //Escala: P’’ = (1/2) (sx1*sx2, sy1*sy2)P
        escala *= 0.5;
        // Limpa os pontos e cores antigos
        points = [];
        colors = [];

        // Recalcula os pontos e cores com a nova escala
        cria_seta(escala);

        // Atualiza o buffer dos pontos
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    };

    render();
}

function cria_seta(esc)
{
    quad( 1, 0, 3, 2 , esc);
    quad( 3, 0, 4, 7 , esc);
    quad( 6, 5, 1, 2 , esc);
    quad( 4, 5, 6, 7 , esc);
    quad( 5, 4, 0, 1 , esc);
    quad( 8, 9, 11,10, esc);

    tri(0,1,4,0, esc)
    tri(1,3,4,1, esc)
    tri(3,2,4,2, esc)
    tri(2,0,4,3, esc)


}


function colorPiramide(esc)
{
    quad( 0, 3, 7, 4 , esc);
    tri(0, 1, 4, 1, esc);
    tri(1, 3, 4, 2, esc);
    tri(2, 3, 4, 3, esc);
    tri(2, 0, 4, 4, esc);
}

function colorCube(esc)
{
    quad( 1, 0, 3, 2 , esc);
    quad( 2, 3, 7, 6 , esc);
    quad( 3, 0, 4, 7 , esc);
    quad( 6, 5, 1, 2 , esc);
    quad( 4, 5, 6, 7 , esc);
    quad( 5, 4, 0, 1 , esc);
    
}

function quad(a, b, c, d, escala)
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

function tri(a ,b ,c ,color, escala){
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


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[0] += 2.0;
    theta[1] += 2.0;

    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays( gl.TRIANGLES, 0, points.length );

    requestAnimFrame( render );
}