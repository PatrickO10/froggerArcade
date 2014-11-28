//var gems = 1;
var starSpawn = 0;
var grabKey = 0;
var turnBackSpawn = 0;
var keyCount = 0;
var gemCount = 0;
var lifeCount = 3;
var turnBackStatus = 0;
var wall = 400;
var enemyReturn = true;
var posY = [45, 130, 215, 300, 385];
var posX = [0, 100, 200, 300, 400, 500];
var randomX = [-100, -200, -300, -400, -500];
var enemySprite = ['images/enemy-bug.png', 'images/enemy-bug-orange.png', 'images/enemy-bug-sick.png',
        'images/enemy-bug-shadow.png', 'images/enemy-bug-grey.png', 'images/enemy-bug-blue.png'];

var sprite = function () {
    return enemySprite[Math.floor(Math.random() * 6)];
};

var GameOver = function() {
    if (lifeCount <= 0) {
        ctx.clearRect(0, 0, 505, 606);
        ctx.font = "bold 72pt serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("GAME", 60, 150);
        ctx.fillText("OVER", 60, 300);
    }
};

var Character = function(sprite) {
    this.sprite = sprite;
    this.speed = this.speed[Math.floor(Math.random() * 6)];
};

Character.prototype.collision = function() {
    // Enemy and guardian collision
    if (guardian.x <= (this.x + 50) && this.x <= (guardian.x + 50)
      && guardian.y === this.y && this.x != player.x && this.x != enemy5.x) {
        this.reset();
    }
    // Player collision
    if (this.x != guardian.x && player.x <= (this.x + 50) && this.x <= (player.x + 50) &&
        player.y <= (this.y + 50) && y <= (player.y + 50)) {
            player.reset();
    }
    // DiagonalBug collision
    if (guardian.x <= (this.x + 50) && this.x <= (guardian.x + 50) &&
        guardian.y <= (this.y + 50) && this.y <= (guardian.y + 50) &&
        player.x != this.x && enemy.x != this.x) {
            enemy5.x = -100;
            enemy5.y = 45;
    }
};

Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Character.prototype.reset = function() {
    //this.x = this.xPos();
    if (this.x === enemy.x) { // Enemy reset
        this.x = randomX[Math.floor(Math.random() * 3)];
        this.y = posY[Math.floor(Math.random() * 3)];
        //return this.x, this.y;
    } if else (this.x === player.x) { // Player reset
        lifeCount--;
        this.x = posX[Math.floor(Math.random() * 5)];
        this.y = posY[(Math.floor(Math.random() * 2)) + 3];
    } if else (this.x === enemy5.x) { // DiagonalBug reset
        this.x = -100;
        this.y = 45;
    } if else (this.x === guardian.x) { // Guardian reset
        this.x = 500;
        this.y = this.posY[Math.floor(Math.random() * 3)];
    } if else (this.x === heart.x) { // Heart reset
        this.x = -100;
        this.y = posY[Math.floor(Math.random() * 5)];
    }
};

