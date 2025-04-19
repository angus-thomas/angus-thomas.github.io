"use strict";
const SPEED = 50 * 0.001;
const WALK_ANIMATION_FRAMES = [
	"0 -100px",
	"-100px -100px",
	"-200px -100px",
	"-300px -100px",
	"-400px -100px",
	"-300px -100px",
	"-200px -100px",
	"-100px -100px",
]

class Cat {
	
	constructor(elem) {
		/**
		 * @type {HTMLElement}
		 */
		this.elem = elem;
		
		// Set the element to absolute position
		const br = this.elem.getBoundingClientRect();
		elem.style.position = "absolute";
		this.setPosition(br.x, br.y);
		
		this.moving = false;
		this.moveAnimationIndex = 0;
		
	}
	
	setPosition(x, y) {
		this.x = x;
		this.y = y;
		this.elem.style.left = parseInt(this.x) - 25 + "px";
		this.elem.style.top = parseInt(this.y) - 25 + "px";
	}
	
	move(x, y) {
		this.targetX = x - 25;
		this.targetY = y - 25;
		
		if (!this.moving) {
			const boundMoveImpl = this.moveImpl.bind(this);
			this.then = Date.now();
			this.moving = true;
			this.moveInterval = setInterval(boundMoveImpl, 150);
		}
	}
	
	/**
	 * @param {Cat} self
	 */
	moveImpl() {
		const self = this;
		// Determine the time step
		var now = Date.now();
		const dt = now - self.then;
		self.then = now;
		
		// Move the cat towards the target
		const step = SPEED * dt;
		const dx = self.targetX - self.x;
		const dy = self.targetY - self.y;
		
		// Turn the cat
		if (dx > 0) {
			this.elem.style.transform = "scaleX(-1)";
		} else {
			this.elem.style.transform = "";
		}
		// Step up the animation index
		this.moveAnimationIndex = (this.moveAnimationIndex + 1) % WALK_ANIMATION_FRAMES.length;
		this.elem.style.backgroundPosition = WALK_ANIMATION_FRAMES[this.moveAnimationIndex];
		
		if (dx * dx + dy * dy <= step * step) {
			self.setPosition(self.targetX, self.targetY);
			
			// Stop calling the move function
			self.moving = false;
			clearInterval(self.moveInterval);
			
		} else {
			// Move the cat an increment
			const targetDistance = Math.sqrt(dx * dx + dy * dy);
			self.setPosition(self.x + step / targetDistance * dx, self.y + step / targetDistance * dy);
		}
	}
}


const cat = new Cat(document.getElementById("cat"));
document.body.addEventListener('click', (event) => {
	const x = event.pageX;
	const y = event.pageY;
	cat.move(x, y);
});