'use strict';

var Material = function(name,diffuseFile,glowFile,normalFile){
    if(name in Engine.ResourceManager.materials){ return undefined; }

    this.diffuse = new Texture(diffuseFile,diffuseFile);
    this.glow = new Texture(glowFile,glowFile);
    this.normal = new Texture(normalFile,normalFile);
	
	this.color = vec4.fill(1,1,1,1);
	this.ambient = vec4.fill(0.05,0.05,0.05,1.0);
	this.specular = vec4.fill(1.0,1.0,1.0,1.0);
	this.shininess = 1.0;
	
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
	
	//gl.uniform1f(gl.getUniformLocation(program, "MaterialShininess"), this.shininess);
	gl.uniform4f(gl.getUniformLocation(program, "MaterialSpecular"), this.specular[0],this.specular[1],this.specular[2],this.specular[3]);
	//gl.uniform4f(gl.getUniformLocation(program, "MaterialAmbient"), this.ambient[0],this.ambient[1],this.ambient[2],this.ambient[3]);
	//gl.uniform4f(gl.getUniformLocation(program, "MaterialColor"), this.color[0],this.color[1],this.color[2],this.color[3]);
}