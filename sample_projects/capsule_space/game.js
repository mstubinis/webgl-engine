'use strict'; 
var Engine = Engine || {};
(function (scope, undefined){
    Engine.Game = {};
    
    Engine.Game.initResources = function(){
        new Mesh("Dreadnaught","data/models/dreadnaught.obj");
        new Material("Dreadnaught","data/models/dreadnaught.png","data/models/dreadnaught_Glow.png","data/models/dreadnaught_Normal.png");
		
		new Mesh("CapsuleTunnel_1","data/models/capsuleTunnel_1.obj");
		new Mesh("CapsuleTunnel_2","data/models/capsuleTunnel_2.obj");
		new Mesh("CapsuleTunnel_3","data/models/capsuleTunnel_3.obj");
		
		new Mesh("CapsuleRibbon_1","data/models/capsuleRibbon_1.obj");
		new Mesh("CapsuleRibbon_2","data/models/capsuleRibbon_2.obj");
		
		new Material("StarFlare","data/effects/StarFlare.png");
		new Material("Capsule_A","data/effects/capsule_a.png");
		new Material("Capsule_B","data/effects/capsule_b.png");
		new Material("Capsule_C","data/effects/capsule_c.png");
		new Material("Capsule_D","data/effects/capsule_d.png");
		Engine.ResourceManager.materials["StarFlare"].shadeless = true;
		Engine.ResourceManager.materials["Capsule_A"].shadeless = true;
		Engine.ResourceManager.materials["Capsule_B"].shadeless = true;
		Engine.ResourceManager.materials["Capsule_C"].shadeless = true;
		Engine.ResourceManager.materials["Capsule_D"].shadeless = true;
    }
    Engine.Game.initLogic = function(){
		Engine.Game.starSize = 1.0;
		Engine.requestPointerLock();
        
        var light = new Light("PointLight1");
		light.setPosition(0,0.9,0);
		light.color = vec3.fill(255.0/255.0,225.0/255.0,235.0/255.0);
		light.specularPower = 0.0;
		
		Engine.scene.ambient = vec3.fill(20.0 / 255.0,12.0 / 255.0,0 / 255.0);
		
		Engine.Game.tunnelA_1 = new GameObject("AAAAAA_Capsule_Tunnel_A_1","CapsuleTunnel_1","Capsule_A");
		Engine.Game.tunnelA_2 = new GameObject("AAAAAA_Capsule_Tunnel_A_2","CapsuleTunnel_2","Capsule_A");
		Engine.Game.tunnelA_3 = new GameObject("AAAAAA_Capsule_Tunnel_A_3","CapsuleTunnel_3","Capsule_A");
		
		
		Engine.Game.tunnelB_1 = new GameObject("AAAAAA_Capsule_Tunnel_B_1","CapsuleTunnel_1","Capsule_B");
		Engine.Game.tunnelB_2 = new GameObject("AAAAAA_Capsule_Tunnel_B_2","CapsuleTunnel_2","Capsule_B");
		Engine.Game.tunnelB_3 = new GameObject("AAAAAA_Capsule_Tunnel_B_3","CapsuleTunnel_3","Capsule_B");
		
		Engine.Game.tunnel_radius = 5.0;
		
		Engine.Game.tunnelA_1.setScale(1.0 * Engine.Game.tunnel_radius,1.0 * Engine.Game.tunnel_radius,1.0 * Engine.Game.tunnel_radius);
		Engine.Game.tunnelA_2.setScale(1.0 * Engine.Game.tunnel_radius,1.0 * Engine.Game.tunnel_radius,1.0 * Engine.Game.tunnel_radius);
		Engine.Game.tunnelA_3.setScale(1.0 * Engine.Game.tunnel_radius,1.0 * Engine.Game.tunnel_radius,1.0 * Engine.Game.tunnel_radius);
		
		Engine.Game.tunnelB_1.setScale(0.8 * Engine.Game.tunnel_radius,0.8 * Engine.Game.tunnel_radius,1.0 * Engine.Game.tunnel_radius);
		Engine.Game.tunnelB_2.setScale(0.8 * Engine.Game.tunnel_radius,0.8 * Engine.Game.tunnel_radius,1.0 * Engine.Game.tunnel_radius);
		Engine.Game.tunnelB_3.setScale(0.8 * Engine.Game.tunnel_radius,0.8 * Engine.Game.tunnel_radius,1.0 * Engine.Game.tunnel_radius);
		
		Engine.Game.end2 = new CapsuleObject("AAAAAA_Capsule_Tunnel_D_End_2","Plane","Capsule_D");
		
		Engine.Game.ribbon1 = new CapsuleObject("AAAAAA_Capsule_Tunnel_C_Ribbon_1","CapsuleRibbon_1","Capsule_C");
		Engine.Game.ribbon1.setPosition(0,0.5,0);
		
		Engine.Game.ribbon2 = new CapsuleObject("AAAAAA_Capsule_Tunnel_C_Ribbon_2","CapsuleRibbon_2","Capsule_C");
		Engine.Game.ribbon2.setPosition(0,0.5,0);
		
		Engine.Game.ribbon1.setScale(1.0 * Engine.Game.tunnel_radius,1.0 * Engine.Game.tunnel_radius,1.0 * Engine.Game.tunnel_radius);
		Engine.Game.ribbon2.setScale(1.0 * Engine.Game.tunnel_radius,1.0 * Engine.Game.tunnel_radius,1.0 * Engine.Game.tunnel_radius);
		
		Engine.Game.timer = 0;
		
		Engine.Game.end1 = new CapsuleObject("AAAAAA_Capsule_Tunnel_D_End_1","Plane","Capsule_D");
		
		Engine.Game.end1.setPosition(0,0,-500);
		Engine.Game.end2.setPosition(0,0,500);
		
		Engine.Game.end1.setScale(19,19,19);
		Engine.Game.end2.setScale(19,19,19);
		
		Engine.Game.end2.color = vec4.fill(0,0,0,1);
		
		var step = -10.0;
		for(var i = 0; i < 60; i++){
			var x = (( Math.random() * 200) - 100)/100 * 3.7; 
			if(x > 0) 
				x += 1.5; 
			if(x < 0) 
				x -= 1.5;
			var y = (( Math.random() * 200) - 100)/100 * 3.7; 
			if(y > 0) 
				y += 1.5; 
			if(y < 0) 
				y -= 1.5;

			var res = vec3.create();
			var pos = vec3.fill(x,y,step);
			var pos1 = vec3.fill(Engine.Game.starSize,Engine.Game.starSize,Engine.Game.starSize);
			vec3.mul(res,pos,pos1);

			var spawnLight = false;
			if(i % 7 == 0){
				spawnLight = true;
			}
			var star = new CapsuleStar("AAAAAA_Capsule_Tunnel_D_Star_" + i,"Plane","StarFlare",spawnLight)
			star._position = res;
			star.scale = vec3.fill(0.5,0.5,0.5);
			step -= 6.0;
		}	
        var dreadnaught = new CapsuleDreadnaught("Dreadnaught","Dreadnaught","Dreadnaught");
        dreadnaught.setPosition(0,0,0);
    }
    Engine.Game.update = function(dt){
		Engine.Game.timer += dt;
		//make camera orbit object
        Engine.camera.rotateX(Engine.EventManager.mouse.diffY * 0.25);
        Engine.camera.rotateY(-Engine.EventManager.mouse.diffX * 0.25);
		var res = vec3.fill(1,1,1);
		res[0] *= -Engine.camera.forward()[0];
		res[1] *= -Engine.camera.forward()[1];
		res[2] *= -Engine.camera.forward()[2];
		mat4.lookAt(Engine.camera.viewMatrix,res,Engine.scene.objects["Dreadnaught"]._position,Engine.camera.up());
		//			
		//update capsule tunnel entities
		Engine.Game.tunnelA_1.translate(0,0,(-38 * Engine.Game.tunnel_radius));
		Engine.Game.tunnelA_2.translate(0,0,(-38 * Engine.Game.tunnel_radius));
		Engine.Game.tunnelA_3.translate(0,0,(-38 * Engine.Game.tunnel_radius));
		
		Engine.Game.tunnelB_1.translate(0,0,(-38 * Engine.Game.tunnel_radius));
		Engine.Game.tunnelB_2.translate(0,0,(-38 * Engine.Game.tunnel_radius));
		Engine.Game.tunnelB_3.translate(0,0,(-38 * Engine.Game.tunnel_radius));		
		
		Engine.Game.ribbon1.translate(0,0,(-18 * Engine.Game.tunnel_radius));
		Engine.Game.ribbon2.translate(0,0,(-18 * Engine.Game.tunnel_radius));
		
		Engine.Game.tunnelA_1.rotate(0,0,0.24);
		Engine.Game.tunnelA_2.rotate(0,0,0.24);
		Engine.Game.tunnelA_3.rotate(0,0,0.24);
		Engine.Game.tunnelB_1.rotate(0,0,-0.16);
		Engine.Game.tunnelB_2.rotate(0,0,-0.16);
		Engine.Game.tunnelB_3.rotate(0,0,-0.16);
			
		if(Engine.Game.tunnelA_1.position()[2] >= 12.112 * Engine.Game.tunnel_radius || Engine.Game.tunnelA_1.position()[2] <= -12.112 * Engine.Game.tunnel_radius){
			Engine.Game.tunnelA_1.setPosition(0,0,0);
		}
		if(Engine.Game.tunnelA_2.position()[2] >= 12.112 * Engine.Game.tunnel_radius || Engine.Game.tunnelA_2.position()[2] <= -12.112 * Engine.Game.tunnel_radius){
			Engine.Game.tunnelA_2.setPosition(0,0,0);
		}
		if(Engine.Game.tunnelA_3.position()[2] >= 12.112 * Engine.Game.tunnel_radius || Engine.Game.tunnelA_3.position()[2] <= -12.112 * Engine.Game.tunnel_radius){
			Engine.Game.tunnelA_3.setPosition(0,0,0);
		}
		
		if(Engine.Game.tunnelB_1.position()[2] >= 12.112 * Engine.Game.tunnel_radius || Engine.Game.tunnelB_1.position()[2] <= -12.112 * Engine.Game.tunnel_radius){
			Engine.Game.tunnelB_1.setPosition(0,0,0);
		}
		if(Engine.Game.tunnelB_2.position()[2] >= 12.112 * Engine.Game.tunnel_radius || Engine.Game.tunnelB_2.position()[2] <= -12.112 * Engine.Game.tunnel_radius){
			Engine.Game.tunnelB_2.setPosition(0,0,0);
		}
		if(Engine.Game.tunnelB_3.position()[2] >= 12.112 * Engine.Game.tunnel_radius || Engine.Game.tunnelB_3.position()[2] <= -12.112 * Engine.Game.tunnel_radius){
			Engine.Game.tunnelB_3.setPosition(0,0,0);
		}
		
		if(Engine.Game.ribbon1.position()[2] >= 20.0 * Engine.Game.tunnel_radius || Engine.Game.ribbon1.position()[2] <= -20.0 * Engine.Game.tunnel_radius){
			Engine.Game.ribbon1.setPosition(0,0.5,0);
		}
		if(Engine.Game.ribbon2.position()[2] >= 20.0 * Engine.Game.tunnel_radius || Engine.Game.ribbon2.position()[2] <= -20.0 * Engine.Game.tunnel_radius){
			Engine.Game.ribbon2.setPosition(0,0.5,0);
		}
		
		var sine = Math.sin(Engine.Game.timer * 2.4);
		var cose = Math.cos(Engine.Game.timer * 2.4);
		var x = sine * 0.07;
		var y = cose * 0.05;
		var roll  = (sine * 5.0) * 0.0174533;
		var pitch = (sine * 3.7) * 0.0174533;
		var q = quat.create();
		quat.rotateX(q,q,pitch);
		quat.rotateZ(q,q,roll);
		
/*
		var x = Math.sin(Engine.Game.timer)*0.06;
		var y = Math.cos(Engine.Game.timer)*0.031;
		var rot = Math.sin(Engine.Game.timer)*0.2;

		var pos = vec3.fill(x*1.2,-y,0.0);
		var q = quat.create();
		quat.rotateZ(q,q,rot);
*/
        var pos = vec3.fill(x*1.2,-y,0.0);


		mat4.identity(Engine.scene.objects["Dreadnaught"].modelMatrix);
		mat4.translate(Engine.scene.objects["Dreadnaught"].modelMatrix,Engine.scene.objects["Dreadnaught"].modelMatrix,pos);
		var mat4FromQuat = mat4.create();
		mat4.fromQuat(mat4FromQuat,q);
		mat4.mul(Engine.scene.objects["Dreadnaught"].modelMatrix,Engine.scene.objects["Dreadnaught"].modelMatrix,mat4FromQuat);
		mat4.scale(Engine.scene.objects["Dreadnaught"].modelMatrix,Engine.scene.objects["Dreadnaught"].modelMatrix,Engine.scene.objects["Dreadnaught"].scale);
		//
    }
})(this);