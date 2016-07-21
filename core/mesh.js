'use strict';

var Mesh = function(name,meshFile){
    if(name in Engine.ResourceManager.meshes){ return undefined; }
    
	var _this = this;
    OBJ.downloadMeshes( {meshFile: meshFile}, InitMeshFunc,_this,name);
}; 
var InitMeshFunc = function(_this,name){
    _this = OBJ.initMeshBuffers(gl, _this);
    _this.loaded = true;
    Engine.ResourceManager.meshes[name] = _this;
}
Mesh.prototype.sendUniforms = function(drawMode){
    if(!this.loaded) return;
    
    for(var i = 0; i < 5; i++){gl.enableVertexAttribArray(i);}
        
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(0, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    if(this.uvBuffer != undefined){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.vertexAttribPointer(1, this.uvBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }
    if(this.normalBuffer != undefined){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(2, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }
    if(this.binormalBuffer != undefined){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.binormalBuffer);
        gl.vertexAttribPointer(3, this.binormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }
    if(this.tangentBuffer != undefined){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
        gl.vertexAttribPointer(4, this.tangentBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(drawMode, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    
    for(var i = 0; i < 5; i++){gl.disableVertexAttribArray(i);}
}