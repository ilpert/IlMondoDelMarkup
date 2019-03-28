$(function () {

    'use strict';

    var fps = 30, // Set frame rate.
		guyHeight = parseInt(guy.css('height')),
        cycleLength = Math.round(1000 / fps), // Length of one frame in ms.
        deltaTime = fps / 1000, // Length of one cycle in seconds.
        velocityScaler = 1, // Number to scale velocity with number of pixels.
        jumpVelocity = 6, // Jump velocity.
        moveVelocity = 6, // Walking velocity.
        verticalVelocity = 0,
        horizontalVelocity = 0,
        keyJump = 32,
        arrowLeft = 37,
        arrowUp = 38,
        arrowRight = 39,
        arrowDown = 40,
        currentLevel = 0,
	focused = true,
        resetPlayerPos = function () {
            horizontalVelocity = 0;
            verticalVelocity = 0;
            guy.css('top', '550px');
            guy.css('left', '100px');
        };


    // Keymap is used to keep track of which button currently pressed.
    // This allows for multiple keys to be registered at once.
    var keyMap = {
        up: false,
        left: false,
        right: false
    }

	$('#htmlcommand').blur(function(e) {
		console.log("blur");
		$('.overlay').fadeOut('fast');
		focused = true;
	});
	$('#htmlcommand').focus(function(e) {
		console.log("focus");
		$('.overlay').fadeIn('fast');
		focused = false;
	});

    // Watch for keydown event. Log key as pressed.
    $(document).keydown(function (e) {
        if ( !playable || !focused ) {
            return;
        }
        if (e.keyCode === arrowRight) {
            keyMap.right = true;

            if (keyMap.left) {
                keyMap.left = false;
            }
        } else if (e.keyCode === arrowLeft) {
            keyMap.left = true;

            if (keyMap.right) {
                keyMap.right = false;
            }
        } else if (e.keyCode === arrowUp || e.keyCode === keyJump) {
            keyMap.up = true;
        }
    });

    // Watch for keyup event. Log key as no longer pressed.
    $(document).keyup(function (e) {
        if (e.keyCode === arrowRight) {
            keyMap.right = false;
        } else if (e.keyCode === arrowLeft) {
            keyMap.left = false;
        } else if (e.keyCode === arrowUp || e.keyCode === keyJump) {
            keyMap.up = false;
        }
    });

    Collision.setTargetId('guy');

    setInterval(function () {

        Collision.updateObstacles('obstacle');

        var collisions = Collision.getCollisions(),
            i,
            isCollisionE = false,
            isCollisionN = false,
            isCollisionS = false,
            isCollisionW = false,
			numCollisions = [],
            obstacleBottom,
			obstacleTop;

        numCollisions = collisions.length;

        // Find out what they're touching.
        for (i = 0; i < numCollisions; i++) {

            // Did the player ded?
            if (collisions[i].obstacle.className.indexOf('deathfield') !== -1) {
                document.getElementById('death').play();
                resetPlayerPos();
                return;

            // Player touched friend!
            } else if (collisions[i].obstacle.className.indexOf('friend') !== -1) {
                localStorage.setItem('level', 0);
                $('#endstory').fadeIn(500);
                return;

            // Player beat the level!
            } else if (collisions[i].obstacle.className.indexOf('goal') !== -1) {
                document.getElementById('next_level').play();
                resetPlayerPos();
                stats.level++;
                localStorage.setItem("level", stats.level);
                resetPlayerPos();
                return;

            } else {
				// NOTE: The Collisions object checks for collisions against the
				// obstacles. What we want is to check for collision directions
				// against the target, instead.

                if (collisions[i].touchingSouth === true) {
                    isCollisionN = true;
                    obstacleBottom = Math.floor(collisions[i].obstacle.rect.top + collisions[i].obstacle.rect.height) + 1;
                }
                if (collisions[i].touchingNorth === true) {
                    isCollisionS = true;
					verticalVelocity = 0;
					obstacleTop = Math.floor(collisions[i].obstacle.rect.top) - guyHeight + 1;
				}
				if (collisions[i].touchingWest === true) {
                    isCollisionE = true;
                }
                if (collisions[i].touchingEast === true) {
                    isCollisionW = true;
                }

            }
        }

        // Standing on something.
        if (isCollisionS === true) {

            // Jump.
            if (keyMap.up === true) {
                document.getElementById('jump').play();
                verticalVelocity = jumpVelocity;
                guy.css('top', Math.floor(guy.offset().top + (-1 * velocityScaler * verticalVelocity)) + 'px');
			} else {
				// Snap the player to the top of the element they're standing on.
				guy.css('top', obstacleTop + 'px');
			}

        } else if (isCollisionN === true) {

            verticalVelocity = 0;
            guy.css('top', obstacleBottom + 'px');

        // Gravity calculated using vNew = vOld + (gravity * deltaTime).
        } else {
            verticalVelocity += -9.81 * deltaTime;
            guy.css('top', Math.floor(guy.offset().top + (-1 * velocityScaler * verticalVelocity)) + 'px');
        }

        // Move left.
        if (keyMap.left === true && (isCollisionW === false)) {
            horizontalVelocity = -1 * moveVelocity;
            guy.css('left', guy.offset().left + (velocityScaler * horizontalVelocity) + 'px');

        // Move right.
        } else if (keyMap.right === true && (isCollisionE === false)) {
            horizontalVelocity = moveVelocity;
            guy.css('left', guy.offset().left + (velocityScaler * horizontalVelocity) + 'px');
        }
    }, cycleLength);
});
