class Game {
    constructor(player, stage) {
        this.canvas = document.getElementById("myCanvas");
        this.context = this.canvas.getContext("2d");

        this.context.webkitImageSmoothingEnabled = false;
        this.context.mozImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = true;

        this.player = player;
        this.stage = stage;


        this.personalAd = false;
    }
    draw() {

        this.stage.draw(this.context);
        if (!this.personalAd) {
            this.handlePlayerAnimationStates();
            this.player.draw(this.context);
        }
    }
    handlePlayerAnimationStates() {
        if (this.player.inWater) {
            this.player.animationSpacing = 30;
            var oldState = this.player.animationState;
            this.player.numAnimationFrames = swimmingSpriteFrames;
            if (this.player.movingRight) {
                this.player.animationState = "swimmingRight";
            }
            else if (this.player.movingLeft) {
                this.player.animationState = "swimmingLeft";
            }
            else {
                this.player.animationState = "none";
            }

            if (oldState != this.player.animationState) {
                console.log("animation state changed");
                this.player.animationFrame = 0;
                this.player.animationSpacingCounter = 0;
            }
        }
        else {
            var oldState = this.player.animationState;
            this.player.numAnimationFrames = playerSpriteFrames;
            this.player.animationSpacing = 10;
            if (this.player.movingRight) {
                this.player.animationState = "movingRight";
            }
            else if (this.player.movingLeft) {
                this.player.animationState = "movingLeft";
            }
            else {
                this.player.animationState = "none";
            }
            if (oldState != this.player.animationState) {
                console.log("animation state changed");
                this.player.animationFrame = 0;
                this.player.animationSpacingCounter = 0;
            }
        }

    }
    resize() {
        var windowHeight = document.documentElement.clientHeight - 20;
        var windowWidth  = document.documentElement.clientWidth - 20;
        // console.log(windowHeight, windowWidth);

        this.canvas.width = windowWidth;
        this.canvas.height = windowHeight;
        // console.log(this.canvas);

        var x = windowWidth / (tileWidth * 30), y = windowHeight / (tileHeight * 15);
        // console.log(x, y);
        this.context.scale(x, y);
    }
    checkForCollision() {
        if (this.personalAd) {
            return;
        }
        this.stage.checkForCollision(this.player);
        // console.log(player.x);
        if (this.stage.collisionState == "incrementStage") {
            this.incrementStage();
            // return;
        }
        // else if (this.player.x < 0) {
        //     this.decrementStage();
        // }
        else if (this.player.y > 15 * tileHeight) {
            this.player.x = this.stage.spawnPoint[0] * tileWidth;
            this.player.y = this.stage.spawnPoint[1] * tileHeight;
            this.player.dy = 0;
        }
    }
    keydown(e) {
        if (this.personalAd) {
            return;
        }
        switch (e.key) {
            case "ArrowLeft":
                player.movingLeft = true;
                break;
            case "ArrowRight":
                player.movingRight = true;
                break;
            case "ArrowUp":
                this.player.jump(-16, this.stage.name == "country");
                break;
            case "ArrowDown":
                this.player.slammingGround = true;
                break;
            default:
                console.log(e.key + " pressed!");
        }
    }
    keyup(e) {
        if (this.personalAd) {
            return;
        }
        switch (e.key) {
            case "ArrowLeft":
                player.movingLeft = false;
                break;
            case "ArrowRight":
                player.movingRight = false;
                break;
            case "ArrowDown":
                this.player.slammingGround = false;
                break;
            default:
                console.log(e.key + " up");
        }
    }
    mouseClick(x, y) {
        // console.log("mouse clicked at " + x + ", " + y);

        var tileRow, tileCol;

        var windowHeight = document.documentElement.clientHeight - 20;
        var windowWidth  = document.documentElement.clientWidth - 20;

        var xScale = windowWidth / (tileWidth * 30), yScale = windowHeight / (tileHeight * 15);

        x /= xScale;
        y /= yScale;

        tileRow = y / tileHeight;
        tileCol = x / tileWidth;

        console.log("click at " + tileCol + ", " + tileRow);

        var url = this.stage.tileToURL(tileRow, tileCol);

        if (url.length > 0) {
            window.open(url);
        }
    }

    clearContext() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    incrementStage() {

        var stageIndex = stageCycle.indexOf(this.stage.name);
        console.log("stage switched to " + stageCycle[stageIndex + 1]);
        this.stage = new Stage(stageCycle[stageIndex + 1]);


        if (this.stage.name == "personalAd") {
            this.personalAd = true;
            this.player.exists = false;
            return;
        }

        this.player.x = this.stage.spawnPoint[0] * tileWidth;
        this.player.y = this.stage.spawnPoint[1] * tileHeight;
        this.player.dy = 0;

        this.player.inWater = this.stage.name == "country";
        if (this.stage.name == "country") {
            console.log("switched to country stage");
            this.player.ddy = 0.06;
            this.player.jumping = false;
        }
        else {
            this.player.ddy = 0.4;
        }
    }
    decrementStage() {
        this.player.inWater = this.stage.name == "country";

        var stageIndex = stageCycle.indexOf(this.stage.name);
        if (stageIndex == 0) {
            return;
        }
        this.player.x = 30 * tileWidth - this.player.width;
        console.log("stage switched to " + stageCycle[stageIndex - 1]);
        this.stage = new Stage(stageCycle[stageIndex - 1]);
    }
}
