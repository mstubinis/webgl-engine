'use strict';

var Scene = function(name){
    if(name in Engine.ResourceManager.scenes){ return undefined; }

	this.objects = {};
	this.lights = {};
	this.cameras = {};

    Engine.ResourceManager.scenes[name] = this;
	if(!Engine.hasOwnProperty('scene')){
		Engine.scene = this;
	}
};