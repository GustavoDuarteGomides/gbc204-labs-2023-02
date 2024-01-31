"use strict";

var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 5;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2( -1, 0 ),
        vec2(  1, 0 ),
    ];

    //Adicionando os pontos iniciais de cada valor
    points.push(vertices[0]);
    points.push(vertices[1]);
    divideLine(vertices[0],vertices[1],1,NumTimesToSubdivide);
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

//Dividindo a linha como instruido
function divideLine(a,b,y,count){
    if(count > 0){
        //Achando os dois pontos que dividem o segmento AB em 3 partes
        var ab1 = mix(a,b,(1/3));
        var ab2 = mix(a,b,(2/3));

        //Achando o ponto central de AB
        var c = mix(a,b,0.5);
        //ajustando o valor de x de c
        c[0] -= (b[1]-a[1])/3 ** y;
        //ajustando o valor de y de c
        c[1] += (b[0]-a[0])/3 ** y;

        //Inserindo AB1, AB2 e C nas posições adequadas do array points
        points.splice(points.indexOf(b),0,ab1);
        points.splice(points.indexOf(b),0,c);
        points.splice(points.indexOf(b),0,ab2);

        --count;

        //Continuando a contrução do fractal recursivamente
        divideLine(a,ab1,y,count);
        divideLine(ab1,c,y,count);
        divideLine(c,ab2,y,count);
        divideLine(ab2,b,y,count);
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINE_STRIP, 0, points.length );
}
