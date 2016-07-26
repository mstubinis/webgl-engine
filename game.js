var Engine = Engine || {};
(function (scope, undefined){
    'use strict'; Engine.Game = {};
    
    Engine.Game.initResources = function(){
        var defiantMesh = new Mesh("Defiant","data/models/defiant.obj");
        var defiantMaterial = new Material("Defiant","data/models/defiant.png","data/models/defiant_Glow.png","data/models/defiant_Normal.png");
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
        var defiant = new GameObject("Defiant","Defiant","Defiant");
        defiant.setPosition(0,0,0);
        
        var light = new Light("DirLight1");
		light.setPosition(2,2,2);

        Engine.requestPointerLock();
    }
    Engine.Game.update = function(dt){
        Engine.camera.translate(0,0,-Engine.EventManager.mouse.wheel);
        if(Engine.isKeyDown("KEY_W")){
            Engine.camera.translate(0,0,-10);
        }
        if(Engine.isKeyDown("KEY_S")){
            Engine.camera.translate(0,0,10);
        }
        if(Engine.isKeyDown("KEY_A")){
            Engine.camera.translate(10,0,0);
        }
        if(Engine.isKeyDown("KEY_D")){
            Engine.camera.translate(-10,0,0);
        }
        if(Engine.isKeyDown("KEY_Q")){
            Engine.camera.rotateZ(-3);
        }
        if(Engine.isKeyDown("KEY_E")){
            Engine.camera.rotateZ(3);
        }
        Engine.camera.rotateX(Engine.EventManager.mouse.diffY*0.25);
        Engine.camera.rotateY(-Engine.EventManager.mouse.diffX*0.25);
    }
})(this);