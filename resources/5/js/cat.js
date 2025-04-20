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
const SLEEP_ANIMATION_FRAME = "0 -200px";

const CatState = Object.freeze({
	ASLEEP: 0,
	IDLE: 1,
	WALKING: 2
});

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
		
		this.moveAnimationIndex = 0;
		
		this.sleepTImerSet = false;
		this.goToSleep();
	}
	
	setPosition(x, y) {
		this.x = x;
		this.y = y;
		this.elem.style.left = parseInt(this.x) - 25 + "px";
		this.elem.style.top = parseInt(this.y) - 25 + "px";
	}
	
	goToSleep() {
		this.preventSleep();
		this.state = CatState.ASLEEP;
		this.elem.style.backgroundPosition = SLEEP_ANIMATION_FRAME;
	}
	
	awake() {
		this.state = CatState.IDLE;
		this.elem.style.backgroundPosition = WALK_ANIMATION_FRAMES[this.moveAnimationIndex];
		this.queueSleep();
	}
	
	preventSleep() {
		if (this.sleepTImerSet) {
			clearInterval(this.sleepInterval);
		}
	}
	
	queueSleep() {
		this.preventSleep();
		this.sleepTImerSet = true;
		this.sleepInterval = setInterval(this.goToSleep.bind(this), 5000);
	}
	
	clickCat() {
		if (this.state === CatState.ASLEEP) {
			this.awake();
		} else if (this.state === CatState.IDLE) { // I should probably create a cat finite state machine
			// Reset the sleep counter
			this.queueSleep();
		}
	}
	
	clickPage(x, y) {
		
		// Ignore clicks while asleep
		if (this.state === CatState.ASLEEP) {
			return;
		}
		
		// Move the cat
		this.targetX = x - 25;
		this.targetY = y - 25;
		if (!(this.state === CatState.WALKING)) {
			
			// Set the cat moving if it's not already
			this.preventSleep();
			this.then = Date.now();
			this.state = CatState.WALKING
			this.moveInterval = setInterval(this.moveImpl.bind(this), 150);
			
		}
	}
	
	moveImpl() {
		// Determine the time step
		var now = Date.now();
		const dt = now - this.then;
		this.then = now;
		
		// Move the cat towards the target
		const step = SPEED * dt;
		const dx = this.targetX - this.x;
		const dy = this.targetY - this.y;
		
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
			this.setPosition(this.targetX, this.targetY);
			
			// Stop calling the move function
			this.state = CatState.IDLE;
			clearInterval(this.moveInterval);
			
			// Send the cat to sleep soon
			this.queueSleep();
			
		} else {
			// Move the cat an increment
			const targetDistance = Math.sqrt(dx * dx + dy * dy);
			this.setPosition(this.x + step / targetDistance * dx, this.y + step / targetDistance * dy);
		}
	}
}


const cat = new Cat(document.getElementById("cat"));
document.body.addEventListener('click', (event) => {
	const x = event.pageX;
	const y = event.pageY;
	cat.clickPage(x, y);
});
cat.elem.addEventListener('click', (event) => {
	cat.clickCat();
});