'use strict';
var Engine = Engine || {};
(function (scope, undefined){
    Engine.SoundManager = {};

    Engine.SoundManager.init = function(){
        try {
            window.AudioContext = window.AudioContext||window.webkitAudioContext;
            Engine.SoundManager.context = new AudioContext();
        }
        catch(e) {
            alert('Web Audio API is not supported in this browser');
        }
    };
})(this);
