'use strict';
var Engine = Engine || {};
(function (scope, undefined){
    Engine.GameObjectManager = {};
    
    Engine.GameObjectManager.translate = function(obj,x,y,z){
        var offset = vec3.fill(0,0,0);

        var forwardVector = Engine.GameObjectManager.forward(obj);
        var rightVector = Engine.GameObjectManager.right(obj);
        var upVector = Engine.GameObjectManager.up(obj);
        
        offset[0] += forwardVector[0] * z; 
        offset[1] += forwardVector[1] * z; 
        offset[2] += forwardVector[2] * z;
        
        offset[0] += rightVector[0] * x; 
        offset[1] += rightVector[1] * x; 
        offset[2] += rightVector[2] * x;
        
        offset[0] += upVector[0] * y; 
        offset[1] += upVector[1] * y; 
        offset[2] += upVector[2] * y;

        Engine.GameObjectManager.setPosition(obj,obj._position[0] + offset[0],obj._position[1] + offset[1],obj._position[2] + offset[2]);
    }
    Engine.GameObjectManager.scale = function(obj,x,y,z){
        Engine.GameObjectManager.setScale(obj,obj.scale[0] + x,obj.scale[1] + y,obj.scale[2] + z);
    }
    Engine.GameObjectManager.setScale = function(obj,x,y,z){
        obj.scale[0] = x;
        obj.scale[1] = y;
        obj.scale[2] = z;
        if( !(obj.mesh) in Engine.ResourceManager.meshes){
            obj.radius = 0;
        }
        else{
            obj.radius = Engine.ResourceManager.meshes[obj.mesh].radius * vec3.maxElement(obj.scale);
        }
    }
    Engine.GameObjectManager.setPosition = function(obj,x,y,z){
        obj._position[0] = x;
        obj._position[1] = y;
        obj._position[2] = z;
    }
    Engine.GameObjectManager.update = function(obj){
        mat4.identity(obj.modelMatrix);

        mat4.translate(obj.modelMatrix,obj.modelMatrix,obj._position);
        var mat4FromQuat = mat4.create();
        mat4.fromQuat(mat4FromQuat,obj.rotation);
        mat4.mul(obj.modelMatrix,obj.modelMatrix,mat4FromQuat);
        mat4.scale(obj.modelMatrix,obj.modelMatrix,obj.scale);
    }
    Engine.GameObjectManager.rotate = function(obj,x,y,z){
        if(x != 0 && x !== undefined)
            quat.rotateX(obj.rotation,obj.rotation,x);
        if(y != 0 && y !== undefined)
            quat.rotateY(obj.rotation,obj.rotation,y);
        if(z != 0 && z !== undefined)
            quat.rotateZ(obj.rotation,obj.rotation,z);
    }
    Engine.GameObjectManager.up = function(obj){ return quat.up(obj.rotation); }
    Engine.GameObjectManager.right = function(obj){ return quat.right(obj.rotation); }
    Engine.GameObjectManager.forward = function(obj){ return quat.forward(obj.rotation); }
	Engine.GameObjectManager.position = function(obj){ 
		var pos = vec3.create();
		pos[0] = obj.modelMatrix[12];
		pos[1] = obj.modelMatrix[13];
		pos[2] = obj.modelMatrix[14];
		return pos;
	}
})(this);