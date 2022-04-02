export class DebugPhaser {
    debugMode = false;
    scene = null;

    constructor(debugMode, scene) {
        this.debugMode = debugMode;
        this.scene = scene;

        this.initialize();
    }

    initialize(){

        if(this.debugMode){
            //Pinta de otro color las zonas collisionables
            // const debugGraphics = this.scene.add.graphics().setAlpha(0.7);
            // backgroundLayer.renderDebug(debugGraphics, {
            //     tileColor: null,
            //     collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
            //     faseColor: new Phaser.Display.Color(40, 39, 37, 255)
            // });
        }
        
    }
    

  
  }