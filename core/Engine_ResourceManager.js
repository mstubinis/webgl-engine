
var Engine = Engine || {};
(function (scope, undefined){
    'use strict';
    Engine.ResourceManager = {};
	
	Engine.ResourceManager.shaders = {};
	Engine.ResourceManager.meshes = {};
	Engine.ResourceManager.materials = {};
	Engine.ResourceManager.textures = {};
	Engine.ResourceManager.objects = {};
	Engine.ResourceManager.cameras = {};
    
    Engine.ResourceManager.init = function(){
		/*
		Engine.GBuffer.fbo = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, Engine.GBuffer.fbo);
		
		Engine.GBuffer.depthBuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, Engine.GBuffer.depthBuffer);
		*/
	}
})(this);