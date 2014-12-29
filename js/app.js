var score = 0;
var checkStatus = 0; // for Diagonal Bug
var grabKey = 0;  // Once grabKey is 1 the key respawns on the map
var keyCount = 0; // Once keyCount is 1 the key will never respawn again
var gemCount = 0; // Number of gems collected
var lifeCount = 3;
var turn = 0; // For turnback bug
var posY = [45, 130, 215, 300, 385]; // An Array of Y positions
var posX = [0, 100, 200, 300, 400, 500]; // An Array of X positions for gems
var randomX = [-100, -200, -300, -400, -500]; // An Array of X positions for enemybugs
var speed = [45, 90, 135, 180, 315, 360, 720]; // An Array of speed
// An Array of gem sprites
var gemSprites = ['images/Gem Orange.png', 'images/Gem Blue.png',
    'images/Gem Green.png'];
// An Array of enemy sprites
var enemySprites = ['images/enemy-bug.png', 'images/enemy-bug-orange.png', 
    'images/enemy-bug-sick.png', 'images/enemy-bug-shadow.png',
    'images/enemy-bug-grey.png', 'images/enemy-bug-blue.png'];
// An Array of guardian sprites
var guards = ['images/char-horn-girl.png', 'images/char-pink-girl.png', 
        'images/char-princess-girl.png', 'images/char-cat-girl.png'];


var scoreboard = document.getElementById('scoreboard');

var ScoreB = function () {
    // Puts the current Score and Lives in the scoreboard div
    scoreboard.innerHTML = "Score: " + score + "   Lives: " + lifeCount;
};

// Changes the scoreboard style color
ScoreB.prototype = {
    changeColor: function() {
        if (score < 1000) {
            scoreboard.style.color = 'yellow';
        } else if (score > 1000 && score < 10000) {
            score += 1000;
            scoreboard.style.color = 'blue';
        } else if (score > 10000 && score < 30000) {
            score += 2500;
            scoreboard.style.color = 'red';
        } else if (score > 30000) {
            score += 5000;
            scoreboard.style.color = 'teal'
        }
    },
    update: function() { // Updates the score and lifeCount with each game tick
        score = gemCount * 450;
        currScore.changeColor();
        scoreboard.innerHTML = "Score: " + score + "   Lives: " + lifeCount;
    }
}
 // Character entity is at the top of the Heirarchy
var Character = function(sprite) {
    this.sprite = sprite;
    this.speed = this.randomSpeed();
};

Character.prototype = {
    render: function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    },
    collision: function(x1, y1, x2, y2) { // Checks for collision
        if (x1 <= (x2 + 50) && x2 <= (x1 + 50) &&
        y1 <= (y2 + 50) && y2 <= (y1 + 50)) {
            return true; // if true returns true
      }
    },
    collisionReset: function() {
        if (player.collision(player.x, player.y, this.x, this.y)) {
            player.reset(); // If player collides with enemy bug reset player
        };
        if (guardian.collision(guardian.x, guardian.y, this.x, this.y)) {
            this.reset(); // If enemy bug collides with guardian
        };                      // then reset enemy bug
    },
    randomSpeed: function() { // Returns a random speed
        return speed[Math.floor(Math.random() * speed.length)];
    },
    randomGem: function () {
        // Returns random gem sprite
        return gemSprites[Math.floor(Math.random() * gemSprites.length)];
    },
    randomSprite: function() {
        // Returns random enemy sprite
        return enemySprites[Math.floor(Math.random() * enemySprites.length)];
    },
    randomGuard: function () {
        // Returns random guard sprite
        return guards[Math.floor(Math.random() * guards.length)];
    }
}

// Enemies our player must avoid
var Enemy = function(sprite) {
    Character.call(this, sprite, speed);
}

// Child of Character
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (this.x <= 500) {
        this.x += this.speed * dt; // Enemy bug moves right
    } else {
        this.reset(); // Reset the bug back to the beginning
    }
    this.collisionReset();
}

Enemy.prototype.reset = function() { // Reset for the enemy bugs
    this.x = randomX[Math.floor(Math.random() * 3)]; // Sets a random X position
    this.y = posY[Math.floor(Math.random() * 3)]; // Sets a random Y position
    this.speed = this.randomSpeed(); // Sets a random speed
    this.sprite = this.randomSprite(); // Sets a random enemy sprite
}

var Heart = function(sprite) {
    Character.call(this, sprite, speed);
};

