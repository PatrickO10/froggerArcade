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
var playerSprite = 'images/char-boy.png';
var posY = [45, 130, 215, 300, 385];
var posX = [0, 100, 200, 300, 400, 500];
var randomX = [-100, -200, -300, -400, -500];
var enemySprites = ['images/enemy-bug.png', 'images/enemy-bug-orange.png', 'images/enemy-bug-sick.png',
        'images/enemy-bug-shadow.png', 'images/enemy-bug-grey.png', 'images/enemy-bug-blue.png'];

// Returns a random sprite
var randomSprite = function () {
    return enemySprites[Math.floor(Math.random() * enemySprites.length)];
};

// Returns a random guard
var randomGuard = function () {
    return guards[Math.floor(Math.random() * guards.length)];
};

// Returns a random speed
var randomSpeed = function () {
    return speed[Math.floor(Math.random() * speed.length)];
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
    //this.speed = randomSpeed();
};

Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid

var Enemy = function(sprite) {
    Character.call(this, sprite);
    this.speed = randomSpeed();
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x <= 500) {
        // this.x += speed[Math.floor(Math.random() * 7)] * dt;
        this.x += this.speed * dt;
    } else {
        this.reset();
    }
    // Checks collision for player and enemy bug
    if(player_collision(this.x, this.y)) {
        player.reset();
    }
    // Checks collision for guardian and enemy bug
    if(guardian_collision(this.x, this.y)) {
        this.reset();
    }
};

Enemy.prototype.reset = function() {
    this.x = randomX[Math.floor(Math.random() * 3)];
    this.y = posY[Math.floor(Math.random() * 3)];
    this.speed = randomSpeed();
    this.sprite = this.resetSprite();
};

Enemy.prototype.resetSprite = function() {
    return randomSprite();
};

// Collisions

function guardian_collision (x, y) {
    if (guardian.x <= (x + 50) && x <= (guardian.x + 50)
      && guardian.y === y) {
        return true;
    }
};

function player_collision (x, y) {
    if (player.x <= (x + 50) && x <= (player.x + 50) &&
        player.y <= (y + 50) && y <= (player.y + 50)) {
        //player.reset();
        return true;
    }
};

function diagon_collision (x, y) {
    if (guardian.x <= (x + 50) && x <= (guardian.x + 50) &&
        guardian.y <= (y + 50) && y <= (guardian.y + 50)) {
            enemy5.x = -100;
            enemy5.y = 45;
    }
};

var guards = ['images/char-horn-girl.png', 'images/char-pink-girl.png', 
        'images/char-princess-girl.png', 'images/char-cat-girl.png'];
// Guardians our enemies must avoid!

var Guardian = function(sprite) {
    //Character.call(this, sprite);
    this.reset();
};

Guardian.prototype = Object.create(Character.prototype);
Guardian.prototype.constructor = Guardian;

Guardian.prototype.update = function(dt) {
    if (this.x > -50 && keyCount === 1) {
        this.x -= 200 * dt;
    } else {
        this.reset();
    }
};

Guardian.prototype.reset = function() {
    this.x = 500;
    this.y = posY[Math.floor(Math.random() * 3)];
    this.sprite = guards[Math.floor(Math.random() * 4)];
};

var checkStatus = 0;
var i = 0;
speed = [45, 90, 135, 180, 315, 360, 720];

var DiagonalBug = function(sprite) {
    Character.call(this, sprite);
    this.speed = 130;
    this.x = -100;
    this.y = 45;
};

DiagonalBug.prototype = Object.create(Enemy.prototype);
DiagonalBug.prototype.constructor = DiagonalBug;

DiagonalBug.prototype.update = function(dt) {
    if (gemCount >= 5 || checkStatus === 1) {
        checkStatus = 1;
        this.x += this.speed * dt;
        this.y += 50 * dt;
        if (this.x > 399 && gemCount > 5) {
            //this.x = -100;
            //this.y = 45;
            this.reset();
            checkStatus = 0;
        }
    };
    if (player_collision(this.x, this.y)) {
        player.reset();
    }
    diagon_collision(this.x, this.y); 
};

