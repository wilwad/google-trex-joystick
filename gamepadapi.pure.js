var haveEvents = 'ongamepadconnected' in window;
var controllers = {};
var interval;

function connecthandler(e) {
  addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;
  console.log('Controller', gamepad.index, 'Buttons: ', gamepad.buttons.length, 'Total Axes:',gamepad.axes.length);
  requestAnimationFrame(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  delete controllers[gamepad.index];
}

function updateStatus() {
  if (!haveEvents) {
    scangamepads();
  }

  var i = 0;
  var j;

  for (j in controllers) {
    var controller = controllers[j];

   // console.log('controller', j);
	
    for (i = 0; i < controller.buttons.length; i++) {
      var val = controller.buttons[i];
      var pressed = val == 1.0;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        val = val.value;
      }

      if (pressed) {
          console.log('controller:', j, 'button:', i, 'pressed:',pressed, 'value:',val);
 
          switch (i){
	      case 4:
	      case 5:
			keyboardEvent(38);
			break;

              case 9: /* start button */
				keyboardEvent(32); // SPACE
				break;
          }
      }
       	
    }

    for (i = 0; i < controller.axes.length; i++) {
        var fxd = controller.axes[i].toFixed(4);
      
		if (fxd != 0.0000) {
				console.log('Axes:', i, 'Value:', fxd);

				switch (i){
					case 0: /* left ~ right */
						  if (fxd == -1.0000) {
							  console.log('Axes left');
							  keyboardEvent(37);
							  //key[37] = true;
						  }
						  if (fxd == 1.0000) {
							  console.log('Axes right');
							  keyboardEvent(39);
							  //key[39] = true;
						   }
					  break;

					case 1: /* up ~ down */
						  if (fxd == -1.0000) {
							 console.log('Axes up');
							 keyboardEvent(38);
							 //key[38] = true;
						  }
						  if (fxd == 1.0000) {
							  console.log('Axes down');
							  keyboardEvent(40);
							  //key[40] = true;
						   }
					  break;
				}
		}
    }
  }

  requestAnimationFrame(updateStatus);
}

/* var event = document.createEvent('Event'); event.initEvent('keydown', true, true); event.keyCode = 32; */
function keyboardEvent(keyCode, down) {
    var dir = 'down';//!down ? 'down' : 'up';
    let el = document;//.querySelector('.interstitial-wrapper');

    if (!keyCode) return;

    if(document.createEventObject) {
	console.log('creating keyboard Event #1');
        var eventObj = document.createEventObject();
        eventObj.keyCode = keyCode;
        el.fireEvent("onkeydown", eventObj);
        eventObj.keyCode = keyCode;   
        console.log('createEvent keyDown');
        
        el.fireEvent("onkeyup", eventObj);
        eventObj.keyCode = keyCode;         
        console.log('createEvent keyUp');

    } else if(document.createEvent) {
	console.log('creating keyboard Event #2');

        var eventObj = document.createEvent("Events");
		/*
		eventObj.initEvent("keydown", true, true);
		eventObj.which = keyCode; 
		eventObj.keyCode = keyCode;
		el.dispatchEvent(eventObj);*/
		
		eventObj.initEvent("keydown", true, true);
		eventObj.which = keyCode; 
		eventObj.keyCode = keyCode;
		el.dispatchEvent(eventObj);
		console.log('keydown', keyCode);

		switch (keyCode){
			case 13:
			case 32:
			case 40:
			window.setTimeout(function(){
						eventObj.initEvent("keyup", true, true);
						eventObj.which = keyCode; 
						eventObj.keyCode = keyCode;
						el.dispatchEvent(eventObj);  
						console.log('keyup', keyCode);
					}, 40);
		}

    }
}

function scangamepads() {
  clearInterval(interval);

  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (gamepads[i].index in controllers) {
        controllers[gamepads[i].index] = gamepads[i];
      } else {
        addgamepad(gamepads[i]);
      }
    }
  }
}

window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

if (!haveEvents) {
  interval = setInterval(scangamepads, 500);
}
