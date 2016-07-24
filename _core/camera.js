'use strict';
var Camera = function(name,width,height,scene){
	if(scene === undefined){
		if(name in Engine.scene.cameras){ return undefined; }
	}
	else{
		if(name in Engine.ResourceManager.scenes[scene].cameras){ return undefined; }
	}
    
    this.modelMatrix = mat4.create();
    this._position = vec3.fill(0,0,-9);
    this.rotation = quat.fill(0,0,0,1);
    this.viewMatrix = mat4.create();
    this.projectionMatrix = mat4.create();
    
    //6 vec4's describing the viewing frustrum
    this.planes = [vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create()];
    
    var w = width || Math.floor(window.innerWidth * 1.0);
    var h = height || Math.floor(window.innerHeight * 1.0); 
    
    this.angle = 45.0;
    this.ratio = w/h;
    this.near = 0.001;
    this.far = 10000.0;
    
    this.resize(w,h);
	this.update(Engine.dt);
    this.lookAt(this.position(),this.target(),this.up());
	
	if(scene === undefined)
		Engine.scene.cameras[name] = this;
	else
		Engine.ResourceManager.scenes[scene].cameras[name] = this;
	
	if(!Engine.hasOwnProperty('camera')){ Engine.camera = this; }
};
Camera.prototype.constructFrustrum = function(){
    var mat4_vp = mat4.create(); mat4.mul(mat4_vp,this.viewMatrix,this.projectionMatrix);
    var rowX = mat4.row(mat4_vp,0);
    var rowY = mat4.row(mat4_vp,1);
    var rowZ = mat4.row(mat4_vp,2);
    var rowW = mat4.row(mat4_vp,3);
    
    var rowWPlusRowX = vec4.create(); vec4.add(rowWPlusRowX,rowW,rowX);
    var rowWMinusRowX = vec4.create(); vec4.sub(rowWMinusRowX,rowW,rowX);
    var rowWPlusRowY = vec4.create(); vec4.add(rowWPlusRowY,rowW,rowY);
    var rowWMinusRowY = vec4.create(); vec4.sub(rowWMinusRowY,rowW,rowY);
    var rowWPlusRowZ = vec4.create(); vec4.add(rowWPlusRowZ,rowW,rowZ);
    var rowWMinusRowZ = vec4.create(); vec4.sub(rowWMinusRowZ,rowW,rowZ);

    vec4.normalize(rowWPlusRowX,rowWPlusRowX);
    vec4.normalize(rowWMinusRowX,rowWMinusRowX);
    vec4.normalize(rowWPlusRowY,rowWPlusRowY);
    vec4.normalize(rowWMinusRowY,rowWMinusRowY);
    vec4.normalize(rowWPlusRowZ,rowWPlusRowZ);
    vec4.normalize(rowWMinusRowZ,rowWMinusRowZ);
	
    this.planes[0]=rowWPlusRowX;
    this.planes[1]=rowWMinusRowX;
    this.planes[2]=rowWPlusRowY;
    this.planes[3]=rowWMinusRowY;
    this.planes[4]=rowWPlusRowZ;
    this.planes[5]=rowWMinusRowZ;

    for(var i = 0; i < 6; i++){
        var normal = vec3.fill(this.planes[i][0], this.planes[i][1], this.planes[i][2]);
        this.planes[i][0] = -this.planes[i][0] / vec3.length(normal);
        this.planes[i][1] = -this.planes[i][1] / vec3.length(normal);
        this.planes[i][2] = -this.planes[i][2] / vec3.length(normal);
    }
}
Camera.prototype.sphereIntersectTest = function(pos,radius){
    if(radius <= 0){
		return false;
	}
    for (var i = 0; i < 6; i++){
        var dist = this.planes[i][0] * pos[0] + this.planes[i][1] * pos[1] + this.planes[i][2] * pos[2] + this.planes[i][3] - radius;
		document.getElementById("canvasDebug").innerHTML = dist;
		if (dist > 0){
			return false;
		}
    }
    return true;
}
Camera.prototype.resize = function(width,height){
    this.ratio = width/height;
    mat4.perspective(this.projectionMatrix,(this.angle * 0.0174533),width/height,this.near,this.far);
}
Camera.prototype.perspective = function(angle,ratio,near,far){
    this.angle = angle;  this.ratio = -ratio;  this.near = near;  this.far = far;
    mat4.perspective(this.projectionMatrix,(angle * 0.0174533),ratio,near,far);
}
Camera.prototype.ortho = function(left,right,bottom,top,near,far){
    mat4.ortho(this.projectionMatrix,left,right,bottom,top,near,far);
}
Camera.prototype.lookAt = function(eyeX,eyeY,eyeZ,centerX,centerY,centerZ,upX,upY,upZ){
    if(centerX == undefined && centerY == undefined && centerZ == undefined && upX == undefined && upY == undefined && upZ == undefined){
        this._position = eyeX;
        mat4.lookAt(this.viewMatrix,eyeX,eyeY,eyeZ);
		this.constructFrustrum();
        return;
    }
    var vec3_eye = vec3.fill(eyeX,eyeY,eyeZ);
    var vec3_center = vec3.fill(centerX,centerY,centerZ);
    var vec3_up = vec3.fill(upX,upY,upZ);
    this._position = vec3_eye;
    mat4.lookAt(this.viewMatrix,vec3_eye,vec3_center,vec3_up);
	this.constructFrustrum();
}
Camera.prototype.translate = function(x,y,z){
    Engine.GameObjectManager.translate(this,x,y,z);
    this.update(Engine.dt);
    this.lookAt(this.position(),this.target(),this.up());
}
Camera.prototype.setPosition = function(x,y,z){
    Engine.GameObjectManager.setPosition(this,x,y,z);
    this.update(Engine.dt);
    this.lookAt(this.position(),this.target(),this.up());
}
Camera.prototype.update = function(dt){
    mat4.identity(this.modelMatrix);
    mat4.translate(this.modelMatrix,this.modelMatrix,this._position);
    var mat4FromQuat = mat4.create();
    mat4.fromQuat(mat4FromQuat,this.rotation)
    mat4.mul(this.modelMatrix,this.modelMatrix,mat4FromQuat);
}
Camera.prototype.rotate = function(x,y,z){
    Engine.GameObjectManager.rotate(this,x,y,z);
    this.update(Engine.dt);
    this.lookAt(this.position(),this.target(),this.up());
}
Camera.prototype.rotateX = function(x){ this.rotate(x,0,0); }
Camera.prototype.rotateY = function(y){ this.rotate(0,y,0); }
Camera.prototype.rotateZ = function(z){ this.rotate(0,0,z); }

Camera.prototype.up = function(){ return Engine.GameObjectManager.up(this); }
Camera.prototype.right = function(){ return Engine.GameObjectManager.right(this); }
Camera.prototype.forward = function(){ return Engine.GameObjectManager.forward(this); }
Camera.prototype.position = function(){ return Engine.GameObjectManager.position(this); }
Camera.prototype.target = function(){var ret = vec3.create();vec3.sub(ret,this.position(),this.forward());return ret;}