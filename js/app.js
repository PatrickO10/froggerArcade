//var gems = 1;
var gemCount = 0;
var lifeCount = 1;
var wall = 400;
var enemyReturn = true;
var posY = [45, 130, 215];
var posX = [0, 100, 200, 300, 400];
var randomX = [-100, -200, -300, -400, -500];
var GameOver = function() {
    if (lifeCount <= 0) {
        ctx.clearRect(0, 0, 505, 606);
        ctx.font = "bold 72pt serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("GAME", 60, 150);
        ctx.fillText("OVER", 60, 300);
    }
}
GameOver.prototype.update = function() {

}
var Guardian = function() {
    this.x = 500;
    this.y = this.yPos();
    this.sprite = 'images/enemy-bug.png';
}
var YtopBot = [-1, 1];
var HopperBug = function() {
    this.x = -100;
    this.y = 130;
    this.speed = [45,135,225,315,360, 720];
    this.sprite = 'images/enemy-bug.png';
}
var checkStatus = 0;
var i = 0;
HopperBug.prototype.yPos = function() {
    var enemyYpos = posY[Math.floor(Math.random() * 3)];
    return enemyYpos;

}

HopperBug.prototype.update = function(dt) {
    if (gemCount % 5 === 0 || checkStatus === 1) {
        checkStatus = 1;
    this.x += this.speed[Math.round(Math.random() * 4)] * dt;
    this.y += 50 * dt;
    if (this.x > 399 && gemCount > 5) {
        this.x = -100;
        this.y = 45;
        checkStatus = 0;
    }
    //if ((this.x > 0 && this.x < 100) || (this.x > 200 && this.x < 300) || (this.x > 100 && this.x < 200) || (this.x > 300 && this.x < 400)) {
    //this.y -= this.speed[Math.round(Math.random() * 5)] * dt;
      //  this.y = this.y * -1;
       // alert(this.y);
    //}
    /*
    if (this.x > 200 && this.x < 201 && checkStatus === 0) {
        this.y = 45;
        this.x = 45;
        checkStatus++;
        console.log(this.y + " one")
    }
        if(this.x > 300 && this.x < 301 && checkStatus === 1) {
            this.y = 45;
            console.log(this.y + " two");
            checkStatus++;
        }*/
    /*
    if ((this.x > 100 && this.x < 200) || (this.x > 300 && this.x < 400)) {
        //this.y += this.speed[Math.round(Math.random() * 5)] * dt;
        this.y = this.y * -1;
    }*/
    /*
    if (this.x > 100 && this.x < 200) {
        this.y += YtopBot[Math.floor(Math.random() * 2)] * this.speed[Math.round(Math.random() * 5)] * dt ;
        //this.x += 100;
    } 
    if (this.x > 200 && this.x < 300) {
        //this.y -= 85;
        //this.x += 100;
        this.y += this.speed[Math.round(Math.random() * 5)] * dt ;
    }
    if (this.x > 300 && this.x < 400) {
        this.y += this.speed[Math.round(Math.random() * 5)] * dt;
    }*/
}
}

HopperBug.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
//var enemyYpos = [100, 300, 600];
// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = this.xPos();
    this.y = this.yPos();
    this.speed = [45, 90, 135, 180, 315, 360, 720];
    this.sprite = 'images/enemy-bug.png';
}

Enemy.prototype.yPos = function() {
    var enemyYpos = posY[Math.floor(Math.random() * 3)];
    return enemyYpos;
}

Enemy.prototype.xPos = function() {
    var enemyXpos = randomX[Math.floor(Math.random() * 3)];
    return enemyXpos;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //console.log(this.x);
    if (this.x <= wall) {
        this.x += this.speed[Math.floor(Math.random() * 6)] * dt;
        //console.log(this.speed[Math.floor(Math.random() * 6)]);
    } else {
        this.x = -100;
        this.y = this.yPos();
        /*
        wall = -200;
        this.x -= this.speed * dt;
        if (this.x < wall) {
            wall = 400;
            enemyReturn = true;
            this.y = this.yPos();
            */
        }
    
    //this.x += this.speed * dt * gems;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 300;
}

Player.prototype.update = function(dt) {

}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.reset = function() {
    if (this.y === -40){
        //alert('yes');
        this.x = 300;
        this.y = 300;
    }
}
Player.prototype.handleInput = function (key) {
    // if statements to check which key was pressed and to make sure
    // the player doesn't leave the board.
    var test1 = Math.round(Math.random() * 2);
    var test2 = Math.floor(Math.random() * 3);
////alert(test1 + " " + test2);

            ctx.clearRect(0, 0, 505, 606);
    if (key == 'right' && this.x < 400) {
        this.x = this.x + 100;
        //alert(this.x + " " + this.y);

    }
    if (key == 'down' && this.y < 350) {
        this.y = this.y + 85; 
        //alert(this.x + " " + this.y);
    }
    if (key == 'left' && this.x > 0) {
        this.x = this.x - 100;
        //alert(this.x + " " + this.y);
    }
    if (key == 'up' && this.y > 25) {
        this.y = this.y - 85;
        //alert(this.x + " " + this.y);
        if (this.y <= -40) {
            lifeCount--;
            alert(lifeCount);
            this.x = 200;
            this.y = 300;
        }
    }
}


var gemStar = 0;
var Gem = function() {
    this.x = posX[Math.floor(Math.random() * 5)];
    this.y = posY[Math.floor(Math.random() * 3)];
    this.sprite = 'images/Gem Orange.png';
}

Gem.prototype.update = function() {
    if (player.y === this.y && player.x === this.x) {
        gemCount++;
        console.log(gemCount);
        console.log(gemCount % 3);
        gemStar = gemCount % 3;
        this.x = posX[Math.floor(Math.random() * 5)];
        this.y = posY[Math.floor(Math.random() * 3)];
        //alert(this.x);
    }
    if (gemStar === 0 && gemCount != 0) {
        star.x = posX[Math.floor(Math.random() * 5)];
        star.y = posY[Math.floor(Math.random() * 3)];
        gemStar = 1;
    }
}
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Star = function() {
    this.x = -100;
    this.y = -100;
    this.sprite = 'images/Star.png';
}

Star.prototype.update = function () {
    if (player.x === this.x && player.y === this.y) {
        this.x = -100;
        this.y = -100;
        lifeCount++;
        //alert(lifeCount);
    }
}
Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemy0 = new Enemy();
var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();
var enemy4 = new Enemy();
var enemy5 = new HopperBug();
var allEnemies = [enemy0, enemy1, enemy2, enemy3, enemy4, enemy5];
var player = new Player();
var gem = new Gem();
var star = new Star();
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
