import { MovementManager } from '../characters/MovementManager.js';
import { Soldiers } from './../characters/soldiers.js';
import { Tanks } from './../characters/tanks.js';
import { Explosions } from './../characters/explosions.js';
import { Towers } from './../characters/towers.js';

import { SelectionDemoScene } from './../classes/SelectionDemoScene.js';
import { Score } from './../classes/Score.js';
import { DebugPhaser } from '../classes/DebugPhaser.js';

export class Fase1 extends SelectionDemoScene {

    constructor() {
        super({ key: 'Fase1' });

        this.debugMode = false;

        //sounds
        this.shotAudio;

        //map
        this.map;

        //path
        this.pathFinder;

        //fase constants
        this.constants = {
            scale: 1.5
        }

        //events
        this.fireButton;

        //characters
        this.soldiers;
        this.tanks;
        this.enemies;
        this.tanksEnemies;

        //fase state
        this.pointerPosition;
        this.score = new Score();
        this.finished = false;

    }

    preload() {
        // this.debugMode = !!(this.physics.systems.arcadePhysics.config.debug === true);

        this.load.audio('shot_audio', ['sounds/shot.mp3']);
        this.load.audio('explosion_audio', ['sounds/Explosion1.mp3']);
        
        this.load.image('backgroundImage', 'test/pixil-frame-2.png');
        this.load.tilemapTiledJSON('backgroundMap', 'test/new_map.json');


        this.load.spritesheet('tower', 'images/tower16x16.png', { frameWidth: 16, frameHeight: 16, endFrame: 12 });
        this.load.spritesheet('explosion', 'images/explosion32x32.png', { frameWidth: 32, frameHeight: 32, endFrame: 8 });
        this.load.spritesheet('soldier', 'images/soldier_blue8x8.png', { frameWidth: 8, frameHeight: 8, endFrame: 16 });
        this.load.spritesheet('enemy', 'images/soldier_red8x8.png', { frameWidth: 8, frameHeight: 8, endFrame: 16 });
        this.load.spritesheet('tank', 'images/tank_blue26x12.png', { frameWidth: 26, frameHeight: 12, endFrame: 15 });
        this.load.spritesheet('tankenemy', 'images/tank_red26x12.png', { frameWidth: 26, frameHeight: 12, endFrame: 15 });
        this.fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    initializeState(){
        this.pointerPosition;
        // this.score = new Score();
        this.finished = false;        
    }

    create() {
        this.initializeState();

        this.shotAudio = this.sound.add('shot_audio');
        this.shotAudio.allowMultiple = true;
        this.explosionAudio = this.sound.add('explosion_audio');
        this.explosionAudio.allowMultiple = true;

        this.map = this.make.tilemap({ key: 'backgroundMap', width: screen.width, height: screen.height, tileWidth: 10, tileHeight: 10 });
        var tileset = this.map.addTilesetImage("background", 'backgroundImage');
        var backgroundLayer = this.map.createStaticLayer('Capa de patrones 1', tileset, 0, 0);

        this.explosions = new Explosions(this, 'explosion');

        this.towers = new Towers(this, 'tower');
        this.towersShotArea =  this.physics.add.group();
        for (var i = 0; i < 3; i++) {
            var x = Phaser.Math.RND.between(320, 350);
            var y = Phaser.Math.RND.between(180, 280);
            this.towers.create('tower', x, y, 'tower_stop');
            let shotArea = this.physics.add.image(150, 50);
            shotArea.body.setBoundsRectangle(x, y, 150, 50);
            this.towersShotArea.create(x, y, shotArea);
            this.towersShotArea.children.entries[i].item = this.towers.items.children.entries[i];
            this.towers.items.children.entries[i].shotArea = this.towersShotArea.children.entries[i];
            // this.towersShotArea.children.entries[i].body.width = 100;
            this.towers.items.children.entries[i].shotArea.setDepth(-1);
            this.towers.items.children.entries[i].shotArea.setSize(150, 50);
            this.towers.items.children.entries[i].setVelocity(0);
            this.towers.items.children.entries[i].setImmovable(true);
            this.towers.items.children.entries[i].setBounce(0);
        }

        this.soldiers = new Soldiers(this, 'soldier');
        this.soldiersShotArea =  this.physics.add.group();
        for (var i = 0; i < 20; i++) {
            var x = Phaser.Math.RND.between(150, 280);
            var y = Phaser.Math.RND.between(50, 280);
            this.soldiers.create('soldier', x, y, 'soldier_stop');
            let shotArea = this.physics.add.image(100, 50);
            shotArea.body.setBoundsRectangle(x, y, 100, 50);
            this.soldiersShotArea.create(x, y, shotArea);
            this.soldiersShotArea.children.entries[i].item = this.soldiers.items.children.entries[i];
            this.soldiers.items.children.entries[i].shotArea = this.soldiersShotArea.children.entries[i];
            // this.soldiersShotArea.children.entries[i].body.width = 100;
            this.soldiers.items.children.entries[i].shotArea.setDepth(-1);
            this.soldiers.items.children.entries[i].shotArea.setSize(100, 50);            
        }

        this.tanks = new Tanks(this, 'tank');
        this.tanksShotArea =  this.physics.add.group();
        for (var i = 0; i < 3; i++) {
            var x = Phaser.Math.RND.between(150, 280);
            var y = Phaser.Math.RND.between(50, 280);
            this.tanks.create('tank', x, y, 'tank_stop');
            let shotArea = this.physics.add.image(200, 50);
            shotArea.body.setBoundsRectangle(x, y, 200, 50);
            this.tanksShotArea.create(x, y, shotArea);
            this.tanksShotArea.children.entries[i].item = this.tanks.items.children.entries[i];
            this.tanks.items.children.entries[i].shotArea = this.tanksShotArea.children.entries[i];
            // this.tanksShotArea.children.entries[i].body.width = 400;
            this.tanks.items.children.entries[i].shotArea.setDepth(-1);
            this.tanks.items.children.entries[i].shotArea.setSize(200, 50);
        }

        this.enemies = new Soldiers(this, 'enemy');
        this.enemiesShotArea =  this.physics.add.group();
        for (var i = 0; i < 20; i++) {
            var x = Phaser.Math.RND.between(650, 750);
            var y = Phaser.Math.RND.between(50, 250);
            this.enemies.create('enemy', x, y, 'enemy_stop');
            let shotArea = this.physics.add.image(100, 50);
            shotArea.body.setBoundsRectangle(x, y, 100, 50);
            this.enemiesShotArea.create(x, y, shotArea);
            this.enemiesShotArea.children.entries[i].item = this.enemies.items.children.entries[i];
            this.enemies.items.children.entries[i].shotArea = this.enemiesShotArea.children.entries[i];
            // this.enemiesShotArea.children.entries[i].body.width = 100;
            this.enemies.items.children.entries[i].shotArea.setDepth(-1);
            this.enemies.items.children.entries[i].shotArea.setSize(100, 50);
        }

        this.tanksEnemies = new Tanks(this, 'tankenemy');
        this.tanksEnemiesShotArea =  this.physics.add.group();
        for (var i = 0; i < 3; i++) {
            var x = Phaser.Math.RND.between(650, 750);
            var y = Phaser.Math.RND.between(50, 250);
            this.tanksEnemies.create('tankenemy', x, y, 'tankenemy_walk');
            let shotArea = this.physics.add.image(200, 50);
            shotArea.body.setBoundsRectangle(x, y, 200, 50);
            this.tanksEnemiesShotArea.create(x, y, shotArea);
            this.tanksEnemiesShotArea.children.entries[i].item = this.tanksEnemies.items.children.entries[i];
            this.tanksEnemies.items.children.entries[i].shotArea = this.tanksEnemiesShotArea.children.entries[i];
            // this.tanksEnemiesShotArea.children.entries[i].body.width = 400;
            this.tanksEnemies.items.children.entries[i].shotArea.setDepth(-1);
            this.tanksEnemies.items.children.entries[i].shotArea.setSize(200, 50);
        }
        // this.tanksEnemies.create('tankenemy', this.map.widthInPixels - 60, 300, 'tankenemy_walk', 120);

        backgroundLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(backgroundLayer, [this.soldiers.items, this.enemies.items, this.tanks.items, this.tanksEnemies.items]);
 
        // this.physics.add.collider(this.soldiers.items, this.soldiers.items);
        // this.physics.add.collider(this.soldiers.items, [this.enemies.items, this.tanksEnemies.items], this.soldiers.fight, null, this);
        // this.physics.add.collider(this.tanks.items, [this.enemies.items, this.tanksEnemies.items], this.soldiers.fight, null, this);

        this.physics.add.collider(this.explosions.items, [this.soldiers.items, this.enemies.items, this.tanks.items, this.tanksEnemies.items, this.towers.items], function(actual, enemy){
            if(enemy.isAlive){
                if(enemy.instance === 'Soldiers' || enemy.instance === 'Towers'){
                    enemy.movementManager.explode();
                }else{
                    enemy.movementManager.die();
                }
            }
        }, null, this);

        this.physics.add.collider(this.towersShotArea, [this.enemies.items, this.tanksEnemies.items], function(actual, enemy){
            if(actual.item.isAlive && enemy.isAlive){
                // let distance = Phaser.Math.Distance.Between(actual.item.x, actual.item.y, enemy.x, enemy.y);
                // if(distance < actual.body.width){
                    this.towers.shot(actual.item, enemy);
                // }
            }
        }, null, this);

        this.physics.add.collider(this.soldiersShotArea, [this.enemies.items, this.tanksEnemies.items], function(actual, enemy){
            if(actual.item.isAlive && enemy.isAlive){
                // let distance = Phaser.Math.Distance.Between(actual.item.x, actual.item.y, enemy.x, enemy.y);
                // if(distance < actual.body.width){
                    this.soldiers.shot(actual.item, enemy);
                // }
            }
        }, null, this);

        this.physics.add.collider(this.enemiesShotArea, [this.soldiers.items, this.tanks.items, this.towers.items], function(actual, enemy){
            if(actual.item.isAlive && enemy.isAlive){
                // let distance = Phaser.Math.Distance.Between(actual.item.x, actual.item.y, enemy.x, enemy.y);
                // if(distance < actual.body.width){
                    this.enemies.shot(actual.item, enemy);
                // }
            }
        }, null, this);

        this.physics.add.collider(this.tanksShotArea, [this.enemies.items, this.tanksEnemies.items], function(actual, enemy){
            if(actual.item.isAlive && enemy.isAlive){
                // let distance = Phaser.Math.Distance.Between(actual.item.x, actual.item.y, enemy.x, enemy.y);
                // if(distance < actual.body.width){
                    this.tanks.shot(actual.item, enemy);
                // }
            }
        }, null, this);

        this.physics.add.collider(this.tanksEnemiesShotArea, [this.soldiers.items, this.tanks.items, this.towers.items], function(actual, enemy){
            if(actual.item.isAlive && enemy.isAlive){
                // let distance = Phaser.Math.Distance.Between(actual.item.x, actual.item.y, enemy.x, enemy.y);
                // if(distance < actual.body.width){
                    this.tanksEnemies.shot(actual.item, enemy);
                // }
            }
        }, null, this);

        this.createPointerSelector(this);

        let debugInitialize = new DebugPhaser(this.debugMode, this);

        this.input.on('pointerup', (pointer) => {
            let _pointer = pointer;
            if (this.selectionInitialized) {
                this.cleanRelativePositions();
                this.selectionInitialized = false;
                return;
            }
            if (!this.selectedItems.length) {
                return;
            }

            if (this.debugMode) {
                //ESTO SOLO VALE PARA DEPURAR, PARA PINTAR EL NUEVO AREA
                let redColor = "#ff007c";
                let yellowColor = "#f6ff00";
                //pintar e area seleccionada
                let newRec = new Phaser.Geom.Rectangle(this.selectedArea.x, this.selectedArea.y, this.selectedArea.width, this.selectedArea.height);
                // this.childrenScene.add.rectangle(newRec.x, newRec.y, newRec.width, newRec.height, redColor, 0.5);
                //pintar e area seleccionada en la nueva posicion
                let centeredNewRec = Phaser.Geom.Rectangle.CenterOn(new Phaser.Geom.Rectangle(this.selectedArea.x, this.selectedArea.y, this.selectedArea.width, this.selectedArea.height), pointer.x + (this.selectedArea.width / 2), pointer.y + (this.selectedArea.height / 2));
                this.selection = this.childrenScene.add.rectangle(centeredNewRec.x, centeredNewRec.y, centeredNewRec.width, centeredNewRec.height, yellowColor, 0.5);
            
                const debugGraphics = this.scene.add.graphics().setAlpha(0.7);
                backgroundLayer.renderDebug(debugGraphics, {
                    tileColor: null,
                    collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
                    faseColor: new Phaser.Display.Color(40, 39, 37, 255)
                });
            
            }

            this.soldiers.items.children.each((soldier) => {
                this.onSelectedElementPointerUp(soldier, _pointer);
            });

            this.enemies.items.children.each((soldier) => {
                this.onSelectedElementPointerUp(soldier, _pointer);
            });

            this.tanks.items.children.each((soldier) => {
                this.onSelectedElementPointerUp(soldier, _pointer);
            });

            this.tanksEnemies.items.children.each((soldier) => {
                this.onSelectedElementPointerUp(soldier, _pointer);
            });

        });

        this.input.on('pointermove', (pointer) => {
            // if(pointer.x < 20 && pointer.x > 0 && (pointer.worldX > 0 && pointer.worldX != NaN)){
            //     // this.cameras.main.pan(pointer.worldX + 1, this.cameras.main.midPoint.y, 2000);
            //     this.cameras.main.scrollX = this.cameras.main.scrollX - 1;
            //     // this.cameras.main.centerX(this.cameras.main.sc);
            // }
            // if(pointer.x > (this.cameras.main.worldView.width-20) && pointer.worldX < this.cameras.main.worldView.width){
            //     // this.cameras.main.pan(pointer.worldX + 1, this.cameras.main.midPoint.y, 2000);
            //     this.cameras.main.scrollX = this.cameras.main.scrollX + 1;
            // }
            // if(pointer.y < 20 && pointer.y > 0 && (pointer.worldY > 0 && pointer.worldY != NaN)){
            //     // this.cameras.main.pan(this.cameras.main.midPoint.x, pointer.worldY + 1, 2000);
            //     this.cameras.main.scrollY = this.cameras.main.scrollY - 1;
            // }
            // if(pointer.y > (this.cameras.main.worldView.height-20) && (pointer.worldY < this.cameras.main.worldView.height && pointer.worldY != NaN)){
            //     // this.cameras.main.pan(this.cameras.main.midPoint.x, pointer.worldY + 1, 2000);
            //     this.cameras.main.scrollY = this.cameras.main.scrollY + 1;
            // }

        });
 

    }


    cleanRelativePositions() {
        this.soldiers.items.children.each((soldier) => {
            soldier.movementManager.relativePosition = null;
        });

        this.enemies.items.children.each((soldier) => {
            soldier.movementManager.relativePosition = null;
        });

        this.tanks.items.children.each((soldier) => {
            soldier.movementManager.relativePosition = null;
        });

        this.tanksEnemies.items.children.each((soldier) => {
            soldier.movementManager.relativePosition = null;
        });
    }

    onSelectedElementPointerUp(element, pointer) {
        let selected = this.selectedItems.find(item => {
            return ((item.gameObject.name === element.name) && element.isAlive);
        });
        if (selected) {
            this.moveSelectedElement(element, pointer);
        } else {
            this.stopUnselectedElement(element);
        }
    }

    stopUnselectedElement(element) {
        element.movementManager.relativePosition = null;
        element.isSelected = false;
        
        if (element.movementManager.hasArrivedToPointer) {
            element.movementManager.stop();
        }
    }

    moveSelectedElement(element, pointer) {
        if (!element.movementManager.relativePosition) {
            element.movementManager.relativePosition = {
                x: element.x - this.selectedArea.centerX,
                y: element.y - this.selectedArea.centerY
            };
        }

        //new pointer position of de element
        let newPointer = {
            x: Math.abs(pointer.x + element.movementManager.relativePosition.x),
            y: Math.abs(pointer.y + element.movementManager.relativePosition.y)
        }
        let arrivalZone = new Phaser.Geom.Rectangle(newPointer.x, newPointer.y, element.body.width, element.body.height);
        let arrivalZoneCopy = new Phaser.Geom.Rectangle(newPointer.x, newPointer.y, element.body.width, element.body.height);
        let centeredArrivalZone = Phaser.Geom.Rectangle.CenterOn(arrivalZone, newPointer.x, newPointer.y);
        // let arrivalArea = new Phaser.Geom.Rectangle(newPointer.x, newPointer.y, width, width);

        if (this.debugMode) {
            this.selection = this.childrenScene.add.rectangle(centeredArrivalZone.x, centeredArrivalZone.y, centeredArrivalZone.width, centeredArrivalZone.height, "#1995dc", 0.5);
        }

        element.movementManager.arrivalArea = centeredArrivalZone;
        element.isSelected = true;
        element.movementManager.hasArrivedToPointer = false;

        // let relativePositionX = element.movementManager.arrivalArea.centerX + element.movementManager.relativePosition.x;
        // let relativePositionY = element.movementManager.arrivalArea.centerY + element.movementManager.relativePosition.y;

        element.movementManager.walk(newPointer.x, newPointer.y);

    }

    // tankImpact(tank, soldier) {
    //     tank.anims("tank_shot");
    //     soldier.die(soldier);
    // }

    elementHasArriveToPointer(element) {
        if (element.movementManager.state === MovementManager.STATES.MOVING) {

            if (Phaser.Geom.Rectangle.Contains(element.movementManager.arrivalArea, element.x, element.y)) {
                element.movementManager.hasArrivedToPointer = true;
                element.movementManager.stop();
            }

        }
    }


    update() {
        if(this.finished) { return; }
        // if (this.fireButton.isDown) {
        //     this.tank.play('tank_shot');
        //     this.soldiers.items.children.each((soldier) => {
        //         this.soldiers.shot(soldier);
        //     });
        // }

        let soldiersAlive = 0;
        let enemiesAlive = 0;
        let tanksAlive = 0;
        let tanksEnemiesAlive = 0;

        this.soldiers.items.children.each((soldier) => {
            if (soldier.isAlive) {
                soldiersAlive++;
                soldier.shotArea.setPosition(soldier.x, soldier.y);
                this.elementHasArriveToPointer(soldier);
            }
        });

        // this.soldiersShotArea.children.each((shotArea) => {
        //     console.log(shotArea);
        //     shotArea.x = shotArea.item.x;
        //     shotArea.y = shotArea.item.y;
        // });

        this.enemies.items.children.each((enemy) => {
            if (enemy.isAlive) {
                enemiesAlive++;
                enemy.shotArea.setPosition(enemy.x, enemy.y);
                this.elementHasArriveToPointer(enemy);
            }
        });

        this.tanks.items.children.each((tank) => {
            if (tank.isAlive) {
                tanksAlive++;
                tank.shotArea.setPosition(tank.x, tank.y);
                this.elementHasArriveToPointer(tank);
            }
        });

        this.tanksEnemies.items.children.each((tank) => {
            if (tank.isAlive) {
                tanksEnemiesAlive++;
                tank.shotArea.setPosition(tank.x, tank.y);
                this.elementHasArriveToPointer(tank);
            }
        });

        this.towers.items.children.each((tower) => {
            tower.shotArea.setPosition(tower.x, tower.y);
        });

        if (soldiersAlive <= 0 && tanksAlive <= 0) {
            this.finished = true;
            this.enemies.items.children.each((character) => {
                character.movementManager.hasArrivedToPointer = true;
                character.movementManager.stop();
                character.movementManager.jump();
            });
            var timer = this.time.delayedCall(5000, this.goToResume, ['Enemies win'], this);
        }
        if (enemiesAlive <= 0 && tanksEnemiesAlive <= 0) {
            this.finished = true;
            this.soldiers.items.children.each((character) => {
                character.movementManager.hasArrivedToPointer = true;
                character.movementManager.stop();
                character.movementManager.jump();
            });
            var timer = this.time.delayedCall(5000, this.goToResume, ['You win'], this);
        }


        

        // this.soldiers.moveSoldiers();

    }

    goToResume(data){
        console.log(this.score);
        this.scene.start('GameOver', { message: data, score: this.score });
    }

}