// Grand Child of Character
Heart.prototype = Object.create(Enemy.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.resetSprite = function() {
    return 'images/Heart.png';
};

// Polymorphism - Same method name (update) as Enemy parent but different behavior
Heart.prototype.update = function(dt) {
    if (this.x <= 500) {
        this.x += this.speed * dt; // Moves bug to the right
    } else {
        this.reset(); // Uses the reset() found in Enemy 
    }
    // If the heart collides with the player
    if (player.collision(player.x, player.y, this.x, this.y)) {
        this.reset();
        gemCount--; // Takes away a gem
        lifeCount++; // Adds a life
    }
    // Since the Enemy reset() method resets the sprite to a random 
    // enemy sprite. This corrects that
    this.sprite = this.resetSprite();
}

// TurnBack bug goes across the map and comes back
var TurnBack = function() {
    Character.call(this, speed);
    this.reset();
}

// Grand Child of Character
TurnBack.prototype = Object.create(Enemy.prototype);
TurnBack.prototype.constructor = TurnBack;

TurnBack.prototype.update = function(dt) {
    if (this.x <= 500 && turn === 0) {
        this.x += this.speed * dt;
        if (this.x > 500) { // var turn becomes 1
            return turn++; // Bug will stop going right
        }
    } else {
         this.x -= this.speed * dt; // When var turn does not equal 0 bug will go left
         if (this.x < -1000) {  // When bug becomes less than -1000
            this.reset(); // Bug will reset and var turn will go back to 0
            return turn--;
        }
    }
    this.collisionReset();
};

// Guardians our enemies must avoid!

var Guardian = function() {
    this.reset();
};

// Child of Character
Guardian.prototype = Object.create(Character.prototype);
Guardian.prototype.constructor = Guardian;

Guardian.prototype.update = function(dt) {
    if (this.x > -50 && keyCount === 1 && score >= 4500) {
        this.x -= 200 * dt;  // Guardian moves left
    } else {
        this.reset();
    }

};
// Resets the x, y, and sprite
Guardian.prototype.reset = function() {
    this.x = 550;
    this.y = posY[Math.floor(Math.random() * 3)];
    this.sprite = this.randomGuard();
};

// Goes diagonally down the map
var DiagonalBug = function(sprite) {
    Character.call(this, sprite);
    this.speed = 130;
    this.x = -100;
    this.y = 45;
};

// Child of Character
DiagonalBug.prototype = Object.create(Character.prototype);
DiagonalBug.prototype.constructor = DiagonalBug;

DiagonalBug.prototype.update = function(dt) {
    if (gemCount >= 5 || checkStatus === 1) { // Doesn't spawn until gemCount >= 5
        checkStatus = 1;
        this.x += this.speed * dt; // Moves across at this speed
        this.y += 50 * dt;  // Moves down at this speed
        if (this.x > 399 && gemCount > 5) {
            this.reset();  // Resets once it gets to the end
        }
    };
    this.collisionReset();
}

DiagonalBug.prototype.reset = function() {
    // Resets the position
    this.x = -100;
    this.y = 45;
}

DiagonalBug.prototype.collisionReset = function() {
    // Needs its own collisionReset or else bug will spawn at different Y positions
    if (player.collision(player.x, player.y, this.x, this.y)) {
        player.reset();
    }
    if (guardian.collision(guardian.x, guardian.y, this.x, this.y)) {
        this.reset();
    }
}

// This class required an update(), render() and
// a handleInput() method.
var Player = function (sprite) {
    Character.call(this, sprite);
    this.x = 200;
    this.y = 300;
};

// Child of Character
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    if (this.y < 45) {
        gemCount += 1;  // Sacrifice a life to get 450 points by jumping in water
        this.reset();
    }
};

Player.prototype.reset = function() {
    lifeCount--; // If resets lose a life
    this.x = 200;
    this.y = 385;
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

// Collect gems to increase score and unlock special features, like guardians
var Gem = function(sprite) {
    this.x = posX[Math.floor(Math.random() * 5)];
    this.y = posY[Math.floor(Math.random() * 3)];
    Character.call(this, sprite);
};

// Child of Character
Gem.prototype = Object.create(Character.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.update = function() {
    if (player.y === this.y && player.x === this.x) { // Player grabs the gem
        gemCount++;
        this.itemReset();
        this.sprite = this.randomGem();
    }
};

Gem.prototype.itemReset = function() {
    // Resets the item on the map where player can grab it
    this.x = posX[Math.floor(Math.random() * 5)];
    this.y = posY[Math.floor(Math.random() * 3)];
}

var Key = function(sprite) {
    Character.call(this, sprite);
    // Set the key in a far distant land that the player will never reach
    this.x = 1000; 
    this.y = 1000;
};

// Grand Child of Character
Key.prototype = Object.create(Gem.prototype);
Key.prototype.update = function() {
    if (player.x === this.x && player.y === this.y) {
        this.x = -100;
        this.y = -100;
        keyCount++;
    }
    // Once player grabs 10 gems a key appears
    if (grabKey === 0 && gemCount >= 10) {
        key.itemReset(); // Will travel up to its parent to use this method
        this.sprite = 'images/Key.png';
        grabKey++;
    }
};

// Instantiated my objects.
// Placed all enemy objects in an array called allEnemies
// Placed the player object in a variable called player
var enemy0 = new Enemy('images/enemy-bug.png');
var enemy1 = new Enemy('images/enemy-bug.png');
var enemy2 = new Enemy('images/enemy-bug.png');
var enemy3 = new Enemy('images/enemy-bug.png');
var enemy4 = new Enemy('images/enemy-bug.png');
var enemy5 = new DiagonalBug('images/enemy-bug.png');
var enemy6 = new Heart('images/Heart.png');
var enemy7 = new TurnBack();
var allEnemies = [enemy0, enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7];
var player = new Player('images/char-boy.png');
var guardian = new Guardian();
var gem = new Gem('images/Gem Orange.png');
var key = new Key('images/Key.png');
var currScore = new ScoreB();

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
