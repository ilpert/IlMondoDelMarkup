var Collision;

(function () {
    
    'use strict';

    Collision = {
        
        targetId: null,
        obstacles: [],
        
        /**
         * Probably your player. This is the thing we're going to check
         * to see if it's rubbed up against anything.
         * @param {string} id - the CSS id of your player/target.
         */
        setTargetId: function (id) {
            this.targetId = id;
        },
        
        /**
         * Updating this every frame is not required, only the first time
         * that obstacles are placed on the screen or whenever they are updated.
         * If you have stationary obstacles, this only needs to be run once :)
         * @param {string} selector - CSS class name to select.
         */
        updateObstacles: function (selector) {
            
            var i,
                elements = document.getElementsByClassName(selector),
                numElements = elements.length,
                obstacle;
            
            this.obstacles = [];
            
            for (i = 0; i < numElements; i++) {
                
                obstacle = {
                    'className': elements[i].className,
                    'rect': elements[i].getBoundingClientRect()
                };                
                this.obstacles.push(obstacle);
            }
        },
        
        /**
         * This should be run every frame in your game.
         * The compares the player position against known obstacles in your scene.
         * @return {array} collisions.
         */
        getCollisions: function () {
            
            var i,
                collision,
                collisions = [],
                horizontalEDiff,
                horizontalWDiff,
                numObstacles = this.obstacles.length,
                targetElement = document.getElementById(this.targetId).getBoundingClientRect(),
                touchingEast,
                touchingNorth,
                touchingSouth,
                touchingWest,
                obstacle,
                verticalBDiff,
                verticalTDiff;
            
            for (i = 0; i < numObstacles; i++) {

				horizontalEDiff = 0;
                horizontalWDiff = 0;
				touchingEast = false;
                touchingNorth = false;
                touchingSouth = false;
                touchingWest = false;
                verticalBDiff = 0;
                verticalTDiff = 0;
			
                obstacle = this.obstacles[i];
				
				// Is the target within the left and right area of the obstacle.
				if (targetElement.left + targetElement.width > obstacle.rect.left && targetElement.left < obstacle.rect.left + obstacle.rect.width) {
					
					verticalBDiff = obstacle.rect.top + obstacle.rect.height - targetElement.top;
					verticalTDiff = obstacle.rect.top - targetElement.top;

					if (verticalBDiff >= 0 && verticalBDiff < targetElement.height) {
						touchingSouth = true;
					} else if (verticalTDiff >= 0 && verticalTDiff < targetElement.height) {
						touchingNorth = true;
					}
					
					horizontalEDiff = obstacle.rect.left + obstacle.rect.width - targetElement.left;
					horizontalWDiff = obstacle.rect.left - targetElement.left;
				
					if (horizontalEDiff >= 0 && horizontalEDiff < targetElement.width) {
						touchingEast = true;
					} else if (horizontalWDiff >= 0 && horizontalWDiff < targetElement.width) {
						touchingWest = true;
					}
				}
				
                if (targetElement.left < obstacle.rect.left + obstacle.rect.width &&
                    targetElement.left + targetElement.width > obstacle.rect.left &&
                    targetElement.top < obstacle.rect.top + obstacle.rect.height &&
                    targetElement.height + targetElement.top > obstacle.rect.top) {

                    collision = {
                        'obstacle': obstacle,
                        'horizontalEDiff': horizontalEDiff,
                        'horizontalWDiff': horizontalWDiff,
                        'touchingEast': touchingEast,
                        'touchingNorth': touchingNorth,
                        'touchingSouth': touchingSouth,
                        'touchingWest': touchingWest,
                        'verticalBDiff': verticalBDiff,
                        'verticalTDiff': verticalTDiff
                    };
                    collisions.push(collision);
                }
            }
            return collisions;
        }
    };
}());