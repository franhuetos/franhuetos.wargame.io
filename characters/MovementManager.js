import { Score } from '../classes/Score.js';

export class MovementManager {
    static STATES = {
        STOPPED: "STOPPED",
        MOVING: "MOVING",
        SHOTTING: "SHOTTING",
        PAUSED: "PAUSED",
        DIE: "DIE"
    }

    actionPrefix;
    sprite;
    state = "stopped";
    scene;
    pointerPosition = null;
    relativePosition = null;
    hasArrivedToPointer = true;
    POINTER_WIDTH = 20;
    VELOCITY = 20;
    isShoting = false;
    score;

    constructor(sprite, scene, state = MovementManager.STATES.STOPPED) {
        this.sprite = sprite;
        this.scene = scene.relatedScene;
        this.score = scene.relatedScene.score;
        this.actionPrefix = scene.type;
        this.state = MovementManager.STATES[state] || MovementManager.STATES.STOPPED;
        this.VELOCITY = this.sprite.velocity;
        this.pointerPosition = null;
        this.hasArrivedToPointer = true;
        // this.score = new Score();
        // this.score.init(this.actionPrefix);


    }


    pause() {
        // if (this.sprite.isAlive) {
        //     // this.sprite.body.setBounce(1, 1);
        //     // this.state = MovementManager.STATES.PAUSED;
        //     soldier.body.bounce.x = 2;
        //     soldier.body.bounce.y = 2;
        // }
    }

    stop() {
        if (this.sprite.isAlive) {
            this.state = MovementManager.STATES.STOPPED;
            this.sprite.body.stop();
            this.sprite.body.setVelocity(0);
            this.sprite.play(this.actionPrefix + '_stop', true);
        }
    }

    die() {
        //TODO: asegurar que el soldado se elimina del ciclo de update
        if (this.sprite.isAlive) {
            this.sprite.isAlive = false;
            this.state = MovementManager.STATES.DIE;
            this.sprite.play(this.actionPrefix + '_die', true);
            this.sprite.setImmovable(true);
            this.sprite.body.enable = false;
            this.score.die(this.actionPrefix);
            this.scene.time.delayedCall(1000, ()=> { 
                this.killSprite();
            }, this, null); 
            if(this.sprite.selectable){
                this.sprite.isSelected = false;
            }
        }
    }

    explode() {
        //TODO: asegurar que el soldado se elimina del ciclo de update
        if (this.sprite.isAlive) {
            this.sprite.isAlive = false;
            this.state = MovementManager.STATES.DIE;
            this.sprite.play(this.actionPrefix + '_explode', true);
            this.sprite.setImmovable(true);
            this.sprite.body.enable = false;
            this.score.die(this.actionPrefix);
            this.scene.time.delayedCall(1000, ()=> { 
                this.killSprite();
            }, this, null); 
            if(this.sprite.selectable){
                this.sprite.isSelected = false;
            }
        }
    }

    killSprite(){
        this.sprite.active = false; // lo ponemos inactivo en el ciclo de phaser
        this.sprite.body.gameObject.setAlpha(0.2);
        this.sprite.body.gameObject.clearTint();
        this.sprite.shotArea.destroy(); // destruimos el area de disparo
        this.sprite.destroy(); // mantenemos vivo el sprite para que se vea en pantalla
    }

    jump() {
        if (this.sprite.isAlive) {
            this.sprite.play(this.actionPrefix + '_jump', true);
        }
    }

    walk(x, y) {
        if (this.sprite.isAlive) {
            this.sprite.body.setVelocity(this.VELOCITY);
            this.state = MovementManager.STATES.MOVING;
            let pointerX = (this.pointerPosition) ? this.pointerPosition.x : null;
            let pointerY = (this.pointerPosition) ? this.pointerPosition.y : null;
            let xPosition = x || pointerX;
            let yPosition = y || pointerY;
            // this.pointerPosition = new Phaser.Geom.Rectangle(xPosition, yPosition, this.POINTER_WIDTH);

            if (xPosition != null && yPosition != null) {
                this.pointerPosition = {
                    x: xPosition,
                    y: yPosition
                };
                this.setSoldierOrientation();
                this.sprite.play(this.actionPrefix + '_walk');
                this.scene.physics.moveTo(this.sprite, xPosition, yPosition, this.VELOCITY);
            }

        }
    }

    shot(enemy) {

        if (this.sprite.isAlive && enemy.isAlive && this.state !== MovementManager.STATES.SHOTTING) {
            this.sprite.state = MovementManager.STATES.SHOTTING;

            this.setSoldierOrientation({ x: enemy.x, y: enemy.y });

            if(!this.isShoting){
                this.isShoting = true;
                this.scene.shotAudio.play();
                this.sprite.play(this.actionPrefix + '_shot', true);
                var wait = Phaser.Math.Between(0, 300);
                this.scene.time.delayedCall(800 + wait, (soldier)=> { 
                    this.isShoting = false;
                    this.arrivalArea && this.walk(this.arrivalArea.x, this.arrivalArea.y);
                }, this, null); 
                this.score.shot(this.actionPrefix);

                var damage = Phaser.Math.Between(0, 10);
                if (damage === 2 || damage === 3) {
                    enemy.lives = enemy.lives - 1;
                    this.score.hit(this.actionPrefix);

                    if (enemy.lives <= 0) {
                        enemy.movementManager.die();
                        if (!this.isStatic && !this.hasArrivedToPointer) {
                            this.walk();
                        }
                    }
                }
            }
            

            
        }

    }

    bomb(enemy) {

        if (this.sprite.isAlive && enemy.isAlive && this.state !== MovementManager.STATES.SHOTTING) {
            this.sprite.state = MovementManager.STATES.SHOTTING;

            this.setSoldierOrientation({ x: enemy.x, y: enemy.y });

            if(!this.isShoting){
                this.isShoting = true;
                this.scene.shotAudio.play();
                this.sprite.play(this.actionPrefix + '_shot', true);
                let wait = Phaser.Math.Between(0, 300);
                this.scene.time.delayedCall(10000 + wait, (soldier)=> { this.isShoting = false; }, this, null); 
                this.score.shot(this.actionPrefix);
                this.scene.explosions.create(enemy.x, enemy.y);
            } 
        }

    }

    setSoldierOrientation(pointerPosition) {
        let pointer = pointerPosition || this.pointerPosition;
        if (this.sprite.x > pointer.x) {
            this.setLeftSoldierOrientation();
        } else {
            this.setRightSoldierOrientation()
        }
    }

    setLeftSoldierOrientation() {
        if (this.sprite.orientation === "right") {
            this.sprite.orientation = "left";
            this.sprite.flipX = false;
        }
    }

    setRightSoldierOrientation() {
        if (this.sprite.orientation === "left") {
            this.sprite.orientation = "right";
            this.sprite.flipX = true;
        }
    }


}