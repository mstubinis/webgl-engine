var Engine = Engine || {};
(function (scope, undefined){
    'use strict'; Engine.Game = {};
    
    Engine.Game.initResources = function(){
        var defiantMesh = new Mesh("Defiant","models/defiant.obj");
        var defiantMaterial = new Material("Defiant","models/defiant.jpg","models/defiant_Glow.jpg","models/defiant_Normal.jpg");
    }
    Engine.Game.initLogic = function(){
        var files = [
            "skyboxes/SolarSystem/Front.jpg",
            "skyboxes/SolarSystem/Back.jpg",
            "skyboxes/SolarSystem/Left.jpg",
            "skyboxes/SolarSystem/Right.jpg",
            "skyboxes/SolarSystem/Top.jpg",
            "skyboxes/SolarSystem/Bottom.jpg"
        ];
        var skybox = new Skybox("SceneSkybox",files);
        var defiant = new GameObject("Defiant","Defiant","Defiant");
        defiant.setPosition(0,0,0);
        
        var light = new Light("DirLight1");
		light.setPosition(5,5,5);

        Engine.requestPointerLock();
    }
    Engine.Game.update = function(dt){
        Engine.camera.translate(0,0,-Engine.EventManager.mouse.wheel);
        if(Engine.isKeyDown("KEY_W")){
            Engine.camera.translate(0,0,-0.1);
        }
        if(Engine.isKeyDown("KEY_S")){
            Engine.camera.translate(0,0,0.1);
        }
        if(Engine.isKeyDown("KEY_A")){
            Engine.camera.translate(0.1,0,0);
        }
        if(Engine.isKeyDown("KEY_D")){
            Engine.camera.translate(-0.1,0,0);
        }
        if(Engine.isKeyDown("KEY_Q")){
            Engine.camera.rotateZ(-0.03);
        }
        if(Engine.isKeyDown("KEY_E")){
            Engine.camera.rotateZ(0.03);
        }
        Engine.camera.rotateX(Engine.EventManager.mouse.diffY*0.0025);
        Engine.camera.rotateY(-Engine.EventManager.mouse.diffX*0.0025);
        /*
        if(Engine.isKeyDown("KEY_F1")){
            for(var key in Engine.ResourceManager.lights){Engine.ResourceManager.lights[key].constant -= 0.001;}
        }
        if(Engine.isKeyDown("KEY_F2")){
            for(var key in Engine.ResourceManager.lights){Engine.ResourceManager.lights[key].constant += 0.001;}
        }
        if(Engine.isKeyDown("KEY_F3")){
            for(var key in Engine.ResourceManager.lights){Engine.ResourceManager.lights[key].linear -= 0.001;}
        }
        if(Engine.isKeyDown("KEY_F4")){
            for(var key in Engine.ResourceManager.lights){Engine.ResourceManager.lights[key].linear += 0.001;}
        }
        if(Engine.isKeyDown("KEY_F5")){
            for(var key in Engine.ResourceManager.lights){Engine.ResourceManager.lights[key].exponent -= 0.001;}
        }
        if(Engine.isKeyDown("KEY_F6")){
            for(var key in Engine.ResourceManager.lights){Engine.ResourceManager.lights[key].exponent += 0.001;}
        }
        */
    }
})(this);