'use strict';

//Basic GameObject - No physics interactions with ammo.js
{
	var GameObject = function(n,mesh,material,scene){
		if(scene === undefined){ if(n in Engine.scene.objects){ return Engine.scene.objects[n]; } }
		else{ if(n in Engine.ResourceManager.scenes[scene].objects){ return Engine.ResourceManager.scenes[scene].objects[n]; } }
		
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
		
		if(scene === undefined){ Engine.scene.objects[n] = this; }
		else{ Engine.ResourceManager.scenes[scene].objects[n] = this; }
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
		Engine.GameObjectManager.update(this);
	}
	GameObject.prototype.render = function(){
		if(!this.visible) return;
		//if(!Engine.camera.sphereIntersectTest(this.position(),this.radius)){ return; }
		
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

}
//Dynamic GameObject - Interacts with ammo.js physics
{
	var GameObjectDynamic = function(n,mesh,material,collision,scene){
		if(scene === undefined){ if(n in Engine.scene.objects){ return Engine.scene.objects[n]; } }
		else{if(n in Engine.ResourceManager.scenes[scene].objects){ return Engine.ResourceManager.scenes[scene].objects[n];}}
		
		this.mesh = mesh;
		this.material = material;
		this.radius = Engine.ResourceManager.meshes[this.mesh].radius;
		this.color = vec4.fill(1,1,1,1);
		this.visible = true;
		
		this.modelMatrix = mat4.create();

		var mass = Engine.ResourceManager.meshes[this.mesh].radius;
		var startTransform = new Bullet.Transform();
		startTransform.setIdentity();
		startTransform.origin = new Vecmath.Vec3(0,0,0); // Set initial position 
		var localInertia = new Vecmath.Vec3(0,0,0); 
		var boxShape = new Bullet.BoxShape(new Vecmath.Vec3( 1.5, 1.5, 1.5 )); //Collision shape
		boxShape.calculateLocalInertia(mass,localInertia );
		var motionState = new Bullet.MotionState( startTransform );
		var ci = new Bullet.RigidBodyConstructionInfo(mass,motionState,boxShape,localInertia);
		this.rigidBody = new Bullet.RigidBody(ci);
		
		this.rigidBody.setSleepingThresholds(0.015,0.015);
		
		this.rigidBody.friction = 0.3;
		this.rigidBody.setDamping(0.1,0.4);//this makes the objects slowly slow down in space, like air friction
		//this.rigidBody.setUserPointer(this);
		Engine.PhysicsManager.world.addRigidBody(this.rigidBody);

		
		Engine.GameObjectManager.setScaleDynamic(this,this.scale[0],this.scale[1],this.scale[2]);
		
		if(scene === undefined){ Engine.scene.objects[n] = this; }
		else{ Engine.ResourceManager.scenes[scene].objects[n] = this; }
	}; 
	GameObjectDynamic.prototype.translate = function(x,y,z) {
		Engine.GameObjectManager.translateDynamic(this,x,y,z);
	};
	GameObjectDynamic.prototype.scale = function(x,y,z){
		Engine.GameObjectManager.scaleDynamic(this,x,y,z);
	}
	GameObjectDynamic.prototype.setScale = function(x,y,z){
		Engine.GameObjectManager.setScaleDynamic(this,x,y,z);
	}
	GameObjectDynamic.prototype.setPosition = function(x,y,z){
		Engine.GameObjectManager.setPositionDynamic(this,x,y,z);
		this.update(Engine.dt);
	}
	GameObjectDynamic.prototype.update = function(dt){
		if(this.radius == 0 && (this.mesh) in Engine.ResourceManager.meshes && Engine.ResourceManager.meshes[this.mesh].loaded){
			Engine.GameObjectManager.setScaleDynamic(this,this.scale[0],this.scale[1],this.scale[2]);
		}
		Engine.GameObjectManager.updateDynamic(this);
	}
	GameObjectDynamic.prototype.render = function(){
		if(!this.visible) return;
		//if(!Engine.camera.sphereIntersectTest(this.position(),this.radius)){ return; }
		
		this.shader = Engine.ResourceManager.shaders["Default"].program;
		this.drawMode = gl.TRIANGLES;
		Engine.RenderManager.objectQueue.push(this);
	}
	GameObjectDynamic.prototype.draw = function(){
		Engine.RenderManager.drawObject(this);
	}
	GameObjectDynamic.prototype.rotate = function(x,y,z){
		Engine.GameObjectManager.rotateDynamic(this,x,y,z);
	}
	GameObjectDynamic.prototype.rotateX = function(x){ this.rotate(x,0,0); }
	GameObjectDynamic.prototype.rotateY = function(y){ this.rotate(0,y,0); }
	GameObjectDynamic.prototype.rotateZ = function(z){ this.rotate(0,0,z); }
		
	GameObjectDynamic.prototype.up = function(){ return Engine.GameObjectManager.upDynamic(this); }
	GameObjectDynamic.prototype.right = function(){ return Engine.GameObjectManager.rightDynamic(this); }
	GameObjectDynamic.prototype.forward = function(){ return Engine.GameObjectManager.forwardDynamic(this); }
	GameObjectDynamic.prototype.position = function(){ return Engine.GameObjectManager.positionDynamic(this); }
	
	GameObjectDynamic.prototype.setMass = function(mass){ Engine.GameObjectManager.setMass(this,mass); }
	
	GameObjectDynamic.prototype.applyForce = function(x,y,z,rX,rY,rZ,local){
		Engine.GameObjectManager.applyForce(this,x,y,z,rX,rY,rZ,local);
	}
	GameObjectDynamic.prototype.applyCentralForce = function(x,y,z,local){
		Engine.GameObjectManager.applyCentralForce(this,x,y,z,local);
	}
	GameObjectDynamic.prototype.setLinearVelocity = function(x,y,z,local){
		Engine.GameObjectManager.setLinearVelocity(this,x,y,z,local);
	}
	GameObjectDynamic.prototype.setAngularVelocity = function(x,y,z,local){
		Engine.GameObjectManager.setAngularVelocity(this,x,y,z,local);
	}
	GameObjectDynamic.prototype.clearLinearForces = function(){ Engine.GameObjectManager.clearLinearForces(this); }
	GameObjectDynamic.prototype.clearAngularForces = function(){ Engine.GameObjectManager.clearAngularForces(this); }
	GameObjectDynamic.prototype.clearAllForces = function(){ Engine.GameObjectManager.clearAllForces(this); }
}