DiagonalBug.prototype.reset = function() {
    this.x = -100;
    this.y = 45;
};

var TurnBack = function(sprite) {
    Enemy.call(this, sprite)
}

TurnBack.prototype = Object.create(Enemy.prototype);
TurnBack.prototype.constructor = TurnBack;

TurnBack.prototype.update = function(dt) {
        if (this.x <= 500 && turnBackStatus === 1) {
            this.x += speed[Math.floor(Math.random() * 7)] * dt;
        } else {
        turnBackStatus = 0;
        this.x -= 200 * dt;
        
    }
    if (this.x < -100) {
            this.x = -100;
    }

};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (sprite) {
    Character.call(this, sprite);
    this.x = 200;
    this.y = 300;
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    if (this.y < 45) {
        this.reset();
    }
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

var Gem = function() {
    this.x = posX[Math.floor(Math.random() * 5)];
    this.y = posY[Math.floor(Math.random() * 3)];
    this.sprite = 'images/Gem Orange.png';
};

Gem.prototype = Object.create(Character.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.update = function() {
    if (player.y === this.y && player.x === this.x) {
        gemCount++;
        starSpawn = gemCount % 9;
        turnBackSpawn = gemCount % 4;
        gem.reset();
    }
    if (starSpawn === 0 && gemCount != 0) {
        star.reset();
        starSpawn = 1;
    }
    if (grabKey === 0 && gemCount === 10) {
        key.reset();
        grabKey++;
    }
    if (turnBackSpawn === 0 && gemCount != 0) {
        enemy7.reset();
        turnBackStatus = 1;
    }
};

Gem.prototype.reset = function () {
    this.x = posX[Math.floor(Math.random() * posX.length)];
    this.y = posY[Math.floor(Math.random() * 3)];
};


var Key = function() {
    this.sprite = 'images/key.png';
};

Key.prototype = Object.create(Gem.prototype); // Taketh all that you know from thy gem
Key.prototype.update = function() {
    this.acquire();
};

Key.prototype.acquire = function() {
    if (player.x === this.x && player.y === this.y) {
        this.x = -100;
        this.y = -100;
    }
}

var Star = function() {
    this.sprite = 'images/Star.png';
};

Star.prototype.update = function () {
    this.acquire();
};

Star.prototype.acquire = function () {
    if (player.x === this.x && player.y === this.y) {
        this.reset();
        lifeCount++;
    }
};
Star.prototype.reset = function() {
    this.x = -100;
    this.y = -100;
};

Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Heart = function(sprite) {
    Character.call(this, sprite, speed);
};

Heart.prototype = Object.create(Enemy.prototype);
//Heart.prototype = Object.create(Star.prototype.starupdate);
Heart.prototype.constructor = Heart;
Heart.prototype.acquire = Star.prototype.acquire;

Heart.prototype.resetSprite = function() {
    return 'images/Heart.png';
};

Heart.prototype.update = function(dt) {
    if (this.x <= 500) {
        this.x += this.speed * dt;
        //console.log(this.randomSpeed());
    } else {
        this.reset();
    }
    if (player_collision(this.x, this.y)) {
        this.reset();
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemy0 = new Enemy(randomSprite());
var enemy1 = new Enemy(randomSprite());
var enemy2 = new Enemy(randomSprite());
var enemy3 = new Enemy(randomSprite());
var enemy4 = new Enemy(randomSprite());
var enemy5 = new DiagonalBug(randomSprite());
var enemy6 = new Heart('images/Heart.png');
var enemy7 = new TurnBack(randomSprite());
var allEnemies = [enemy0, enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7];
var player = new Player('images/char-boy.png');
var guardian = new Guardian(randomGuard());
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
