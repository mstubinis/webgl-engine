'use strict';
var Engine = Engine || {};
var gl;
var g = {}; // global variables

function log(msg) { if (window.console && window.console.log) { window.console.log(msg); } }
Engine.toRad = function(degree){ return degree * 0.0174533; }

Engine.Framerate = function(id){
    this.numFramerates = 10;
    this.framerateUpdateInterval = 500;
    this.id = id;
    this.renderTime = -1;
    this.framerates = [];
    var _this = this;
    var fr = function() { _this.updateFramerate() }
    setInterval(fr, this.framerateUpdateInterval);
}
Engine.Framerate.prototype.updateFramerate = function(){
    var tot = 0;
    for (var i = 0; i < this.framerates.length; ++i)
        tot += this.framerates[i];
    var framerate = tot / this.framerates.length;
    framerate = Math.round(framerate);
}
Engine.Framerate.prototype.snapshot = function(){
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

Engine.run = function(){
    Engine.update(Engine.dt);
    Engine.render();
    Engine.requestId = window.requestAnimFrame(Engine.run, Engine.canvas);
}
Engine.handleContextLost = function(e) {
    e.preventDefault();
    if (Engine.requestId !== undefined) {
        window.cancelAnimFrame(Engine.requestId);
        Engine.requestId = undefined;
    }
}
Engine.handleContextRestored = function() {
    Engine.run();
}
Engine.init = function(w,h){
	//first build the canvas and it's necessary html elements.
	var body = document.getElementsByTagName('body')[0];
	
	var canvas_event_element = document.createElement('div');
	canvas_event_element.setAttribute('tabindex', '0');
	canvas_event_element.setAttribute('id', 'canvasEventCatcher');
	canvas_event_element.setAttribute('style', 'position:absolute;top:0;left:0;z-index:5;outline:none;');
	
	var canvas_debug_element = document.createElement('div');
	canvas_debug_element.setAttribute('tabindex', '-1');
	canvas_debug_element.setAttribute('id', 'canvasDebug');
	canvas_debug_element.setAttribute('style', 'margin:0;outline:0;border:0;padding:0;left:0;top:0;position:absolute;color:yellow;font-size:200%;');

	var canvas_element = document.createElement('canvas');
	canvas_element.setAttribute('tabindex', '-1');
	canvas_element.setAttribute('id', 'canvas');
	canvas_element.setAttribute('style', 'top:0;left:0;z-index:3;');
	
	//framerate thing for future reference
	//<!--<div id="framerate"></div>-->
	
	body.appendChild(canvas_event_element);
	body.appendChild(canvas_debug_element);
	body.appendChild(canvas_element);
	//
    Engine.requestId = undefined;
    Engine.canvas = document.getElementById('canvas');
    Engine.canvasEventCatcher = document.getElementById("canvasEventCatcher");
    Engine.canvas.width = w;
    Engine.canvas.height = h;
    
    Engine.canvasEventCatcher.style.width = w + "px";
    Engine.canvasEventCatcher.style.height = h + "px";
    
    Engine.dt = 0;
    
    gl = Engine.RenderManager.init(Engine.canvas);
  
    new Shader("Default","vshader","fshader");

    //Engine.framerate = new Framerate("framerate");

    Engine.canvas.addEventListener('webglcontextlost', Engine.handleContextLost, false);
    Engine.canvas.addEventListener('webglcontextrestored', Engine.handleContextRestored, false);
    
	Engine.ResourceManager.initPreGameResources();
    Engine.Game.initResources();
	Engine.ResourceManager.initDefaultResources();
	
	Engine.ResourceManager.initPreGameLogic();
    Engine.Game.initLogic();
	Engine.ResourceManager.initDefaultLogic();
    
    Engine.resize(w,h);

    Engine.run();
}
Engine.requestPointerLock = function(){
    Engine.EventManager.pointerLock.desired = true;
}
Engine.resize = function(width,height){
    gl.viewport(0, 0, width, height);
    for (var key in Engine.ResourceManager.scenes.cameras) {
        Engine.ResourceManager.scenes.cameras[key].resize(width,height);
    }
}
Engine.update = function(dt){
    Engine.Game.update(dt);
    for (var key in Engine.scene.lights) {
        Engine.scene.lights[key].update(dt);
    }
    for (var key in Engine.scene.objects) {
        Engine.scene.objects[key].update(dt);
    }
    for (var key in Engine.scene.cameras) {
        Engine.scene.cameras[key].update(dt);
    }
    Engine.EventManager.update(dt);
}

Engine.render = function(){
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clearDepth(Engine.camera.far);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var shader = Engine.ResourceManager.shaders["Default"].program;
    
    gl.useProgram(shader);
    
    gl.uniform4f(gl.getUniformLocation(shader, "ambientColor"), 0.05, 0.05, 0.05, 1);

    //dir light
    for(key in Engine.scene.lights){
        Engine.scene.lights[key].sendUniforms(shader);
    }
	//queue up game objects for drawing
    for (var key in Engine.scene.objects) {
        Engine.scene.objects[key].render();
    }
    Engine.RenderManager.render();
}

Engine.isKeyDown = function(key){ return Engine.EventManager.isKeyDown(key); }
Engine.isKeyUp = function(key){ return Engine.EventManager.isKeyUp(key); }