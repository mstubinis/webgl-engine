'use strict'; 
var Engine = Engine || {};
(function (scope, undefined){
    Engine.Game = {};
    
    Engine.Game.initResources = function(){
        new Mesh("Defiant","data/models/defiant.obj");
		new Mesh("DefiantCol","data/models/defiantCol.obj");
        new Material("Defiant","data/models/defiant.png","data/models/defiant_Glow.png","data/models/defiant_Normal.png");
    }
    Engine.Game.initLogic = function(){
        var files = [
            "data/skyboxes/SolarSystem/Front.jpg",
            "data/skyboxes/SolarSystem/Back.jpg",
            "data/skyboxes/SolarSystem/Left.jpg",
            "data/skyboxes/SolarSystem/Right.jpg",
            "data/skyboxes/SolarSystem/Top.jpg",
            "data/skyboxes/SolarSystem/Bottom.jpg"
        ];
        var skybox = new Skybox("SceneSkybox",files);
        var defiant = new GameObjectDynamic("Defiant","Defiant","Defiant",Engine.PhysicsManager.COLLISION_FLAG_CONVEX,"DefiantCol");
        defiant.setPosition(0,0,0);
       
        var defiant1 = new GameObjectDynamic("Defiant1","Defiant","Defiant",Engine.PhysicsManager.COLLISION_FLAG_CONVEX,"DefiantCol");
        defiant1.setPosition(13,0,0);
       
        var light = new Light("DirLight1");
        light.setPosition(2,2,2,0);

        Engine.requestPointerLock();
        
        var map = [];
        for(var i = 5; i < 20; i++){
            for(var j = 0; j < 15; j++){
                for(var k = 0; k < 15; k++){
                    var noise = Engine.Math.simplexNoise3D(i/3,j/3,k/3);
                    var str = i+","+j+","+k;
                    map[str] = noise;
                }
            }
        }
        Engine.Math.normalizeArrayOfNumbers(map);
        for(var key in map){
            var a = key.split(',')
            var value = map[key];
            if(value > 0.76){
                var obj = new GameObject("Cube " + a[0] + a[1] + a[2],"Cube","Defiant");
                obj.color = vec4.fill(0,1,0,1);
                obj.setPosition(a[0]*2,a[1]*2,a[2]*2);
                obj.shadeless = true;
            }
        }
    }
    Engine.Game.update = function(dt){
        Engine.camera.translate(0,0,-Engine.EventManager.mouse.wheel*2.0);
        if(Engine.isKeyDown("KEY_W")){
            Engine.scene.objects["Defiant"].applyCentralForce(0,0,-10);
        }
        if(Engine.isKeyDown("KEY_S")){
            Engine.scene.objects["Defiant"].applyCentralForce(0,0,10);
        }
        if(Engine.isKeyDown("KEY_A")){
            Engine.scene.objects["Defiant"].applyCentralForce(-10,0,0);
        }
        if(Engine.isKeyDown("KEY_D")){
            Engine.scene.objects["Defiant"].applyCentralForce(10,0,0);
        }
        if(Engine.isKeyDown("KEY_F")){
            Engine.scene.objects["Defiant"].applyCentralForce(0,-10,0);
        }
        if(Engine.isKeyDown("KEY_R")){
            Engine.scene.objects["Defiant"].applyCentralForce(0,10,0);
        }
        if(Engine.isKeyDown("KEY_Q")){
            Engine.scene.objects["Defiant"].rotateZ(155);
        }
        if(Engine.isKeyDown("KEY_E")){
            Engine.scene.objects["Defiant"].rotateZ(-155);
        }
        Engine.scene.objects["Defiant"].rotateY(Engine.EventManager.mouse.diffY*5.5);
        Engine.scene.objects["Defiant"].rotateX(Engine.EventManager.mouse.diffX*5.5);
        
        
        var eye = vec3.create();
        
        var pos = Engine.scene.objects["Defiant"].position();
        var fwd = Engine.scene.objects["Defiant"].forward();
        var up = Engine.scene.objects["Defiant"].up();
        
        eye[0] = pos[0] + fwd[0]*7.5;
        eye[1] = pos[1] + fwd[1]*7.5;
        eye[2] = pos[2] + fwd[2]*7.5;
        
        eye[0] += up[0] * 0.8;
        eye[1] += up[1] * 0.8;
        eye[2] += up[2] * 0.8;
        
        Engine.camera.lookAt(eye,pos,up);
    }
})(this);