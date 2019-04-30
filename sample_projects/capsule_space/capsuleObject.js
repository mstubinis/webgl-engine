'use strict';
var CapsuleObject = function(name,mesh,material,scene){
	GameObject.call(this,name,mesh,material,scene);
	this.nodepth = true;
}; 
CapsuleObject.prototype = Object.create(GameObject.prototype);
CapsuleObject.prototype.render = function(){
    if(!this.visible) return;
	if(!Engine.camera.sphereIntersectTest(this.position(),this.radius)){ return; }

    this.shader = Engine.ResourceManager.shaders["Default"].program;
    this.drawMode = gl.TRIANGLES;
    Engine.RenderManager.objectQueue.push(this);
}

var CapsuleDreadnaught = function(name,mesh,material,scene){
	GameObject.call(this,name,mesh,material,scene);
}; 
CapsuleDreadnaught.prototype = Object.create(GameObject.prototype);
CapsuleDreadnaught.prototype.update = function(){
	return;
}
CapsuleDreadnaught.prototype.customRender = function(){
	gl.enable(gl.DEPTH_TEST);
	//gl.depthMask(gl.TRUE);
}
var CapsuleStar = function(name,mesh,material,spawnLight,scene){
	CapsuleObject.call(this,name,mesh,material,scene);
	this.color = vec4.fill(255.0/255.0,235/255.0,206/255.0,1.0);
}; 
CapsuleStar.prototype = Object.create(CapsuleObject.prototype);
CapsuleStar.prototype.update = function(){
	if(Engine.paused()) return;
	
    if(this.radius == 0 && (this.mesh) in Engine.ResourceManager.meshes && Engine.ResourceManager.meshes[this.mesh].loaded){
        Engine.GameObjectManager.setScale(this,this.scale[0],this.scale[1],this.scale[2]);
    }	
    this._position[2] += ((75 * Engine.Game.starSize) * Engine.dt );
    if(this._position[2] >= 200 * Engine.Game.starSize){
		
		var randDegree = (Math.random() * 360.0) * 0.0174533;
		
		var x = Math.sin(randDegree);
		var y = Math.cos(randDegree);
		x *= ((Engine.Game.starSize * 3) + 4);
		y *= ((Engine.Game.starSize * 3) + 4);
		var randSkewX = (Math.random() * 100) / 100;
		var randSkewY = (Math.random() * 100) / 100;
		randSkewX *= Engine.Game.starSize;
		randSkewY *= Engine.Game.starSize;
			
        this._position[0] = x + randSkewX;
		this._position[1] = y + randSkewY;
		this._position[2] = -200 * Engine.Game.starSize;
    }	
    this.rotation = Engine.camera.rotation;
	
    mat4.identity(this.modelMatrix);

    mat4.translate(this.modelMatrix,this.modelMatrix,this._position);
    var mat4FromQuat = mat4.create();
    mat4.fromQuat(mat4FromQuat,this.rotation);
    mat4.mul(this.modelMatrix,this.modelMatrix,mat4FromQuat);
    mat4.scale(this.modelMatrix,this.modelMatrix,this.scale);
}


var CapsuleRibbon = function(name,mesh,material,scene){
	GameObject.call(this,name,mesh,material,scene);
}; 
CapsuleRibbon.prototype = Object.create(GameObject.prototype);
CapsuleRibbon.prototype.customRender = function(){
	gl.disable(gl.DEPTH_TEST);
	//gl.depthMask(gl.TRUE);
}
