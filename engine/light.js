'use strict';
var Light = function(n,type,scene){
    if(scene === undefined){
        if(n in Engine.scene.lights){ return Engine.scene.lights[n]; }
    }else{
        if(n in Engine.ResourceManager.scenes[scene].lights){ return Engine.ResourceManager.scenes[scene].lights[n]; }
    } 
    this._position = vec3.fill(0,0,0);
    
    
    if(type === undefined){ type = 1.0; }
    
    this.w = type; //0 means dir light, 1 means point light
    
    this.modelMatrix = mat4.create();
    this.rotation = quat.fill(0,0,0,1);
    this.scale = vec3.fill(1,1,1);
    
    this.color = vec3.fill(1,1,1);
    this.specularColor = vec3.fill(1,1,1);
    this.brightness = 1.0;
    this.specularPower = 1.0;
    this.diffusePower = 1.0;
    this.ambientPower = 1.0;
    
    this.constant = 0.3;
    this.linear = 0.2;
    this.exponent = 0.3;
    
    if(scene === undefined){
        this.id = Object.keys(Engine.scene.lights).length;
    }else{
        this.id = Object.keys(Engine.ResourceManager.scenes[scene].lights).length;
    }

    //this is important
    var shader = Engine.ResourceManager.shaders["Default"].program;
    var lightLocations = [
      "LightProperties",
      "LightColor",
      "LightColorSpecular",
      "LightPosition",
      "LightAttenuation"
    ];
    var locations = {};
    for (var i = 0; i < lightLocations.length; ++i){
        if(scene === undefined){
            var l = Object.keys(Engine.scene.lights).length;
            var str = "lights[" + l + "]." + lightLocations[i];
            locations[lightLocations[i]] = str;
        }else{
            var l = Object.keys(Engine.ResourceManager.scenes[scene].lights).length;
            var str = "lights[" + l + "]." + lightLocations[i];
            locations[lightLocations[i]] = str;
        }
    }
    this.uniforms = locations;
    //

    if(scene === undefined){
        Engine.GameObjectManager.addObjectToDictionary(n,this,Engine.scene,"lights");
    }else{
        Engine.GameObjectManager.addObjectToDictionary(n,this,Engine.ResourceManager.scenes[scene],"lights");
    }
}
Light.prototype.sendUniforms = function(shader){
    var pos = this.position();
    if(this.w != 0.0){ //point light
        gl.uniform3f(gl.getUniformLocation(shader,this.uniforms["LightAttenuation"]), this.constant,this.linear,this.exponent);
    }else{//dir light
    }
    gl.uniform3f(gl.getUniformLocation(shader,this.uniforms["LightPosition"]), pos[0],pos[1],pos[2]);
    var r = this.color[0] * this.brightness;
    var g = this.color[1] * this.brightness;
    var b = this.color[2] * this.brightness;
    
    var sr = this.specularColor[0] * this.brightness;
    var sg = this.specularColor[1] * this.brightness;
    var sb = this.specularColor[2] * this.brightness;
    
    gl.uniform3f(gl.getUniformLocation(shader,this.uniforms["LightColor"]), r, g, b);
    gl.uniform3f(gl.getUniformLocation(shader,this.uniforms["LightColorSpecular"]), sr, sg, sb);
    gl.uniform4f(gl.getUniformLocation(shader,this.uniforms["LightProperties"]),this.ambientPower,this.diffusePower,this.specularPower,this.w);
}
Light.prototype.translate = function(x,y,z) {
    Engine.GameObjectManager.translate(this,x,y,z);
};
Light.prototype.scale = function(x,y,z){
    Engine.GameObjectManager.scale(this,x,y,z);
}
Light.prototype.setScale = function(x,y,z){
    Engine.GameObjectManager.setScale(this,x,y,z);
}
Light.prototype.update = function(dt){
    Engine.GameObjectManager.update(this);
}
Light.prototype.setPosition = function(x,y,z,w){
    if(w !== undefined)
        this.w = w;
    Engine.GameObjectManager.setPosition(this,x,y,z);
    this.update(Engine.dt);
}
Light.prototype.rotate = function(x,y,z){
    Engine.GameObjectManager.rotate(this,x,y,z);
}
Light.prototype.rotateX = function(x){ this.rotate(x,0,0); }
Light.prototype.rotateY = function(y){ this.rotate(0,y,0); }
Light.prototype.rotateZ = function(z){ this.rotate(0,0,z); }
    
Light.prototype.up = function(){ return Engine.GameObjectManager.up(this); }
Light.prototype.right = function(){ return Engine.GameObjectManager.right(this); }
Light.prototype.forward = function(){ return Engine.GameObjectManager.forward(this); }
Light.prototype.position = function(){ return Engine.GameObjectManager.position(this); }