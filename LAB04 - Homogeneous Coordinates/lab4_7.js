"use strict";

var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
//var theta = [ 30, 30, 30 ];
var theta = [ 0, 0, 0 ];
var scale = [1.0, 1.0, 1.0];
var transform = [0.0, 0.0, 0.0];

var thetaLoc;
var scaleLoc;
var transformLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    cria_seta();
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
    scaleLoc = gl.getUniformLocation(program, "scale");
    transformLoc = gl.getUniformLocation(program, "transform");

    
    document.getElementById("RandomRot").onclick = function() {
        theta[0] += Math.floor(Math.random()*360);
        theta[1] += Math.floor(Math.random()*360);
        theta[2] += Math.floor(Math.random()*360);
    };

    document.getElementById("ScaleUp").onclick = function(){
        scale[0] = scale[0] * 2;
        scale[1] = scale[1] * 2;
        scale[2] = scale[2] * 2;
    };

    document.getElementById("ScaleDown").onclick = function(){
        scale[0] = scale[0] / 2;
        scale[1] = scale[1] / 2;
        scale[2] = scale[2] / 2;
    };

    window.addEventListener("keydown", function(event){
        switch(event.key){
            case "w":
                transform[1] += 0.1;
                break;
            case "s":
                transform[1] -= 0.1;
                break;
            case "a":
                transform[0] -= 0.1;
                break;
            case "d":
                transform[0] += 0.1;
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
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
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

    gl.uniform3fv(thetaLoc, theta);
    gl.uniform3fv(scaleLoc, scale);
    gl.uniform3fv(transformLoc, transform);

    gl.drawArrays( gl.TRIANGLES, 0, points.length );

    requestAnimFrame( render );
}