// One function to rule them all.
Character.prototype.update = function (dt) {
    collision();
    // Enemy update
    if (this.x === enemy.x) {
        if (this.x <= 500) {
            this.x += this.speed[Math.floor(Math.random() * 6)] * dt;
        } else {
            this.reset();
        }
    };
    // Guardian update
    if (this.x === guardian.x) {
        if (this.x > -50 && keyCount === 1) {
            this.x -= 200 * dt;
        } else {
            guardian.reset();
            this.sprite = guards[Math.floor(Math.random() * 4)];
        }
    };
    // Player update
    if (this.x === player.x) {
        if (this.y === -40) {
            player.reset();
        }
    };
    // Diagonal update
    if (this.x === enemy5.x) {
        if (gemCount >= 5 || checkStatus === 1) {
            checkStatus = 1;
            this.x += this.speed[Math.round(Math.random() * 4)] * dt;
            this.y += 50 * dt;
            if (this.x > 399 && gemCount > 5) {
                this.x = -100;
                this.y = 45;
                checkStatus = 0;
            }
    };
    // TurnBack update
    if (this.x === enemy7.x) {
        if (this.x <= 500 && turnBackStatus === 1) {
            this.x += this.speed[Math.floor(Math.random() * 6)] * dt;
        } else {
            turnBackStatus = 0;
            this.x -= 200 * dt;
        }
        if (this.x < -100) {
            this.x = -100;
        }
    };

}
// Collisions
/*
function guardian_collision (x, y) {
    if (guardian.x <= (x + 50) && x <= (guardian.x + 50)
      && guardian.y === y) {
        return true;
    }
};

function player_collision (x, y) {
    if (player.x <= (x + 50) && x <= (player.x + 50) &&
        player.y <= (y + 50) && y <= (player.y + 50)) {
            player.reset();
    }
};

function diagon_collision (x, y) {
    if (guardian.x <= (x + 50) && x <= (guardian.x + 50) &&
        guardian.y <= (y + 50) && y <= (guardian.y + 50)) {
            enemy5.x = -100;
            enemy5.y = 45;
    }
};
*/

var guards = ['images/char-horn-girl.png', 'images/char-pink-girl.png', 
        'images/char-princess-girl.png', 'images/char-cat-girl.png'];
// Guardians our enemies must avoid!

var Guardian = function() {
    this.x = 500;
    this.y = this.yPos();
    this.sprite = guards[Math.floor(Math.random() * 4)];
};

Guardian.prototype.yPos = function() {
    var guardYpos = posY[Math.floor(Math.random() * 3)];
    return guardYpos;
};

Guardian.prototype.update = function(dt) {
    if (this.x > -50 && keyCount === 1) {
        this.x -= 200 * dt;
    } else {
        guardian.reset();
        this.sprite = guards[Math.floor(Math.random() * 4)];
    }
};

Guardian.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Guardian.prototype.reset = function() {
    this.x = 500;
    this.y = this.yPos();
};

var checkStatus = 0;
var i = 0;
speed = [45, 90, 135, 180, 315, 360, 720];

// Enemies our player must avoid

var Enemy = function(sprite) {
    this.sprite = sprite;
};

// resetPos randomly finds a x and y value and assigns it to this
Enemy.prototype.resetPos = function() {
    this.x = this.randomX[Math.floor(Math.random() * 3)];
    this.y = this.posY[Math.floor(Math.random() * 3)];
    return this.x, this.y;
}; 

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x <= 500) {
        this.x += this.speed[Math.floor(Math.random() * 6)] * dt;
    } else {
        this.reset();
    }
    // Checks collision for player and enemy bug
    player_collision(this.x, this.y);
    // Checks collision for guardian and enemy bug
    if(guardian_collision(this.x, this.y)) {
        this.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function() {
    //this.x = this.xPos();
    this.x = randomX[Math.floor(Math.random() * 3)];
    this.y = posY[Math.floor(Math.random() * 3)];
    return this.x, this.y;
};

var DiagonalBug = function(sprite) {
    this.speed = [45, 90, 135, 180, 315, 360, 720];
    this.x = -100;
    this.y = 45;
    this.sprite = sprite;
};


//DiagonalBug.prototype = Object.create(Enemy.prototype);
//DiagonalBug.prototype.constructor = DiagonalBug;

DiagonalBug.prototype.yPos = function() {
    var enemyYpos = posY[Math.floor(Math.random() * 3)];
    return enemyYpos;

};

DiagonalBug.prototype.update = function(dt) {
    if (gemCount >= 5 || checkStatus === 1) {
        checkStatus = 1;
        this.x += this.speed[Math.round(Math.random() * 4)] * dt;
        this.y += 50 * dt;
        if (this.x > 399 && gemCount > 5) {
            this.x = -100;
            this.y = 45;
            checkStatus = 0;
        }
    };
    player_collision(this.x, this.y);
    diagon_collision(this.x, this.y); 
};
DiagonalBug.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 300;
};

