var Engine = Engine || {};
(function (scope, undefined){
    'use strict'; Engine.Game = {};
    
    Engine.Game.initResources = function(){
        var defiantMesh = new Mesh("Defiant","models/defiant.obj");
        var defiantMaterial = new Material("Defiant","models/defiant.png","models/defiant_Glow.png","models/defiant_Normal.png");
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
    }
    Engine.Game.update = function(dt){
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
    }
})(this);