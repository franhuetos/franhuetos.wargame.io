

export class Intro extends Phaser.Scene {

    music;
    counter;
    text;
    clickButton;

    constructor() {
        super({ key: 'Intro' });
    }

    preload() {
        this.load.image('capture', 'images/capture.png');
        this.load.audio('crazy_tanks', ['sounds/CrazyTanks.wav']);
    }

    create() {
        this.add.image(400, 300, 'capture');
        this.cameras.main.setBackgroundColor("#000000");
        this.music = this.sound.add('crazy_tanks');
        this.text = this.add.text(400, 200, 'Crazy Tanks');
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

        this.clickButtonStart = this.add.text(400, 300, 'Start', { fill: '#ffffff' })
            .setInteractive()
            .on('pointerup', () => {
                document.body.requestFullscreen();
                this.music.stop();
                this.scene.start('Fase1');
            });
        this.clickButtonStart.setFontSize(50);
        this.clickButtonStart.setOrigin(0.5);

        this.clickButtonMultiplayer = this.add.text(400, 400, 'Multiplayer', { fill: '#ffffff' })
            .setInteractive()
            .on('pointerup', () => {
                document.body.requestFullscreen();
                this.music.stop();
                this.scene.start('Multiplayer');
            });
        this.clickButtonMultiplayer.setFontSize(50);
        this.clickButtonMultiplayer.setOrigin(0.5);

    }


    update() {
        var offset = this.moveToXY(this.input, this.text.x, this.text.y, 8);

        this.text.setShadow(offset.x, offset.y, 'rgba(10, 10, 10, 0.5)', this.distanceToPointer(this.text, this.input) / 30);
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