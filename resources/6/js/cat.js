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
const sprite1 = loadSpriteSheet("/resources/6/img/cat_spritesheet_1.png", 400, 200, // Spritesheet dimensions
100, 100, // Sprite dimensions
100, // Target height
[3, 1, 5, 0, 2, 6], // Walk frames
4, // Sleep frame
7 // Pat frame
);
class Cat {
    constructor(elem, sprite) {
        this.state = CatState.ASLEEP;
        this.moveInterval = -1;
        this.then = -1;
        this.elem = elem;
        this.sprite = sprite;
        // Set the element to absolute position
        // Initialise the cat style
        this.elem.style.width = this.sprite.elementWidth;
        this.elem.style.height = this.sprite.elementHeight;
        this.elem.style.backgroundImage = "url('" + this.sprite.source + "')";
        this.elem.style.backgroundPosition = this.sprite.backgroundPositions_walk[0];
        this.elem.style.backgroundSize = this.sprite.backgroundSize;
        this.elem.style.position = "absolute";
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
            // True iff not walking and the distance is further than 100
            // Set the cat moving if it's not already
            this.preventSleep();
            this.then = Date.now();
            this.state = CatState.WALKING;
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
const catElement = document.getElementById("cat");
if (catElement) {
    const cat = new Cat(catElement, sprite1);
    document.body.addEventListener('click', (event) => {
        const x = event.pageX;
        const y = event.pageY;
        cat.clickPage(x, y);
    });
    cat.elem.addEventListener('click', () => {
        cat.clickCat();
    });
    cat.elem.addEventListener('mousedown', () => {
        cat.mousedown();
    });
    cat.elem.addEventListener('touchstart', () => {
        cat.mousedown();
    });
    cat.elem.addEventListener('mouseup', () => {
        cat.mouseup();
    });
    cat.elem.addEventListener('touchend', () => {
        cat.mouseup();
    });
    cat.elem.addEventListener('mouseout', () => {
        cat.mouseup();
    });
}
