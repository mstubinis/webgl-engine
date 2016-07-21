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
Engine.init = function(canvas,w,h){
	Engine.requestId = undefined;
	Engine.canvas = canvas;
	Engine.canvasEventCatcher = document.getElementById("canvasEventCatcher");
	Engine.canvas.width = w;
	Engine.canvas.height = h;
	
	Engine.canvasEventCatcher.style.width = w + "px";
	Engine.canvasEventCatcher.style.height = h + "px";
	
	Engine.dt = 0;
	
	Engine.EventManager.init(Engine.canvas,Engine.canvasEventCatcher);
	gl = Engine.RenderManager.init(Engine.canvas);
	Engine.ResourceManager.init();
	
	new Shader("Default","vshader","fshader");
	new Shader("Skybox","vshader-skybox","fshader-skybox");
	Engine.camera = new Camera("DefaultCamera",w,h);
	
	//Engine.framerate = new Framerate("framerate");

	Engine.canvas.addEventListener('webglcontextlost', Engine.handleContextLost, false);
	Engine.canvas.addEventListener('webglcontextrestored', Engine.handleContextRestored, false);
	
	Engine.Game.initResources();
	Engine.Game.initLogic();
	
	Engine.resize(w,h);

	Engine.run();
}
Engine.resize = function(width,height){
	gl.viewport(0, 0, width, height);
	for (var key in Engine.ResourceManager.cameras) {
		Engine.ResourceManager.cameras[key].resize(width,height);
	}
}
Engine.update = function(dt){
	Engine.Game.update(dt);
	for (var key in Engine.ResourceManager.objects) {
		Engine.ResourceManager.objects[key].update(dt);
	}
	for (var key in Engine.ResourceManager.cameras) {
		Engine.ResourceManager.cameras[key].update(dt);
	}
	Engine.EventManager.update(dt);
}

Engine.render = function(){
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clearDepth(10000);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	var shader = Engine.ResourceManager.shaders["Default"].program;
	
	gl.useProgram(shader);
	
	gl.uniform4f(gl.getUniformLocation(shader, "ambientColor"), 0.05, 0.05, 0.05, 1);

	setDirectionalLight(Engine.ResourceManager.shaders["Default"].program,
						[0.00, 0.00, 1.00     ],   // eyeVector
						[0.00, 0.00, 1.00, 1.00],   // position
						[0.05, 0.05, 0.05, 1.00],   // ambient
						[1.00, 1.00, 1.00, 1.00],   // diffuse
						[1.00, 1.00, 1.00, 1.00]);  // specular

	setMaterial(Engine.ResourceManager.shaders["Default"].program,
		[0.00, 0.00, 0.00, 0.00],  // emission
		[0.05, 0.05, 0.05, 1.00],  // ambient
		[1.00, 1.00, 1.00, 1.00],  // diffuse
		[1.00, 1.00, 1.00, 1.00],  // specular
		50);                   // shininess
	//
	
	for (var key in Engine.ResourceManager.objects) {
		Engine.ResourceManager.objects[key].render();
	}
	Engine.RenderManager.render();
}

Engine.isKeyDown = function(key){ return Engine.EventManager.isKeyDown(key); }
Engine.isKeyUp = function(key){ return Engine.EventManager.isKeyUp(key); }