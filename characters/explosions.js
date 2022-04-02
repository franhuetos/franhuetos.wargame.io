
export class Explosions {
  
    constructor(scene, x, y) {
        this.type = "explosion";
        this.relatedScene = scene;
        // this.sprite = this.relatedScene.add.sprite(x, y, 'explosion'); 
        this.items = this.relatedScene.physics.add.group();
        this.createAnims();
    }

    createAnims(){
        const explosion_anims = {
            explosion_explode: {
                key: 'explosion_explode',
                frames: this.relatedScene.anims.generateFrameNumbers('explosion', { start: 0, end: 8, first: 0 }),
                frameRate: 7,
                repeat: 0
            }
        };
        this.relatedScene.anims.create(explosion_anims.explosion_explode);
    }

    createSounds(){
        
    }

    create(x, y) {
        
        let explosion = this.items.create(x, y, this.type);
        explosion.setScale(this.relatedScene.constants.scale || 1);
        
        explosion.on('animationcomplete', function (anim, frame) {
            this.emit('animationcomplete_' + anim.key, anim, frame);
        }, explosion);
    
        explosion.on('animationcomplete_' + this.type + '_explode', function (anim, frame) {
            explosion.destroy();
        }, explosion);

        this.relatedScene.explosionAudio.play();
        explosion.play('explosion_explode');
    }

}