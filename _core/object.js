'use strict';
var GameObject = function(name,mesh,material,scene){
    if(scene === undefined){
        if(name in Engine.scene.objects){ return Engine.scene.objects[name]; }
    }
    else{
        if(name in Engine.ResourceManager.scenes[scene].objects){ return Engine.ResourceManager.scenes[scene].objects[name]; }
    }
    
    this.mesh = mesh;
    this.material = material;
    this.radius = 0;
    this.modelMatrix = mat4.create();
    this._position = vec3.fill(0,0,0);
    this.rotation = quat.fill(0,0,0,1);
    this.color = vec4.fill(1,1,1,1);
    this.scale = vec3.fill(1,1,1);
    this.visible = true;
    
    Engine.GameObjectManager.setScale(this,this.scale[0],this.scale[1],this.scale[2]);
    
    if(scene === undefined)
        Engine.scene.objects[name] = this;
    else
        Engine.ResourceManager.scenes[scene].objects[name] = this;
}; 
GameObject.prototype.translate = function(x,y,z) {
    Engine.GameObjectManager.translate(this,x,y,z);
};
GameObject.prototype.scale = function(x,y,z){
    Engine.GameObjectManager.scale(this,x,y,z);
}
GameObject.prototype.setScale = function(x,y,z){
    Engine.GameObjectManager.setScale(this,x,y,z);
}
GameObject.prototype.setPosition = function(x,y,z){
    Engine.GameObjectManager.setPosition(this,x,y,z);
    this.update(Engine.dt);
}
GameObject.prototype.update = function(dt){
    if(this.radius == 0 && (this.mesh) in Engine.ResourceManager.meshes && Engine.ResourceManager.meshes[this.mesh].loaded){
        Engine.GameObjectManager.setScale(this,this.scale[0],this.scale[1],this.scale[2]);
    }
    
    mat4.identity(this.modelMatrix);

    mat4.translate(this.modelMatrix,this.modelMatrix,this._position);
    var mat4FromQuat = mat4.create();
    mat4.fromQuat(mat4FromQuat,this.rotation);
    mat4.mul(this.modelMatrix,this.modelMatrix,mat4FromQuat);
    mat4.scale(this.modelMatrix,this.modelMatrix,this.scale);
}
GameObject.prototype.render = function(){
    if(!this.visible) return;
    //if(!Engine.camera.sphereIntersectTest(this.position(),this.radius)){ 
        //return;
    //}
    
    this.shader = Engine.ResourceManager.shaders["Default"].program;
    this.drawMode = gl.TRIANGLES;
    Engine.RenderManager.objectQueue.push(this);
}
GameObject.prototype.draw = function(){
    Engine.RenderManager.drawObject(this);
}
GameObject.prototype.rotate = function(x,y,z){
    Engine.GameObjectManager.rotate(this,x,y,z);
}
GameObject.prototype.rotateX = function(x){ this.rotate(x,0,0); }
GameObject.prototype.rotateY = function(y){ this.rotate(0,y,0); }
GameObject.prototype.rotateZ = function(z){ this.rotate(0,0,z); }
    
GameObject.prototype.up = function(){ return Engine.GameObjectManager.up(this); }
GameObject.prototype.right = function(){ return Engine.GameObjectManager.right(this); }
GameObject.prototype.forward = function(){ return Engine.GameObjectManager.forward(this); }
GameObject.prototype.position = function(){ return Engine.GameObjectManager.position(this); }