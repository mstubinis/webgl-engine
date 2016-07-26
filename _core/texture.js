'use strict';

var Texture = function(name,file){
    if(name in Engine.ResourceManager.textures){ return Engine.ResourceManager.textures[name]; }
    var _this = this;
    _this.loaded = false;
    if(typeof file == "string"){
        _this.texture = _this.load(_this,file);
    }
    else{//cubemap
        _this.texture = gl.createTexture();
        _this.loadingCount = 0;
        gl.bindTexture(gl.TEXTURE_CUBE_MAP,_this.texture);
        for(var i = 0; i < 6; i++){(function(_i){
            var img = new Image();
            img.src = file[_i];
            img._i = _i;
            img._ext = Engine.getExtension(file[_i]);
            img.onload = function() {
                _this.onloadcubemap(_this,img);
            }
        })(i);}
    }
    Engine.ResourceManager.textures[name] = _this;
}; 
Texture.prototype.onload = function(img,textureMount,extension){
    gl.bindTexture(gl.TEXTURE_2D, textureMount);
    
    var buffType = gl.RGBA;
    if(extension == "jpg" || extension == "jpeg")
        buffType = gl.RGB;
    gl.texImage2D(gl.TEXTURE_2D, 0, buffType, buffType, gl.UNSIGNED_BYTE, img);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.loaded = true;
    
    if(Engine.ResourceManager.checkIfAllResourcesAreLoaded()){
        Engine.onResourcesLoaded();
    }
}
Texture.prototype.onloadcubemap = function(_this,img){
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, _this.texture);

    var buffType = gl.RGBA;
    if(img._ext == "jpg" || img._ext == "jpeg")
        buffType = gl.RGB;
    
    
    if(img._i == 0){    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, buffType, buffType, gl.UNSIGNED_BYTE, img); }//font
    else if(img._i==1){ gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, buffType, buffType, gl.UNSIGNED_BYTE, img); }//back
    else if(img._i==2){ gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, buffType, buffType, gl.UNSIGNED_BYTE, img); }//left
    else if(img._i==3){ gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, buffType, buffType, gl.UNSIGNED_BYTE, img); }//right
    else if(img._i==4){ gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, buffType, buffType, gl.UNSIGNED_BYTE, img); }//top
    else if(img._i==5){ gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, buffType, buffType, gl.UNSIGNED_BYTE, img); }//bottom
    _this.loadingCount++;
    
    if(_this.loadingCount == 6){
        gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        _this.loaded = true;
        delete _this.loadingCount; delete img._ext; delete img._i;
        if(Engine.ResourceManager.checkIfAllResourcesAreLoaded()){
            Engine.onResourcesLoaded();
        }
    }
}
Texture.prototype.load = function(_this,file){
    var textureMount = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureMount);
    
    var buffType = gl.RGBA;
    var extension = Engine.getExtension(file);
    if(extension == "jpg" || extension == "jpeg")
        buffType = gl.RGB;
    gl.texImage2D(gl.TEXTURE_2D, 0, buffType, 1, 1, 0,buffType, gl.UNSIGNED_BYTE, null);
    
    
    var image = new Image();
    image.src = file;
    image.onload = function() { 
        _this.onload(image, textureMount,extension);
    }
    return textureMount;
}