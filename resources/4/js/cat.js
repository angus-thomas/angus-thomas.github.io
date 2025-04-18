"use strict";
const SPEED = 50 * 0.001;

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
	}
	
	setPosition(x, y) {
		this.x = x;
		this.y = y;
		this.elem.style.left = parseInt(this.x) - 25 + "px";
		this.elem.style.top = parseInt(this.y) - 25 + "px";
	}
	
	move(x, y) {
		this.targetX = x;
		this.targetY = y;
		
		if (!this.moving) {
			
			const boundMoveImpl = this.moveImpl.bind(this);
			this.then = Date.now();
			this.moveInterval = setInterval(boundMoveImpl, 300);
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
		if (dx * dx + dy * dy <= step * step) {
			self.setPosition(self.targetX, self.targetY);
			
			// Stop calling the move function
			self.moving = false;
			clearInterval(self.moveInterval);
			
		} else {
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