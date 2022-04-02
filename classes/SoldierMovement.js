export class SoldierMovement {

    /**
     * 
     * @param {*} fase 
     */
    constructor(fase) {
        this.scene = fase;

        this.scene.load.spritesheet('soldier', 'images/soldier_blue8x8.png', { frameWidth: 8, frameHeight: 8, endFrame: 16 });
        this.scene.load.spritesheet('enemy', 'images/soldier_red8x8.png', { frameWidth: 8, frameHeight: 8, endFrame: 16 });
    }

    stop(sprite) {
        sprite.body.stop();
        sprite.body.setVelocity(0);
        sprite.play(sprite.itemType + '_stop', true);
    }

    die(sprite) {
        //TODO: asegurar que el soldado se elimina del ciclo de update
        sprite.play(sprite.itemType + '_die', true);
        sprite.setImmovable(true);
        sprite.body.enable = false;
        sprite.body.gameObject.setAlpha(0.8);
    }
}