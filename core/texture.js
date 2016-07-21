'use strict';

var Texture = function(name,file){
	if(name in Engine.ResourceManager.textures){ return undefined; }
	var _this = this;
	_this.loaded = false;
	if(typeof file == "string"){
		_this.texture = _this.load(_this,file);
	}
	else{//cubemap
		_this.texture = gl.createTexture();
		_this.loadingCount = 0;
		gl.bindTexture(gl.TEXTURE_CUBE_MAP,_this.texture);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
		for(var i = 0; i < 6; i++){(function(_i){
			var img = new Image();
			img.src = file[_i];
			img._i = _i;
			img.onload = function() {
				_this.onloadcubemap(_this,img);
			}
		})(i);}
	}
	Engine.ResourceManager.textures[name] = _this;
}; 
Texture.prototype.onload = function(img,textureMount){
    gl.bindTexture(gl.TEXTURE_2D, textureMount);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
	this.loaded = true;
}
Texture.prototype.onloadcubemap = function(_this,img){
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, _this.texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
	if(img._i == 0){    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); }
	else if(img._i==1){ gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); }
	else if(img._i==2){ gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); }
	else if(img._i==3){ gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); }
	else if(img._i==4){ gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); }       
	else if(img._i==5){ gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); }
	_this.loadingCount++;
	
	if(_this.loadingCount == 6){
		_this.loaded = true;
		delete _this.loadingCount;
	}
}
Texture.prototype.load = function(_this,file){
    var textureMount = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureMount);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    var image = new Image();
	image.src = file;
    image.onload = function() { 
		_this.onload(image, textureMount);
	}
    return textureMount;
}