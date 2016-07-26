'use strict';
var Engine = Engine || {};
var gl;
var g = {}; // global variables

function log(msg) { if (window.console && window.console.log) { window.console.log(msg); } }
Engine.toRad = function(degree){ return degree * 0.0174533; }
Engine.getExtension = function(fname){ return fname.substr((~-fname.lastIndexOf(".") >>> 0) + 2); }

Engine.framerate = function(){ return 1.0 / Engine.dt; }
Engine.fps = Engine.framerate;


Engine.run = function(){
    var now = Date.now();
    Engine.dt = (now - Engine.currentTime)/1000.0;
    Engine.currentTime = now;
    
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
    Engine.currentTime = 0;
    Engine.dt = 0;
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
    
    gl = Engine.RenderManager.init(Engine.canvas);
  
    Engine.canvas.addEventListener('webglcontextlost', Engine.handleContextLost, false);
    Engine.canvas.addEventListener('webglcontextrestored', Engine.handleContextRestored, false);
    
    Engine.ResourceManager.initPreGameResources();
    Engine.Game.initResources();
    Engine.ResourceManager.initDefaultResources();
    
    //this is the above area referenced below
}
Engine.onResourcesLoaded = function(){
    Engine.EventManager.init();
    Engine.currentTime = Date.now();
    Engine.dt = 0;
    
    //move this to above area if needed
    Engine.ResourceManager.initPreGameLogic();
    Engine.Game.initLogic();
    Engine.ResourceManager.initDefaultLogic();  
    Engine.resize(Engine.canvas.width,Engine.canvas.height);
    Engine.run();
}
Engine.requestPointerLock = function(){
    Engine.EventManager.pointerLock.desired = true;
}
Engine.resize = function(width,height){
    Engine.canvas.width = width;
    Engine.canvas.height = height;
    Engine.canvasEventCatcher.style.width = width + "px";
    Engine.canvasEventCatcher.style.height = height + "px"; 
    gl.viewport(0, 0, width, height);
    for (var key in Engine.ResourceManager.scenes) {
        var scene = Engine.ResourceManager.scenes[key];
        for (var key1 in scene.cameras) {
            scene.cameras[key1].resize(width,height);
        }
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
    Engine.RenderManager.render();
}

Engine.isKeyDown = function(key){ return Engine.EventManager.isKeyDown(key); }
Engine.isKeyUp = function(key){ return Engine.EventManager.isKeyUp(key); }