'use strict';
var Engine = Engine || {};
(function (scope, undefined){
    Engine.GBuffer = {};
    Engine.GBuffer.init = function(){
		
		if(!gl.extensions.drawBuffers){
			console.log("Error: could not support draw buffer extension. Deferred rendering is not possible.");
			return;
		}
		if(!gl.extensions.depthTexture){
			console.log("Error: could not support depth texture extension. Deferred rendering is not possible.");
			return;
		}
		Engine.GBuffer.fbo = -1;
		Engine.GBuffer.depthBuffer = -1;
		/*
        Engine.GBuffer.fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, Engine.GBuffer.fbo);
        
        Engine.GBuffer.depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, Engine.GBuffer.depthBuffer);
		*/
    }
})(this);