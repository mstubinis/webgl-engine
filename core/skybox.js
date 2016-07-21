'use strict';

//files is array[6], [front,back,left,right,top,bottom]
Engine.Skybox = {};
var Skybox = function(name,files){
    if(!("Skybox" in Engine.ResourceManager.meshes)){
        //add skybox mesh to engine database
        
        var data = "v 1.000000 -1.000000 -1.000000\n" +
                    "v 1.000000 -1.000000 1.000000\n" +
                    "v -1.000000 -1.000000 1.000000\n" +
                    "v -1.000000 -1.000000 -1.000000\n" +
                    "v 1.000000 1.000000 -1.000000\n" +
                    "v 1.000000 1.000000 1.000001\n" +
                    "v -1.000000 1.000000 1.000000\n" +
                    "v -1.000000 1.000000 -1.000000\n" +
                    "f 2 4 1\n" +
                    "f 8 6 5\n" +
                    "f 5 2 1\n" +
                    "f 6 3 2\n" +
                    "f 3 8 4\n" +
                    "f 1 8 5\n" +
                    "f 2 3 4\n" +
                    "f 8 7 6\n" +
                    "f 5 6 2\n" +
                    "f 6 7 3\n" +
                    "f 3 7 8\n" +
                    "f 1 4 8\n";
        
        var m = {}; OBJ.Mesh(m,data);
        m = OBJ.initMeshBuffers(gl, m);
        m.loaded = true;
        Engine.ResourceManager.meshes["Skybox"] = m;
    }
    this.modelMatrix = mat4.create();
    //mat4.scale(this.modelMatrix,this.modelMatrix,vec3.fill(10,10,10));
    this.cubeMap = new Texture(name,files);
    Engine.ResourceManager.objects[name] = this;
};
Skybox.prototype.update = function(dt){
    this.modelMatrix[12] = Engine.camera.position[0];
    this.modelMatrix[13] = Engine.camera.position[1];
    this.modelMatrix[14] = Engine.camera.position[2];
}
Skybox.prototype.render = function(){
    if(!this.cubeMap.loaded) return;
    if(Engine.ResourceManager.meshes["Skybox"] == undefined || !Engine.ResourceManager.meshes["Skybox"].loaded){ return; }
    Engine.RenderManager.skyboxQueue.push(this);
}
Skybox.prototype.draw = function(){
    if(!this.cubeMap.loaded) return;
    gl.depthMask(false);
    var shader = Engine.ResourceManager.shaders["Skybox"].program;

    gl.useProgram(shader);

    gl.uniformMatrix4fv(gl.getUniformLocation(shader, "M"),false,this.modelMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shader, "V"),false,Engine.camera.viewMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shader, "P"),false,Engine.camera.projectionMatrix); 
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubeMap.texture);
    gl.uniform1i(gl.getUniformLocation(shader, "texture"), 0);
    
    gl.enableVertexAttribArray(0);     
    gl.bindBuffer(gl.ARRAY_BUFFER, Engine.ResourceManager.meshes["Skybox"].vertexBuffer);
    gl.vertexAttribPointer(0, Engine.ResourceManager.meshes["Skybox"].vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Engine.ResourceManager.meshes["Skybox"].indexBuffer);
    gl.drawElements(gl.TRIANGLES, Engine.ResourceManager.meshes["Skybox"].indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    gl.disableVertexAttribArray(0);

    gl.depthMask(true);
}