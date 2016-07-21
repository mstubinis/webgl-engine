var Engine = Engine || {};
(function (scope, undefined){
    'use strict';
    Engine.EventManager = {};
    Engine.EventManager.touch = {
        zoom1: vec2.zero(),
        zoom2: vec2.zero(),
        prevZoom1: vec2.zero(),
        prevZoom2: vec2.zero()  
    };
    Engine.EventManager.mouse = {
        x: 0,
        y: 0,
        pX: 0,
        pY: 0,
        diffX: 0,
        diffY: 0,
        wheel: 0,
        inBounds: true,
        state: "N/A"
    };
    Engine.EventManager.keyboard = {
        currentKey: -1,
        prevKey: -1,
        state: "N/A",
        key: {},
        map: {
            KEY_UP: '38',
            KEY_DOWN: '40',
            KEY_LEFT: '37',
            KEY_RIGHT: '39',
            KEY_SPACE: '32',
            KEY_W: '87',
            KEY_S: '83',
            KEY_A: '65',
            KEY_D: '68',
            KEY_Q: '81',
            KEY_E: '69',
            KEY_ENTER: '13',
            KEY_Z: '90',
            KEY_X: '88',
            KEY_C: '67',
            KEY_R: '82',
            KEY_F: '70',
            KEY_V: '86',
            KEY_T: '84',
            KEY_G: '71',
            KEY_B: '66',
            KEY_Y: '89',
            KEY_H: '72',
            KEY_N: '78',
            KEY_U: '85',
            KEY_J: '74',
            KEY_M: '77',
            KEY_I: '73',
            KEY_K: '75',
            KEY_O: '79',
            KEY_L: '76',
            KEY_P: '80',
            KEY_TAB: '9',
            KEY_ESC: '27',
            KEY_SHIFT: '16',
            KEY_CTRL: '17',
            KEY_ALT: '18',
            KEY_LEFT_WINDOW: '91',
            KEY_RIGHT_WINDOW: '92',
            KEY_SELECT: '93',
            KEY_BACKSPACE: '8',
            KEY_LEFTBRACKET: '219',
            KEY_RIGHTBRACKET: '221',
            KEY_MINUS: '189',
            KEY_PLUS: '187',
            KEY_TILDA: '192',
            KEY_ZERO: '48',
            KEY_ONE: '49',
            KEY_TWO: '50',
            KEY_THREE: '51',
            KEY_FOUR: '52',
            KEY_FIVE: '53',
            KEY_SIX: '54',
            KEY_SEVEN: '55',
            KEY_EIGHT: '56',
            KEY_NINE: '57',
            KEY_NUMPAD_ZERO: '96',
            KEY_NUMPAD_ONE: '97',
            KEY_NUMPAD_TWO: '98',
            KEY_NUMPAD_THREE: '99',
            KEY_NUMPAD_FOUR: '100',
            KEY_NUMPAD_FIVE: '101',
            KEY_NUMPAD_SIX: '102',
            KEY_NUMPAD_SEVEN: '103',
            KEY_NUMPAD_EIGHT: '104',
            KEY_NUMPAD_NINE: '105',
            KEY_NUMLOCK: '144',
            KEY_DIVIDE: '111',
            KEY_MULTIPLY: '106',
            KEY_SUBTRACT: '109',
            KEY_ADD: '107',
            KEY_INSERT: '45',
            KEY_DELETE: '46',
            KEY_HOME: '36',
            KEY_END: '35',
            KEY_PAGEUP: '33',
            KEY_PAGEDOWN: '34',
            KEY_SCROLLLOCK: '145',
            KEY_PAUSE: '19',
            KEY_BREAK: '19',
            KEY_F1: '112',
            KEY_F2: '113',
            KEY_F3: '114',
            KEY_F4: '115',
            KEY_F5: '116',
            KEY_F6: '117',
            KEY_F7: '118',
            KEY_F8: '119',
            KEY_F9: '120',
            KEY_F10: '121',
            KEY_F11: '122',
            KEY_F12: '123',
            KEY_SEMICOLON: '186',
            KEY_COLON: '186',
            KEY_QUOTE: '222',
            KEY_APOSTROPHE: '222',
            KEY_COMMA: '188',
            KEY_PERIOD: '190',
            KEY_QUESTIONMARK: '191',
            KEY_FORWARDSLASH: '191',
            KEY_PIPE: '220',
            KEY_FORWARDSLASH: '220'
        }
    };
    Engine.EventManager.isKeyDown = function(k){ return Engine.EventManager.keyboard.key[Engine.EventManager.keyboard.map[k]] || false; }
    Engine.EventManager.isKeyUp = function(k){ return (!Engine.EventManager.keyboard.key[Engine.EventManager.keyboard.map[k]]) || true; }
    Engine.EventManager.updateMouseCoords = function(x,y){
        Engine.EventManager.mouse.pX = Engine.EventManager.mouse.x;
        Engine.EventManager.mouse.pY = Engine.EventManager.mouse.y;
        Engine.EventManager.mouse.x = x;
        Engine.EventManager.mouse.y = y;
        
        Engine.EventManager.mouse.diffX = Engine.EventManager.mouse.x - Engine.EventManager.mouse.pX;
        Engine.EventManager.mouse.diffY = Engine.EventManager.mouse.y - Engine.EventManager.mouse.pY;
    }
    Engine.EventManager.update = function(){
        if(Math.abs(Engine.EventManager.mouse.diffX) > 0){
            Engine.EventManager.mouse.diffX *= 0.7; if(Math.abs(Engine.EventManager.mouse.diffX) < 0.01){ Engine.EventManager.mouse.diffX = 0; }
        }
        if(Math.abs(Engine.EventManager.mouse.diffY) > 0){
            Engine.EventManager.mouse.diffY *= 0.7; if(Math.abs(Engine.EventManager.mouse.diffY) < 0.01){ Engine.EventManager.mouse.diffY = 0; }
        }
        if(Math.abs(Engine.EventManager.mouse.wheel) > 0){
            Engine.EventManager.mouse.wheel *= 0.7; if(Math.abs(Engine.EventManager.mouse.wheel) < 0.01){ Engine.EventManager.mouse.wheel = 0; }
        }
    }
    Engine.EventManager.init = function(canvas,canvasEventCatcher){
        canvasEventCatcher.addEventListener('touchstart',function(e){
            var e = window.event || e;
            switch(e.touches.length){
                case 1:
                    Engine.EventManager.mouse.x = e.touches[0].clientX;
                    Engine.EventManager.mouse.y = e.touches[0].clientY;
                    Engine.EventManager.mouse.pX = e.touches[0].clientX;
                    Engine.EventManager.mouse.pY = e.touches[0].clientY;
                    break;
                case 2:
                    Engine.EventManager.touch.prevZoom1 = vec2.fill(e.touches[0].clientX,e.touches[0].clientY);
                    Engine.EventManager.touch.prevZoom2 = vec2.fill(e.touches[1].clientX,e.touches[1].clientY);
                    Engine.EventManager.touch.zoom1 = vec2.fill(e.touches[0].clientX,e.touches[0].clientY);
                    Engine.EventManager.touch.zoom2 = vec2.fill(e.touches[1].clientX,e.touches[1].clientY);
                    break;
                default:
                    break;  
            }
            Engine.EventManager.mouse.wheel = 0;
                    
            Engine.EventManager.mouse.state = "down";
            Engine.EventManager.mouse.inBounds = true;
        });
        canvasEventCatcher.addEventListener('touchmove',function(e){
            var e = window.event || e;
            e.preventDefault();
            e.stopPropagation();
            switch(e.touches.length){
                case 1:
                    Engine.EventManager.updateMouseCoords(e.touches[0].clientX,e.touches[0].clientY);
                    Engine.EventManager.mouse.wheel = 0;
                    break;
                case 2://probably zoom
                    Engine.EventManager.touch.prevZoom1 = Engine.EventManager.touch.zoom1;
                    Engine.EventManager.touch.prevZoom2 = Engine.EventManager.touch.zoom2;
                    
                    Engine.EventManager.touch.zoom1 = vec2.fill(e.touches[0].clientX,e.touches[0].clientY);
                    Engine.EventManager.touch.zoom2 = vec2.fill(e.touches[1].clientX,e.touches[1].clientY);
                    
                    var y2 = Engine.EventManager.touch.zoom2[1]; var x2 = Engine.EventManager.touch.zoom2[0];
                    var y1 = Engine.EventManager.touch.zoom1[1]; var x1 = Engine.EventManager.touch.zoom1[0];
                    
                    var _y2 = Engine.EventManager.touch.prevZoom2[1]; var _x2 = Engine.EventManager.touch.prevZoom2[0];
                    var _y1 = Engine.EventManager.touch.prevZoom1[1]; var _x1 = Engine.EventManager.touch.prevZoom1[0];
                    
                    var x2Mx1 = (x2 - x1); x2Mx1*=x2Mx1; var y2My1 = (y2 - y1); y2My1*=y2My1;   
                    var _x2Mx1 = (_x2 - _x1); _x2Mx1*=_x2Mx1; var _y2My1 = (_y2 - _y1); _y2My1*=_y2My1;
                    
                    var prevDiameter = Math.sqrt(x2Mx1 + y2My1);
                    var currDiameter = Math.sqrt(_x2Mx1 + _y2My1);
                    var sizeDiff = currDiameter - prevDiameter;
                    Engine.EventManager.mouse.wheel = -(sizeDiff * 0.1);    
                    break;
                default:
                    break;
            }
            Engine.EventManager.mouse.state = "down";
            Engine.EventManager.mouse.inBounds = true;
        });
        canvasEventCatcher.addEventListener('touchend',function(e){
            var e = window.event || e;
            switch(e.touches.length){
                case 0:
                    break;
                case 1:
                    Engine.EventManager.updateMouseCoords(e.touches[0].clientX,e.touches[0].clientY);
                    break;
                default:
                    break;
            }
            Engine.EventManager.mouse.wheel = 0;
            
            Engine.EventManager.mouse.state = "up";
        });
        canvasEventCatcher.addEventListener('mousedown',function(e){
            var e = window.event || e;
            Engine.EventManager.updateMouseCoords(e.x,e.y);
            Engine.EventManager.mouse.state = "down";
        });
        canvasEventCatcher.addEventListener('mouseup',function(e){
            var e = window.event || e;
            Engine.EventManager.updateMouseCoords(e.x,e.y);
            Engine.EventManager.mouse.state = "up";
        });
        canvasEventCatcher.addEventListener('mousemove',function(e){
            var e = window.event || e;
            e.stopPropagation();
            e.preventDefault();
            Engine.EventManager.updateMouseCoords(e.x,e.y);
        });
        canvasEventCatcher.addEventListener('mousewheel',function(e){
            var e = window.event || e;
            e.stopPropagation();
            e.preventDefault();
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            Engine.EventManager.mouse.wheel = delta;
        });
        canvasEventCatcher.addEventListener('DOMMouseScroll',function(e){
            var e = window.event || e;
            e.stopPropagation();
            e.preventDefault();
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            Engine.EventManager.mouse.wheel = delta;
        });
        canvasEventCatcher.addEventListener('mouseover',function(e){
            var e = window.event || e;
            e.stopPropagation();
            e.preventDefault();
            Engine.EventManager.mouse.inBounds = true;
        });
        canvasEventCatcher.addEventListener('mouseout',function(e){
            var e = window.event || e;
            e.stopPropagation();
            e.preventDefault();
            Engine.EventManager.mouse.inBounds = false;
        });
        canvasEventCatcher.addEventListener('keydown',function(e){
            var e = window.event || e;
            e.preventDefault();
            Engine.EventManager.keyboard.key[e.keyCode] = true;
            Engine.EventManager.keyboard.state = "down";
        });
        canvasEventCatcher.addEventListener('keyup',function(e){
            var e = window.event || e;
            e.preventDefault();
            Engine.EventManager.keyboard.key[e.keyCode] = false;
            Engine.EventManager.keyboard.state = "up";
        });
        canvasEventCatcher.addEventListener('focusout',function(e){
            var e = window.event || e;
            e.preventDefault();
            
            for(var k in Engine.EventManager.keyboard.key){
                Engine.EventManager.keyboard.key[k] = false;
            }
            Engine.EventManager.keyboard.state = "up";
            Engine.EventManager.mouse.state = "up";
        });
        //the hard part...
        if(window.DeviceOrientationEvent){
            canvasEventCatcher.addEventListener("deviceorientation",function(e){

            },true);
        }
        else if(window.DeviceMotionEvent){
            canvasEventCatcher.addEventListener('devicemotion',function(e){

            },true);
        } 
        else{
            canvasEventCatcher.addEventListener("MozOrientation",function(e){

            },true);
        }
    }
})(this);