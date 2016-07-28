'use strict';
var Engine = Engine || {};
(function (scope, undefined){
    Engine.PhysicsManager = {};

    Engine.PhysicsManager.init = function(){
		Engine.PhysicsManager.collisionConfiguration = new Bullet.CollisionConfiguration();
		Engine.PhysicsManager.dispatcher = new Bullet.Dispatcher(Engine.PhysicsManager.collisionConfiguration);
		var worldAabbMin = new Vecmath.Vec3(-50000, -50000, -50000);
        var worldAabbMax = new Vecmath.Vec3(50000, 50000, 50000);
		Engine.PhysicsManager.overlappingPairCache = new Bullet.BroadphaseInterface(worldAabbMin, worldAabbMax, 0xfffe, 0xffff, 16384, null);
		Engine.PhysicsManager.solver = new Bullet.ConstraintSolver();
		Engine.PhysicsManager.world = new Bullet.CollisionWorld(Engine.PhysicsManager.dispatcher,
		                                               Engine.PhysicsManager.overlappingPairCache,
													   Engine.PhysicsManager.solver,
													   Engine.PhysicsManager.collisionConfiguration);
		Engine.PhysicsManager.world.setGravity(new Vecmath.Vec3(0,0,0));
    }
	Engine.PhysicsManager.cleanup = function(){
	}
	Engine.PhysicsManager.setGravity = function(x,y,z){
		Engine.PhysicsManager.world.setGravity(new Vecmath.Vec3(x,y,z));
	}
	Engine.PhysicsManager.update = function(dt){
		Engine.PhysicsManager.world.stepSimulation3( dt, 5 , 1.0/60.0);
	}
})(this);