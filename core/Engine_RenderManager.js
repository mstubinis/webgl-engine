
var Engine = Engine || {};
(function (scope, undefined){
    'use strict';
    Engine.RenderManager = {};
    
	Engine.RenderManager.skyboxQueue = [];
	Engine.RenderManager.objectQueue = [];
	
    Engine.RenderManager.init = function(canvas){
        gl = WebGLUtils.setupWebGL(canvas,{
            antialias: true
        });
        if (!gl) { return; }
		
		gl.ext = gl.getExtension('WEBGL_draw_buffers');
		if (!gl.ext) {
		  // ...
		}

		Engine.GBuffer.init();
		
		return gl;
    }
    Engine.RenderManager.render = function(){
		for(var i = 0; i < Engine.RenderManager.skyboxQueue.length; i++){
			Engine.RenderManager.skyboxQueue[i].draw();
		}
		for(var i = 0; i < Engine.RenderManager.objectQueue.length; i++){
			Engine.RenderManager.objectQueue[i].draw();
		}
		Engine.RenderManager.skyboxQueue = [];
		Engine.RenderManager.objectQueue = [];
	}
    Engine.RenderManager.drawObject = function(obj){
        var mesh = Engine.ResourceManager.meshes[obj.mesh];
        var material = Engine.ResourceManager.materials[obj.material];
        if(mesh == undefined || !mesh.loaded){ return; }

		gl.useProgram(obj.shader);

        gl.uniformMatrix4fv(gl.getUniformLocation(obj.shader, "M"),false,obj.modelMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(obj.shader, "V"),false,Engine.camera.viewMatrix);

        var mvMatrix = mat4.create();
        mat4.mul(mvMatrix,obj.modelMatrix,Engine.camera.viewMatrix);
        var normalMatrix = mat4.create();
        mat4.invert(normalMatrix,mvMatrix);
        mat4.transpose(normalMatrix,normalMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(obj.shader, "normalMatrix"),false,normalMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(obj.shader, "P"),false,Engine.camera.projectionMatrix); 
        
        material.sendUniforms(obj.shader);
		mesh.sendUniforms(obj.drawMode);
    }
})(this);