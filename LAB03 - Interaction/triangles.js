
var gl;
var triangle = 0;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    // Four Vertices
    
    var vertices = [
        vec2( -1, -1 ),
        vec2(  -0.77, 1 ),
        vec2(  -0.44, -1 ),
        vec2(  -0.44, -1 ),
        vec2( -0.11, 1 ),
        vec2(  0.22, -1 ),
        vec2(  0.22, -1 ),
        vec2(  0.55, 1 ),
        vec2( 0.88, -1 ),
    ];

    var colors = [
        vec4( 1.0, 0.0, 0.0, 1.0 ),
        vec4( 1.0, 0.0, 0.0, 1.0 ),
        vec4( 1.0, 0.0, 0.0, 1.0 ),
        vec4( 0.0, 1.0, 0.0, 1.0 ),
        vec4( 0.0, 1.0, 0.0, 1.0 ),
        vec4( 0.0, 1.0, 0.0, 1.0 ),
        vec4( 0.0, 0.0, 1.0, 1.0 ),
        vec4( 0.0, 0.0, 1.0, 1.0 ),
        vec4( 0.0, 0.0, 1.0, 1.0 )
    ]

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    document.getElementById("SelectTriangle").onclick = function(event){
        triangle = event.target.index;
    }

    document.getElementById("LButton").onclick = function(){
        vertices[0+(3*triangle)][0] -= 0.05;
        vertices[1+(3*triangle)][0] -= 0.05;
        vertices[2+(3*triangle)][0] -= 0.05;
        if(vertices[0+(3*triangle)][0] < -1){
            vertices[0+(3*triangle)][0] = 0.22;
            vertices[1+(3*triangle)][0] = 0.55;
            vertices[2+(3*triangle)][0] = 0.88;
        }
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
        window.requestAnimFrame(render);

    }

    document.getElementById("RButton").onclick = function(){
        vertices[0+(3*triangle)][0] += 0.05;
        vertices[1+(3*triangle)][0] += 0.05;
        vertices[2+(3*triangle)][0] += 0.05;
        if(vertices[2+(3*triangle)][0] > 1){
            vertices[0+(3*triangle)][0] = -1;
            vertices[1+(3*triangle)][0] = -0.77;
            vertices[2+(3*triangle)][0] = -0.44;
        }
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
        window.requestAnimFrame(render);
    }

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 9 );
}
