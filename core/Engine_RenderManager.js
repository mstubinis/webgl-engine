'use strict';
var Engine = Engine || {};
(function (scope, undefined){
    Engine.RenderManager = {};
    Engine.RenderManager.skyboxQueue = [];
    Engine.RenderManager.objectQueue = [];
    
    Engine.RenderManager.init = function(canvas){
        gl = WebGLUtils.setupWebGL(canvas,{antialias: true});
        if (!gl) { return; }
        
        gl.ext = gl.getExtension('WEBGL_draw_buffers');
        if (!gl.ext) {
          // ...
        }

        Engine.GBuffer.init();
		
		var maxVertexShaderUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
		var maxFragmentShaderUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
		var maxShaderVaryings = gl.getParameter(gl.MAX_VARYING_VECTORS);
		
		var vertexTextureUnits = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
		var fragmentTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
		var combinedTextureUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
		
		var maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);

		var highp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
		var highpSupported = highp.precision != 0;
		
		var antialias = gl.getContextAttributes().antialias;
		var size = gl.getParameter(gl.SAMPLES);

		gl.enableVertexAttribArray(0);//always have this enabled.
		
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
		
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

		var camPos = Engine.camera.position();
		gl.uniform3f(gl.getUniformLocation(obj.shader, "CameraPosition"),camPos[0],camPos[1],camPos[2]);
		/*
        var mvMatrix = mat4.create();
        mat4.mul(mvMatrix,obj.modelMatrix,Engine.camera.viewMatrix);
        var normalMatrix = mat4.create();
        mat4.invert(normalMatrix,mvMatrix);
        mat4.transpose(normalMatrix,normalMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(obj.shader, "normalMatrix"),false,normalMatrix);
		*/
        gl.uniformMatrix4fv(gl.getUniformLocation(obj.shader, "P"),false,Engine.camera.projectionMatrix); 
        
        material.sendUniforms(obj.shader);
        mesh.sendUniforms(obj.drawMode);
    }
})(this);