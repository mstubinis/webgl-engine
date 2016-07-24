'use strict';

var Material = function(name,diffuseFile,glowFile,normalFile){
    if(name in Engine.ResourceManager.materials){ return undefined; }

    this.diffuse = new Texture(diffuseFile,diffuseFile);
    this.glow = new Texture(glowFile,glowFile);
    this.normal = new Texture(normalFile,normalFile);
	
	this.color = vec3.fill(1.0,1.0,1.0);
	this.specular = vec3.fill(1.0,1.0,1.0);
	this.shininess = 50.0;
	this.transparency = 1.0;
	
    Engine.ResourceManager.materials[name] = this;
}; 
Material.prototype.sendUniforms = function(program){
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.diffuse.texture);
    gl.uniform1i(gl.getUniformLocation(program, "diffuseMap"), 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.glow.texture);
    gl.uniform1i(gl.getUniformLocation(program, "glowMap"), 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.normal.texture);
    gl.uniform1i(gl.getUniformLocation(program, "normalMap"), 2);
	
	gl.uniform4f(gl.getUniformLocation(program, "MaterialColor"), this.color[0],this.color[1],this.color[2],this.transparency);
	gl.uniform4f(gl.getUniformLocation(program, "MaterialSpecularity"), this.specular[0],this.specular[1],this.specular[2],this.shininess);
}