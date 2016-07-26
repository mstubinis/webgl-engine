'use strict';
var Engine = Engine || {};
(function (scope, undefined){
    Engine.GameObjectManager = {};
    
    Engine.GameObjectManager.translate = function(obj,x,y,z,local){
        x *= Engine.dt; y *= Engine.dt; z *= Engine.dt;
        if(local !== undefined && local == false){
            Engine.GameObjectManager.setPosition(obj,obj._position[0] + x,obj._position[1] + y,obj._position[2] + z);
            return;
        }
        var offsetX = 0; var offsetY = 0; var offsetZ = 0;
        var forwardVector = Engine.GameObjectManager.forward(obj);
        var rightVector = Engine.GameObjectManager.right(obj);
        var upVector = Engine.GameObjectManager.up(obj);
        
        if(z != 0.0){
            offsetX += forwardVector[0] * z; 
            offsetY += forwardVector[1] * z; 
            offsetZ += forwardVector[2] * z;
        }
        if(x != 0.0){
            offsetX += rightVector[0] * x; 
            offsetY += rightVector[1] * x; 
            offsetZ += rightVector[2] * x;
        }
        if(y != 0.0){
            offsetX += upVector[0] * y; 
            offsetY += upVector[1] * y; 
            offsetZ += upVector[2] * y;
        }
        Engine.GameObjectManager.setPosition(obj,obj._position[0] + offsetX,obj._position[1] + offsetY,obj._position[2] + offsetZ);
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
        x *= Engine.dt; y *= Engine.dt; z *= Engine.dt;
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
        var pos = vec3.fill(obj.modelMatrix[12],obj.modelMatrix[13],obj.modelMatrix[14]);
        return pos;
    }
})(this);