Player.prototype.update = function(dt) {
    if (this.y === -40) {
        player.reset();
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.reset = function() {
    lifeCount--;
    this.x = 200;
    this.y = 300;
};

Player.prototype.handleInput = function (key) {
    // if statements to check which key was pressed and to make sure
    // the player doesn't leave the board.

    if (key == 'right' && this.x < 400) {
        this.x = this.x + 100;
    }
    if (key == 'down' && this.y < 350) {
        this.y = this.y + 85; 
    }
    if (key == 'left' && this.x > 0) {
        this.x = this.x - 100;
    }
    if (key == 'up' && this.y > 25) {
        this.y = this.y - 85;
    }
};

var Key = function() {
    this.sprite = 'images/key.png';
};

Key.prototype.update = function() {
    if (player.x === this.x && player.y === this.y) {
        this.x = -100;
        this.y = -100;
        keyCount++;
    }
};

Key.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Gem = function() {
    this.x = posX[Math.floor(Math.random() * 5)];
    this.y = posY[Math.floor(Math.random() * 3)];
    this.sprite = 'images/Gem Orange.png';
};

Gem.prototype.update = function() {
    if (player.y === this.y && player.x === this.x) {
        gemCount++;
        console.log(gemCount);
        console.log(gemCount % 3);
        starSpawn = gemCount % 3;
        turnBackSpawn = gemCount % 4;
        this.x = posX[Math.floor(Math.random() * 5)];
        this.y = posY[Math.floor(Math.random() * 3)];
    }
    if (starSpawn === 0 && gemCount != 0) {
        star.x = posX[Math.floor(Math.random() * 5)];
        star.y = posY[Math.floor(Math.random() * 3)];
        starSpawn = 1;
    }
    if (grabKey === 0 && gemCount === 10) {
        key.x = posX[Math.floor(Math.random() * 5)];
        key.y = posY[Math.floor(Math.random() * 3)];
        grabKey++;
    }
    if (turnBackSpawn === 0 && gemCount != 0) {
        enemy7.x = randomX[Math.floor(Math.random() * 5)];
        enemy7.y = posY[Math.floor(Math.random() * 3)];
        turnBackStatus = 1;
    }
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Star = function() {
    this.sprite = 'images/Star.png';
};

Star.prototype.update = function () {
    if (player.x === this.x && player.y === this.y) {
        this.x = -100;
        this.y = -100;
        lifeCount++;
    }
};

Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var TurnBack = function(sprite) {
    Enemy.call(this, sprite)
}

TurnBack.prototype = Object.create(Enemy.prototype);

TurnBack.prototype.update = function(dt) {
        if (this.x <= 500 && turnBackStatus === 1) {
            this.x += this.speed[Math.floor(Math.random() * 6)] * dt;
        } else {
        turnBackStatus = 0;
        this.x -= 200 * dt;
        
    }
    if (this.x < -100) {
            this.x = -100;
    }

};

var Heart = function(sprite) {
    Enemy.call(this, sprite);
}

Heart.prototype = Object.create(Enemy.prototype);

Heart.prototype.reset = function() {
    //this.x = this.xPos();
    this.x = 200;
    this.y = posY[Math.floor(Math.random() * 3)];
    return this.x, this.y;
};

Heart.prototype.update = function(dt) {
    if (this.x <= 500) {
        this.x += this.speed[Math.floor(Math.random() * 6)] * dt;
        //console.log(this.speed[Math.floor(Math.random() * 6)]);
    } else {
        this.reset();
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemy0 = new Enemy(sprite());
var enemy1 = new Enemy(sprite());
var enemy2 = new Enemy(sprite());
var enemy3 = new Enemy(sprite());
var enemy4 = new Enemy(sprite());
var enemy5 = new DiagonalBug(sprite());
var enemy6 = new Heart('images/Heart.png');
var enemy7 = new TurnBack(sprite());
var allEnemies = [enemy0, enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7];
var player = new Player();
var guardian = new Guardian();
var gem = new Gem();
var star = new Star();
var key = new Key();

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
