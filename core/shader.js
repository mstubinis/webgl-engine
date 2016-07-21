'use strict';

var Shader = function(name,vShaderFile,fShaderFile){
    if(name in Engine.ResourceManager.shaders){ return undefined; }
    
    this.program = -1;
    this.compile(vShaderFile,fShaderFile);
    
    Engine.ResourceManager.shaders[name] = this;
}; 
Shader.prototype.compile = function(vshader, fshader){
    var vertexShader = this.load(vshader);
    var fragmentShader = this.load(fshader);
    this.program = gl.createProgram();
    gl.attachShader (this.program, vertexShader);
    gl.attachShader (this.program, fragmentShader);
    gl.linkProgram(this.program);
    var linked = gl.getProgramParameter(this.program, gl.LINK_STATUS);
    if (!linked && !gl.isContextLost()) {
        var error = gl.getProgramInfoLog (this.program);
        gl.deleteProgram(this.program);
        gl.deleteProgram(fragmentShader);
        gl.deleteProgram(vertexShader);
        return null;
    }
}
Shader.prototype.load = function(shaderId){
    var shaderScript = document.getElementById(shaderId);
    var shaderType;
    if (!shaderScript) { return null; }
    if (shaderScript.type == "x-shader/x-vertex")        shaderType = gl.VERTEX_SHADER;
    else if (shaderScript.type == "x-shader/x-fragment") shaderType = gl.FRAGMENT_SHADER;
    else { return null; }
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderScript.text);
    gl.compileShader(shader);
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled && !gl.isContextLost()) {
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}