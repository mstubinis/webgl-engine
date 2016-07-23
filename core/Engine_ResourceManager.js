'use strict';
var Engine = Engine || {};
(function (scope, undefined){
    Engine.ResourceManager = {};
		
    Engine.ResourceManager.shaders = {};
    Engine.ResourceManager.meshes = {};
    Engine.ResourceManager.materials = {};
    Engine.ResourceManager.textures = {};
	
	Engine.ResourceManager.scenes = {};
    
	Engine.ResourceManager.initPreGameResources = function(){//add mandatory game resources

	}
	Engine.ResourceManager.initPreGameLogic = function(){//add mandatory game logic
		if(!Engine.hasOwnProperty('scene')){
			var s = new Scene('DefaultScene');
		}
	}
	
    Engine.ResourceManager.initDefaultResources = function(){//add any needed game resources that the user might have forgotten

    }
    Engine.ResourceManager.initDefaultLogic = function(){//add any needed game logic that the user might have forgotten
		if(!Engine.hasOwnProperty('camera')){
			var c = new Camera('DefaultCamera',Engine.canvas.width,Engine.canvas.height);
		}
    }
	Engine.ResourceManager.checkIfAllResourcesAreLoaded = function(){
		for(var key in Engine.ResourceManager.meshes){
			if(!Engine.ResourceManager.meshes[key].loaded){
				return false;
			}
		}
		for(var key in Engine.ResourceManager.textures){
			if(!Engine.ResourceManager.textures[key].loaded){
				return false;
			}
		}
		return true;
	}
	
})(this);