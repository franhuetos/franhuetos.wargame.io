export class Utils {
    constructor() { }


    // se le pasan dos sprites y comprueban si hay overlapping (se superponen)
    checkCollision(spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        return Phaser.Rectangle.intersects(boundsA, boundsB);
    }


}