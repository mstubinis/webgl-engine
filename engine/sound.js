'use strict';

var Sound = function(name,url){
    if(name in Engine.ResourceManager.sounds){ return Engine.ResourceManager.sounds[name]; }
    var _this = this;
    _this.loaded = false;
    _this.volume = 1.0;
    _this.loadSoundEffect(name,url,_this);
    
    Engine.ResourceManager.sounds[name] = _this;
};
Sound.prototype.setPosition = function(x,y,z){
    this.position = vec3.fill(x,y,z);
    this.range = 25;
    this.falloff = 10;
}
Sound.prototype.update = function(dt){
    if(this.position !== undefined){
        var dist = vec3.distance(this.position,Engine.camera.position());
        if(dist > this.falloff){
            this.volume = vec3.distance(this.position,Engine.camera.position()) / this.range;
        }
        else{
            this.volume = 1.0;
        }
    }
}
Sound.prototype.loadSoundEffect = function(name,url,_this) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function(){
        Engine.SoundManager.context.decodeAudioData(request.response, function(buffer) {
            _this.buffer = buffer;
            _this.loaded = true;
            if(Engine.ResourceManager.checkIfAllResourcesAreLoaded()){
                Engine.onResourcesLoaded();
            }
        }, function(){/*on error function */});
    }
    request.send();
};
Sound.prototype.play = function(time,volume){
    time = time || 0.0;
    this.volume = volume || this.volume;
    
    var source = Engine.ResourceManager.context.createBufferSource();
    source.buffer = this.buffer;
    
    var gainNode = Engine.ResourceManager.context.createGain();
    source.connect(gainNode);
    gainNode.connect(Engine.ResourceManager.context.destination);
    gainNode.gain.value = this.volume;
    
    source.connect(Engine.ResourceManager.context.destination);
    source.start(time);
};