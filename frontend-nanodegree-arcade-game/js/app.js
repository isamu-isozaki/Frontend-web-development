var heartCount = 1;
var oops = false;
var again = true;

function randomInt(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
}

function randomSpeed() {
    return randomInt(200, 400);
}

function arrayRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function checkCollision(object, player) {
    return (player.x + player.width > object.x &&
        player.x < object.x + object.width &&
        player.y + player.height > object.y &&
        player.y < object.y + object.height);
}

var Prop = function(x, y, sprite) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
};
Prop.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var HitBoxObject = function(x, y, sprite) {
    Prop.call(this, x, y, sprite);
};
HitBoxObject.prototype = Object.create(Prop.prototype);
HitBoxObject.prototype.width = 101;
HitBoxObject.prototype.height = 83;

// Enemy
var Enemy = function(x, y, sprite) {
    sprite = sprite || 'images/enemy-bug.png';
    HitBoxObject.call(this, x, y, sprite);
    this.speed = randomSpeed();
};
Enemy.prototype = Object.create(HitBoxObject.prototype);
Enemy.prototype.spawnY = [68, 151, 234];
Enemy.prototype.update = function(dt) {
    if (heartCount >= 10) {
        again = false;
    }
    if (again) {
        this.spawnY.splice(0, this.spawnY.length);
        this.spawnY.push(68, 151, 234);
    } else {
        this.spawnY.splice(0, this.spawnY.length);
        this.spawnY.push(68, 151, 234, 317, 400);
    }
    if (this.x <= (canvas.width + this.width)) {
        this.x += this.speed * dt;
    } else {
        this.x = -this.width;
        this.y = arrayRandom(this.spawnY);
        this.speed = randomSpeed();
    }
    if (player.x == 200 && player.y == 400) {

    } else {
        if (player.sprite == "char-princess-girl.png") {
            this.spawnY.splice(0, this.spawnY.length);
        } else {
            if (checkCollision(this, player)) {
                heartCount -= 1;
                player.reset();
                allEnemies.push(new Enemy(0, 234));
            }
        }
    }
};

// Player
var Player = function(x, y, sprite) {
    sprite = sprite || 'images/char-boy.png';
    x = x || 200;
    y = y || 400;
    HitBoxObject.call(this, x, y, sprite);
};
Player.prototype = Object.create(HitBoxObject.prototype);
Player.prototype.update = function() {
    // process action and move player
    var X = 101;
    var Y = 83;
    if (oops) {

    } else {
        switch (this.action) {
            case 'up':
                if (this.y > 0) {
                    this.y -= Y;
                }
                break;
            case 'right':
                if (this.x < 400) {
                    this.x += X;
                }
                break;
            case 'down':
                if (this.y < 400) {
                    this.y += Y;
                }
                break;
            case 'left':
                if (this.x > 0) {
                    this.x -= X;
                }
                break;
        }
        // log position
        if (this.position !== this.x + ',' + this.y) {
            this.position = this.x + ',' + this.y;
            console.log(this.position);
        }
        // reset action
        this.action = null;

        // reset player if on goal (water)
        if (this.y < 25) {
            this.reset();
            allEnemies.push(new Enemy(0, 234));
        }
        if (heartCount >= 0) {
            this.sprite = "images/char-boy.png";
            if (heartCount >= 10) {
                this.sprite = "images/char-cat-girl.png";
                if (heartCount >= 25) {
                    this.sprite = "images/char-horn-girl.png";
                    if (heartCount >= 50) {
                        this.sprite = "images/char-pink-girl.png";
                        if (heartCount >= 100) {
                            this.sprite = "images/char-princess.png";
                        }
                    }
                }
            }
        }
    }
};
Player.prototype.handleInput = function(e) {
    this.action = e;
};
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 400;
};

// Heart
var Heart = function(x, y, sprite) {
    sprite = sprite || 'images/Heart.png';
    x = x || 200;
    y = y || 68;
    HitBoxObject.call(this, x, y, sprite);
};
Heart.prototype = Object.create(HitBoxObject.prototype);
Heart.prototype.spawnX = [-2, 99, 200, 301, 402];
Heart.prototype.spawnY = [68, 151];
Heart.prototype.update = function() {
    // handle collisions with player
    if (checkCollision(this, player)) {
        player.reset();
        this.x = arrayRandom(this.spawnX);
        this.y = arrayRandom(this.spawnY);
        heartCount += 1;
    }
};

// Life
var Life = function(x, y, sprite) {
    sprite = sprite || 'images/Heart.png';
    x = x || -2;
    y = y || -40;
    Prop.call(this, x, y, sprite);
};
Life.prototype = Object.create(Prop.prototype);
Life.prototype.update = function() {};
Life.prototype.count = function() {
    ctx.fillStyle = "orange";
    ctx.font = "bold 50px Arial";
    ctx.fillText("X" + heartCount, 100, 100);
};


var Start = function(x, y) {
    sprite = 'images/Selector.png';
    x = x || 200;
    y = y || 400;
    Prop.call(this, x, y, sprite);
};
Start.prototype = Object.create(Prop.prototype);
Start.prototype.update = function() {};

var GameOver = function(x, y) {
    sprite = "images/gameover.png";
    x = x || 50;
    y = y || 220;
    Prop.call(this, x, y, sprite);
};
GameOver.prototype = Object.create(Prop.prototype);
GameOver.prototype.update = function() {};

var Retry = function(x, y) {
    sprite = "images/retry.png"; // width= 300 height = 51
    x = x || 100;
    y = y || 400;
    Prop.call(this, x, y, sprite);
};
Retry.prototype = Object.create(Prop.prototype);
Retry.prototype.update = function() {};

var Clear = function(x, y) {
    sprite = "images/clear.png";
    x = x || 50;
    y = y || 220;
    Prop.call(this, x, y, sprite);
};
Clear.prototype = Object.create(Prop.prototype);
Clear.prototype.update = function() {};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [
    new Enemy(0, 68),
    new Enemy(0, 151),
    new Enemy(0, 234)
];
var player = new Player();
var heart = new Heart();
var life = new Life();
var start = new Start();
var gameover = new GameOver();
var retry = new Retry();
var clear = new Clear();
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

$(document).click(function(loc) {
    var Position = $("canvas").offset();
    var x_click = loc.pageX;
    var y_click = loc.pageY;
    var x = x_click - Position.left;
    var y = y_click - Position.top;
    if (oops && x >= retry.x && x <= (retry.x + 300) && y >= retry.y && y <= (retry.y + 51)) {
        oops = false;
        heartCount = 1;
        player.reset();
        allEnemies.splice(0, allEnemies.length);
        allEnemies.push(new Enemy(0, 68),
            new Enemy(0, 151),
            new Enemy(0, 234));
        again = true;
        heart.x = 200;
        heart.y = 68;
    }
});
