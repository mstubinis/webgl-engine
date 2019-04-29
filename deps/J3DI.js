/*
 * Copyright (C) 2009 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

function log(msg) { if (window.console && window.console.log) { window.console.log(msg); } }
// Load shaders with the passed names and create a program with them. Return this program in the 'program' property of the returned context.
function simpleSetup(gl, vshader, fshader, attribs, clearColor, clearDepth){
    var vertexShader = loadShader(gl, vshader);
    var fragmentShader = loadShader(gl, fshader);

    var program = gl.createProgram();

    gl.attachShader (program, vertexShader);
    gl.attachShader (program, fragmentShader);

    for (var i = 0; i < attribs.length; ++i)
        gl.bindAttribLocation (program, i, attribs[i]);
    gl.linkProgram(program);

    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked && !gl.isContextLost()) {
        var error = gl.getProgramInfoLog (program);
        log("Error in program linking:"+error);
        gl.deleteProgram(program);
        gl.deleteProgram(fragmentShader);
        gl.deleteProgram(vertexShader);
        return null;
    }
    gl.useProgram(program);

    gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
    gl.clearDepth(clearDepth);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    return program;
}
function loadShader(ctx, shaderId){
    var shaderScript = document.getElementById(shaderId);
    if (!shaderScript) {
        log("*** Error: shader script '"+shaderId+"' not found");
        return null;
    }
    if (shaderScript.type == "x-shader/x-vertex")
        var shaderType = ctx.VERTEX_SHADER;
    else if (shaderScript.type == "x-shader/x-fragment")
        var shaderType = ctx.FRAGMENT_SHADER;
    else {
        log("*** Error: shader script '"+shaderId+"' of undefined type '"+shaderScript.type+"'");
        return null;
    }
    var shader = ctx.createShader(shaderType);
    ctx.shaderSource(shader, shaderScript.text);
    ctx.compileShader(shader);

    var compiled = ctx.getShaderParameter(shader, ctx.COMPILE_STATUS);
    if (!compiled && !ctx.isContextLost()) {
        var error = ctx.getShaderInfoLog(shader);
        log("*** Error compiling shader '"+shaderId+"':"+error);
        ctx.deleteShader(shader);
        return null;
    }
    return shader;
}
// Array of images curently loading
var g_loadingImages = [];

// Clears all the images currently loading. This is used to handle context lost events.
function clearLoadingImages() {
    for (var ii = 0; ii < g_loadingImages.length; ++ii) {
        g_loadingImages[ii].onload = undefined;
    }
    g_loadingImages = [];
}
// Load the image at the passed url, place it in a new WebGLTexture object and return the WebGLTexture.
function loadImageTexture(ctx, url){
    var texture = ctx.createTexture();
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, 1, 1, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, null);
    var image = new Image();
    g_loadingImages.push(image);
    image.onload = function() { doLoadImageTexture(ctx, image, texture) }
    image.src = url;
    return texture;
}
function doLoadImageTexture(ctx, image, texture){
    g_loadingImages.splice(g_loadingImages.indexOf(image), 1);
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.REPEAT);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.REPEAT);
    //ctx.generateMipmap(ctx.TEXTURE_2D);
    ctx.bindTexture(ctx.TEXTURE_2D, null);
}
// Framerate object
//
// This object keeps track of framerate and displays it as the innerHTML text of the
// HTML element with the passed id. Once created you call snapshot at the end
// of every rendering cycle. Every 500ms the framerate is updated in the HTML element.
var Framerate = function(id){
    this.numFramerates = 10;
    this.framerateUpdateInterval = 500;
    this.id = id;

    this.renderTime = -1;
    this.framerates = [ ];
    self = this;
    var fr = function() { self.updateFramerate() }
    setInterval(fr, this.framerateUpdateInterval);
}
Framerate.prototype.updateFramerate = function(){
    var tot = 0;
    for (var i = 0; i < this.framerates.length; ++i)
        tot += this.framerates[i];

    var framerate = tot / this.framerates.length;
    framerate = Math.round(framerate);
    
	//document.getElementById(this.id).innerHTML = "Framerate:"+framerate+"fps";
}
Framerate.prototype.snapshot = function(){
    if (this.renderTime < 0)
        this.renderTime = new Date().getTime();
    else {
        var newTime = new Date().getTime();
        var t = newTime - this.renderTime;
        if (t == 0)
            return;
        var framerate = 1000/t;
        this.framerates.push(framerate);
        while (this.framerates.length > this.numFramerates)
            this.framerates.shift();
        this.renderTime = newTime;
    }
}