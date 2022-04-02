

export class GameOver extends Phaser.Scene {

    winnerText;
    music;
    counter;
    text;
    clickButton;
    score;

    constructor() {
        super({ key: 'GameOver' });
    }

    init(data){
        this.score = data.score;
        this.winnerText = data.message || 'Game over';
    }

    preload() {

        this.load.audio('crazy_tanks', ['sounds/CrazyTanks.wav']);
    }

    create() {
        this.cameras.main.setBackgroundColor("#000000");
        this.music = this.sound.add('crazy_tanks');

        let soldier = this.score.soldier || { shot: 0, hits: 0, die: 0 };
        let tank = this.score.tank || { shot: 0, hits: 0, die: 0 };
        let enemy = this.score.enemy || { shot: 0, hits: 0, die: 0 };
        let tankenemy = this.score.tankenemy || { shot: 0, hits: 0, die: 0 };

        let youShots = soldier.shot + tank.shot;
        let youHits = soldier.hits + tank.hits;
        let youKilled = enemy.die + tankenemy.die;
        let youAcc = ((youHits/youShots)*100).toFixed(2);

        let enemyShots = enemy.shot + tankenemy.shot;
        let enemyHits = enemy.hits + tankenemy.hits;
        let enemyKilled = soldier.die + tank.die;
        let enemyAcc = ((enemyHits/enemyShots)*100).toFixed(2);

        let scoreText = `
                    Shots      Hits      Killed      Accuracy
        You:        ${youShots}         ${youHits}         ${youKilled}           ${youAcc}%
        Enemy:      ${enemyShots}         ${enemyHits}         ${enemyKilled}           ${enemyAcc}%
        `;
        this.textScore = this.add.text(50, 50, scoreText);
        this.textScore.align = 'center';
        this.textScore.font = 'Arial Black';
        this.textScore.fontSize = 40;
        this.textScore.fontWeight = 'bold';
        this.textScore.fill = '#ec008c';

        this.text = this.add.text(400, 200, this.winnerText);
        this.text.align = 'center';
        this.text.font = 'Arial Black';
        this.text.fontSize = 70;
        this.text.fontWeight = 'bold';
        this.text.fill = '#ec008c';

        this.text.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 0);
        this.text.setFontSize(50);
        this.text.setOrigin(0.5);
        this.music.play();

        // this.input.on('pointerup', (pointer) => {
        //     this.scene.start('Fase1');
        // });

        this.clickButton = this.add.text(400, 300, 'Play Again', { fill: '#ffffff' })
            .setInteractive()
            .on('pointerover', () => this.clickButton.setStyle({ fill: '#ff0' }))
            .on('pointerout', () => this.clickButton.setStyle({ fill: '#ffffff' }))
            .on('pointerdown', () => {
                this.music.stop();
                this.scene.start('Intro');
            });
        this.clickButton.setFontSize(50);
        this.clickButton.setOrigin(0.5);

    }


    update() {
        var offset = this.moveToXY(this.input.activePointer, this.text.x, this.text.y, 8);

        this.text.setShadow(offset.x, offset.y, 'rgba(10, 10, 10, 0.5)', this.distanceToPointer(this.text, this.input.activePointer) / 30);
    }

    distanceToPointer(displayObject, pointer) {

        this._dx = displayObject.x - pointer.x;
        this._dy = displayObject.y - pointer.y;

        return Math.sqrt(this._dx * this._dx + this._dy * this._dy);

    }

    moveToXY(displayObject, x, y, speed) {

        var _angle = Math.atan2(y - displayObject.y, x - displayObject.x);

        var x = Math.cos(_angle) * speed;
        var y = Math.sin(_angle) * speed;

        return { x: x, y: y };

    }

}