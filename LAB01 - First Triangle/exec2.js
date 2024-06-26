
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    // Four Vertices
    
    var vertices = [
        vec2( -0.9,0.9),
        vec2(  -0.9,0.8 ),
        vec2(  -0.8, 0.9 ),
        vec2( -0.6, 0.9),
        vec2(-0.4,0.8),
        vec2(-0.6,0.8),
        vec2(-0.4,0.9),
        vec2(-0.2,0.9),
        vec2(0,0.9),
        vec2(0,0.7),
        vec2(-0.2,0.7),
        vec2(0.2,0.9),
        vec2(0.4,0.9),
        vec2(0.4,0.7),
        vec2(0.2,0.7),
        vec2(-0.9,0),
        vec2(-0.7,0),
        vec2(-0.9,-0.3),
        vec2(-0.5,0),
        vec2(-0.3,0),
        vec2(-0.5,-0.3),
        vec2(-0.3,-0.3),
        vec2(-0.4,-0.5),
        vec2(0.1,-0.2),
        vec2(0,0),
        vec2(0.2,0),
        vec2(0.4,-0.2),
        vec2(0.1,-0.4),
        vec2(-0.2,-0.2)
    ];

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
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, 3 );
    gl.drawArrays(gl.LINES,3,4);
    gl.drawArrays(gl.LINE_STRIP,7,4);
    gl.drawArrays(gl.LINE_LOOP,11,4);
    gl.drawArrays(gl.TRIANGLES,15,3);
    gl.drawArrays(gl.TRIANGLE_STRIP,18,5);
    gl.drawArrays(gl.TRIANGLE_FAN,23,6);
}
