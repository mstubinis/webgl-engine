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
		new Shader("Default","vshader","fshader",["position","uv","normal","binormal","tangent"]);
	}
	Engine.ResourceManager.initPreGameLogic = function(){//add mandatory game logic
		if(!Engine.hasOwnProperty('scene')){
			new Scene('DefaultScene');
		}
	}
	
    Engine.ResourceManager.initDefaultResources = function(){//add any needed game resources that the user might have forgotten
		if(!("Plane" in Engine.ResourceManager.meshes)){
			var data = "v -1.000000 -1.000000 0.000000\n"+
					   "v 1.000000 -1.000000 0.000000\n"+
					   "v -1.000000 1.000000 0.000000\n"+
					   "v 1.000000 1.000000 0.000000\n"+
					   "vt 1.0000 0.0000\n"+
					   "vt 0.0000 1.0000\n"+
					   "vt 0.0000 0.0000\n"+
					   "vt 1.0000 1.0000\n"+
					   "vn 0.0000 0.0000 1.0000\n"+
					   "f 2/1/1 3/2/1 1/3/1\n"+
					   "f 2/1/1 4/4/1 3/2/1";
			new Mesh("Plane",data,false);
		}
    }
    Engine.ResourceManager.initDefaultLogic = function(){//add any needed game logic that the user might have forgotten
		if(!Engine.hasOwnProperty('camera')){
			new Camera('DefaultCamera',Engine.canvas.width,Engine.canvas.height);
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