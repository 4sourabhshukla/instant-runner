
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
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.initGame();
        this.endButton = this.add.text(680, 16, 'End Game', { fontSize: '32px', fill: '#f00', backgroundColor: '#222', padding: { x: 8, y: 4 } })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.hitObstacle(this.player, null);
            });
    }

    initGame() {
        console.log('Running initGame()');
        this.score = 0;

        this.player = this.physics.add.sprite(100, 548, 'player');
        this.player.setOrigin(0.5, 1); // bottom center
        this.player.setCollideWorldBounds(true);
        // Force the physics body to update to match the visual position
this.player.body.updateFromGameObject();
        // Adjust the player's body size (tweak values as needed)
        //this.player.body.setSize(this.player.width * 0.6, this.player.height * 0.8).setOffset(this.player.width * 0.2, this.player.height * 0.2);
        // Tile the ground across the bottom
        this.ground = this.physics.add.staticGroup();
        for (let x = 0; x < 800; x += 64) { // 64 is the width of your ground tile, adjust if needed
            this.ground.create(x + 32, 580, 'ground'); // +32 to center each tile
        }
        this.obstacles = this.physics.add.group();
        this.spawnObstacle();

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });

        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.obstacles, this.ground);
        this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);

        this.input.on('pointerdown', () => {
            if (this.player.body.touching.down || this.player.body.onFloor()) {
                this.player.setVelocityY(-500);
            }
        });
    }

    spawnObstacle() {
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                const obstacle = this.obstacles.create(800, 548, 'obstacle');
                obstacle.setOrigin(0.5, 1); // bottom center aligns with y=580
                obstacle.body.setAllowGravity(false); // Optional: if you want obstacles to not fall
                // Force the physics body to update to match the visual position
                obstacle.body.updateFromGameObject();
                obstacle.setVelocityX(-200);
                obstacle.setImmovable(true);
                if (obstacle.body) {
                    // Adjust the obstacle's body size (tweak values as needed)
                    //obstacle.body.setSize(obstacle.width * 0.6, obstacle.height * 0.8).setOffset(obstacle.width * 0.2, obstacle.height * 0.2);
                }
                obstacle.refreshBody && obstacle.refreshBody(); // Ensure physics body matches visual
                this.spawnObstacle();
            },
            loop: false
        });
    }


    update() {
        if (this.obstacles) {
            this.obstacles.children.iterate(child => {
                if (child && child.x < -50) child.destroy();
                // Score when obstacle passes player
                if (child && !child.scored && child.x < this.player.x) {
                    child.scored = true;
                    this.score++;
                    this.scoreText.setText('Score: ' + this.score);
                }
            });
        }
        // Add this for spacebar jump
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            if (this.player.body.touching.down || this.player.body.onFloor()) {
                this.player.setVelocityY(-500);
            }
        }
    }

    hitObstacle(player, obstacle) {
        this.physics.pause();
        player.setTint(0xff0000);
        this.add.text(300, 300, 'Game Over!', { fontSize: '32px', fill: '#fff' });
        // Add Restart button
        const restartButton = this.add.text(320, 350, 'Restart', { fontSize: '28px', fill: '#0f0', backgroundColor: '#222', padding: { x: 16, y: 8 } })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.restart();
            });
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
