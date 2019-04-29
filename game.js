'use strict'; 
var Engine = Engine || {};
(function (scope, undefined){
    Engine.Game = {};
    
    Engine.Game.initResources = function(){
		//initialize any resource loading here
    }
    Engine.Game.initLogic = function(){
		//initialize logic here, this happens after Engine.Game.initResources();
    }
    Engine.Game.update = function(dt){
		//call per-frame logic code here
    }
	Engine.Game.render = function(){
		//call per-frame rendering code here
	}
})(this);