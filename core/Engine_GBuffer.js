'use strict';
var Engine = Engine || {};
(function (scope, undefined){
    Engine.GBuffer = {};
    
    Engine.GBuffer.fbo = -1;
    Engine.GBuffer.depthBuffer = -1;
    
    Engine.GBuffer.init = function(){
        /*
        Engine.GBuffer.fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, Engine.GBuffer.fbo);
        
        Engine.GBuffer.depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, Engine.GBuffer.depthBuffer);
        */
    }
})(this);