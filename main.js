
class StreetDash extends Phaser.Scene {
    constructor() {
        super('StreetDash');
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('obstacle', 'assets/obstacle.png');

        this.load.on('complete', () => {
            console.log('All assets loaded!');
        });
    }

    create() {
        console.log('Create method called');

        // For local testing, skip FBInstant
        this.initGame();
    }

    initGame() {
        console.log('Running initGame()');

        this.add.text(100, 100, 'Hello Phaser!', { fontSize: '32px', fill: '#fff' });

        this.score = 0;

        this.player = this.physics.add.sprite(100, 500, 'player').setScale(1);
        this.ground = this.physics.add.staticGroup();
        this.ground.create(400, 580, 'ground').setScale(1).refreshBody(); // closer to bottom
        this.obstacles = this.physics.add.group();
        this.spawnObstacle();

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });

        this.physics.add.collider(this.player, this.ground);
        this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);

        this.input.on('pointerdown', () => {
            if (this.player.body.touching.down) {
                this.player.setVelocityY(-350);
            }
        });

        this.timer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.score++;
                this.scoreText.setText('Score: ' + this.score);
            },
            loop: true
        });
    }

    spawnObstacle() {
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                const obstacle = this.obstacles.create(800, 530, 'obstacle');
                obstacle.setVelocityX(-200);
                this.spawnObstacle();
            },
            loop: false
        });
        
    }

    update() {
        if (this.obstacles) {
            this.obstacles.children.iterate(child => {
                if (child && child.x < -50) child.destroy();
            });
        }
    }

    hitObstacle(player, obstacle) {
        this.physics.pause();
        player.setTint(0xff0000);
        this.timer.remove();
        console.log('Game Over. Score:', this.score);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#333',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: StreetDash
};

new Phaser.Game(config);
