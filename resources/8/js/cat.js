"use strict";
const SPEED = 50 * 0.001;
var CatState;
(function (CatState) {
    CatState[CatState["ASLEEP"] = 0] = "ASLEEP";
    CatState[CatState["IDLE"] = 1] = "IDLE";
    CatState[CatState["WALKING"] = 2] = "WALKING";
    CatState[CatState["PAT"] = 2] = "PAT";
})(CatState || (CatState = {}));
function loadSpriteSheet(path, sourceSpritesheetWidthPx, sourceSpritesheetHeightPx, sourceSpriteWidthPx, sourceSpriteHeightPx, targetHeightPx, walkFrames, sleepFrame, patFrame) {
    const scale = targetHeightPx / sourceSpriteHeightPx;
    const targetWidthPx = scale * sourceSpriteWidthPx;
    // Background size
    const backgroundSizeWidth = sourceSpritesheetWidthPx * scale;
    const backgroundSizeHeight = sourceSpritesheetHeightPx * scale;
    const backgroundSize = `${backgroundSizeWidth}px ${backgroundSizeHeight}px`;
    // Frame coordinates
    let sourceSpritesHorizontally = Math.round(sourceSpritesheetWidthPx / sourceSpriteWidthPx);
    function getPosition(frameIndex) {
        const row = Math.floor(frameIndex / sourceSpritesHorizontally);
        const col = frameIndex % sourceSpritesHorizontally;
        const x = -col * sourceSpriteWidthPx * scale;
        const y = -row * sourceSpriteHeightPx * scale;
        return `${x}px ${y}px`;
    }
    const backgroundPositions_walk = walkFrames.map(getPosition);
    const backgroundPosition_sleep = getPosition(sleepFrame);
    const backgroundPosition_pat = getPosition(patFrame);
    return {
        source: path,
        elementWidth: `${targetWidthPx}px`,
        elementHeight: `${targetHeightPx}px`,
        backgroundSize,
        backgroundPositions_walk,
        backgroundPosition_sleep,
        backgroundPosition_pat
    };
}
class Cat {
    constructor(elem, sprite) {
        this.state = CatState.ASLEEP;
        this.moveInterval = -1;
        this.then = -1;
        this.elem = elem;
        this.sprite = sprite;
        // Add event listeners
        elem.addEventListener('click', (event) => { this.clickCat(); event.preventDefault(); });
        elem.addEventListener('mousedown', () => this.mousedown());
        elem.addEventListener('touchstart', () => this.mousedown());
        elem.addEventListener('mouseup', () => this.mouseup());
        elem.addEventListener('touchend', () => this.mouseup());
        elem.addEventListener('mouseout', () => this.mouseup());
        document.body.addEventListener('click', (event) => {
            this.clickPage(event.pageX, event.pageY);
        });
        // Set the element to absolute position
        // Initialise the cat style
        elem.style.width = sprite.elementWidth;
        elem.style.height = sprite.elementHeight;
        elem.style.backgroundImage = "url('" + sprite.source + "')";
        elem.style.backgroundPosition = sprite.backgroundPositions_walk[0];
        elem.style.backgroundSize = sprite.backgroundSize;
        elem.classList.add("angus-cat");
        const br = elem.getBoundingClientRect();
        this.x = br.x;
        this.y = br.y;
        this.targetX = this.x;
        this.targetY = this.y;
        this.setPosition(br.x, br.y);
        this.moveAnimationIndex = 0;
        this.sleepTImerSet = false;
        this.goToSleep();
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.elem.style.left = Math.floor(this.x) - 25 + "px";
        this.elem.style.top = Math.floor(this.y) - 25 + "px";
    }
    goToSleep() {
        this.preventSleep();
        this.state = CatState.ASLEEP;
        this.elem.style.backgroundPosition = this.sprite.backgroundPosition_sleep;
    }
    awake() {
        this.state = CatState.IDLE;
        this.elem.style.backgroundPosition = this.sprite.backgroundPositions_walk[this.moveAnimationIndex];
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
    mouseup() {
        if (this.state === CatState.PAT) {
            this.state = CatState.IDLE;
            this.elem.style.backgroundPosition = this.sprite.backgroundPositions_walk[0];
        }
    }
    mousedown() {
        if (this.state === CatState.IDLE) {
            this.state = CatState.PAT;
            this.elem.style.backgroundPosition = this.sprite.backgroundPosition_pat;
        }
    }
    clickCat() {
        if (this.state === CatState.ASLEEP) {
            this.awake();
        }
        else if (this.state === CatState.IDLE) { // I should probably create a cat finite state machine
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
            && ((this.targetX - this.x) * (this.targetX - this.x) + (this.targetY - this.y) * (this.targetY - this.y) > 60 * 60)) {
            // True iff not walking and the distance is further than 160
            // Set the cat moving if it's not already
            this.preventSleep();
            this.then = Date.now();
            this.state = CatState.WALKING;
            clearInterval(this.moveInterval);
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
        }
        else {
            this.elem.style.transform = "";
        }
        // Step up the animation index
        this.moveAnimationIndex = (this.moveAnimationIndex + 1) % this.sprite.backgroundPositions_walk.length;
        this.elem.style.backgroundPosition = this.sprite.backgroundPositions_walk[this.moveAnimationIndex];
        if (dx * dx + dy * dy <= step * step) {
            this.setPosition(this.targetX, this.targetY);
            // Stop calling the move function
            this.state = CatState.IDLE;
            clearInterval(this.moveInterval);
            // Send the cat to sleep soon
            this.queueSleep();
        }
        else {
            // Move the cat an increment
            const targetDistance = Math.sqrt(dx * dx + dy * dy);
            this.setPosition(this.x + step / targetDistance * dx, this.y + step / targetDistance * dy);
        }
    }
}
class AngusCatElement extends HTMLElement {
    connectedCallback() {
        const src = this.getAttribute('src');
        const srcDimensions = this.getAttribute('srcDimensions');
        const height = parseInt(this.getAttribute('height'));
        const walkFrames = this.getAttribute('walkFrames')
            .split(',')
            .map(Number);
        const sleepFrame = parseInt(this.getAttribute('sleepFrame'));
        const patFrame = parseInt(this.getAttribute('patFrame'));
        const [sheetSize, spriteSize] = srcDimensions.split(';');
        const [sheetW, sheetH] = sheetSize.split('x').map(Number);
        const [spriteW, spriteH] = spriteSize.split('x').map(Number);
        const elem = document.createElement('div');
        this.appendChild(elem);
        const spriteData = loadSpriteSheet(src, sheetW, sheetH, spriteW, spriteH, height, walkFrames, sleepFrame, patFrame);
        const cat = new Cat(elem, spriteData);
    }
}
customElements.define('angus-cat', AngusCatElement);
const style = document.createElement('style');
style.textContent = `
.angus-cat {
	user-select: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-webkit-touch-callout: none;
	-webkit-tap-highlight-color: transparent;
	position: absolute;
	transition: top 0.3s linear, left 0.3s linear;
}
`;
document.head.appendChild(style);
