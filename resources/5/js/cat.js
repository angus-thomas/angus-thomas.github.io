"use strict";
const SPEED = 50 * 0.001;

const CatState = Object.freeze({
	ASLEEP: 0,
	IDLE: 1,
	WALKING: 2,
	PAT: 2
});

const sprite1 = {
	source: "/resources/5/img/cat_spritesheet_1.png",
	walkFrames: [
		"-300px 0",
		"-100px 0",
		"-100px -100px",
		"0 0",
		"-200px 0",
		"-200px -100px",
	],
	sleepFrame: "0 -100px",
	patFrame: "-300px -100px",
	width: "400px"
}


class Cat {
	
	constructor(elem, sprite) {
		/**
		 * @type {HTMLElement}
		 */
		this.elem = elem;
		this.sprite = sprite;
		
		// Set the element to absolute position
		// Initialise the cat style
		this.elem.style.width = "100px";
		this.elem.style.height = "100px";
		this.elem.style.backgroundImage = "url('" + this.sprite.source + "')";
		this.elem.style.backgroundPosition = "-100px -100px";
		this.elem.style.backgroundSize = this.sprite.width;
		this.elem.style.scale = "50%";
		this.elem.style.position = "absolute";
		const br = elem.getBoundingClientRect();
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
		this.elem.style.backgroundPosition = this.sprite.sleepFrame;
	}
	
	awake() {
		this.state = CatState.IDLE;
		this.elem.style.backgroundPosition =  this.sprite.walkFrames[this.moveAnimationIndex];
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
	
	mousedown() {
		if (this.state === CatState.IDLE) {
			this.state = CatState.PAT;
			this.elem.style.backgroundPosition =  this.sprite.patFame;
		}
	}
	
	mouseup() {
		if (this.state === CatState.PAT) {
			this.state = CatState.IDLE;
			this.elem.style.backgroundPosition =  this.sprite.walkFrames[0];
		}
	}
	
	mousedown() {
		if (this.state === CatState.IDLE) {
			this.state = CatState.PAT;
			this.elem.style.backgroundPosition = this.sprite.patFrame;
		}
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
		if (!((this.state === CatState.IDLE) || (this.state === CatState.WALKING))) {
			return;
		}
		
		// Move the cat
		this.targetX = x - 25;
		this.targetY = y - 25;
		
		// Turn the cat
		if ((!(this.state === CatState.WALKING))
			&& ((this.targetX - this.x) * (this.targetX - this.x) + (this.targetY - this.y) * (this.targetY - this.y) > 60 * 60)
		) {
			
			// True iff not walking and the distance is further than 100
			
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
		this.moveAnimationIndex = (this.moveAnimationIndex + 1) %  this.sprite.walkFrames.length;
		this.elem.style.backgroundPosition =  this.sprite.walkFrames[this.moveAnimationIndex];
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


const cat = new Cat(document.getElementById("cat"), sprite1);
document.body.addEventListener('click', (event) => {
	const x = event.pageX;
	const y = event.pageY;
	cat.clickPage(x, y);
});
cat.elem.addEventListener('click', (event) => {
	cat.clickCat();
});
cat.elem.addEventListener('mousedown', (event) => {
	cat.mousedown();
});
cat.elem.addEventListener('touchstart', (event) => {
	cat.mousedown();
});
cat.elem.addEventListener('mouseup', (event) => {
	cat.mouseup();
});
cat.elem.addEventListener('touchend', (event) => {
	cat.mouseup();
});
cat.elem.addEventListener('mouseout', (event) => {
	cat.mouseup();
});