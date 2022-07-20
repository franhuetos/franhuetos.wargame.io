import { MovementManager } from "./MovementManager.js";

export class Soldiers {

  shotArea;
  
  constructor(scene, spritesheet) {
    this.type = spritesheet || "soldier";
    this.relatedScene = scene;
    this.VELOCITY = {
      WALK: 20,
      STOP: 0
    };
    this.items = this.relatedScene.physics.add.group();
    this.shotArea =  this.relatedScene.physics.add.group();
    this.createAnims();
  }

  createAnims(){
    const soldier_anims = {
      soldier_walk: {
          key: this.type + '_walk',
          frames: this.relatedScene.anims.generateFrameNumbers(this.type, { start: 0, end: 3, first: 0 }),
          frameRate: 7,
          repeat: -1
      },
      soldier_die: {
          key: this.type + '_die',
          frames: this.relatedScene.anims.generateFrameNumbers(this.type, { start: 4, end: 6, first: 4 }),
          frameRate: 15,
          repeat: 0
      },
      soldier_jump: {
          key: this.type + '_jump',
          frames: this.relatedScene.anims.generateFrameNumbers(this.type, { start: 7, end: 9, first: 7 }),
          frameRate: 7,
          repeat: -1
      },
      soldier_explode: {
          key: this.type + '_explode',
          frames: this.relatedScene.anims.generateFrameNumbers(this.type, { start: 10, end: 14, first: 0 }),
          frameRate: 15,
          repeat: 0
      },
      soldier_stop: {
          key: this.type + '_stop',
          frames: this.relatedScene.anims.generateFrameNumbers(this.type, { start: 0, end: 0, first: 0 }),
          frameRate: 7,
          repeat: 0
      },
      soldier_shot: {
          key: this.type + '_shot',
          frames: this.relatedScene.anims.generateFrameNumbers(this.type, { frames: [15, 0] }),
          frameRate: 15,
          repeat: 0
      }
    };
    this.relatedScene.anims.create(soldier_anims.soldier_walk);
    this.relatedScene.anims.create(soldier_anims.soldier_die);
    this.relatedScene.anims.create(soldier_anims.soldier_jump);
    this.relatedScene.anims.create(soldier_anims.soldier_explode);
    this.relatedScene.anims.create(soldier_anims.soldier_stop);
    this.relatedScene.anims.create(soldier_anims.soldier_shot);
  }

  createGroup(numItems, x, y){
    numItems = numItems || 0;
    let coordinates = {
      x: {
        min: x && x.min? x.min : 0,
        max: x && x.max? x.max : 750
      },
      y: {
        min: y && y.min? y.min : 0,
        max: y && y.max? y.max : 280
      }
    };
    
    for (let i = 0; i < numItems; i++) {
        let x = Phaser.Math.RND.between(coordinates.x.min, coordinates.x.max);
        let y = Phaser.Math.RND.between(coordinates.y.min, coordinates.y.max);
        this.create(this.type, x, y, this.type + '_stop');
        let shotArea = this.relatedScene.physics.add.image(100, 50).setOrigin(0, 0);
        shotArea.body.setBoundsRectangle(x, y, 100, 50);
        this.shotArea.create(x, y, shotArea);
        this.shotArea.children.entries[i].item = this.items.children.entries[i];
        this.items.children.entries[i].shotArea = this.shotArea.children.entries[i];
        // this.shotArea.children.entries[i].body.width = 100;
        this.items.children.entries[i].shotArea.setDepth(-1);
        this.items.children.entries[i].shotArea.setSize(100, 50);            
    }
    return this.shotArea;
  }

  create(name, x, y, animation, velocity, relatedPower) {
    let soldier = this.items.create(x, y, this.type);
    soldier.instance = 'Soldiers';
    soldier.velocity = velocity || this.VELOCITY.WALK;
    soldier.itemType = name;
    soldier.name = `${name}_${this.items.children.entries.length}`;
    soldier.movementManager = new MovementManager(soldier, this);
    soldier.isSelected = false;
    soldier.anims.play(animation);
    soldier.lives = 1;
    soldier.isAlive = true;
    soldier.selectable = true;
    soldier.setVelocity(0);
    // soldier.setImmovable(true);
    soldier.setScale(this.relatedScene.constants.scale || 1);
    soldier.setCollideWorldBounds(true);
    soldier.setBounce(1);
    soldier.orientation = "left";
    soldier.movementManager.hasArrivedToPointer = true;
    // soldier.body.setSize(8, 1, false);
    // soldier.body.setOffset(0, 7);

    //añado cuadrado para area de disparo
    // soldier.shotArea = this.relatedScene.add.rectangle(x, y, soldier.width*20, soldier.height*20, "#ff007c", 0.1);
   


    soldier.on('animationcomplete', function (anim, frame) {
      this.emit('animationcomplete_' + anim.key, anim, frame);
    }, soldier);

    soldier.on('animationcomplete_' + soldier.itemType + '_shot', function (anim, frame) {
      soldier.movementManager.state = MovementManager.STATES.STOPPED;
      if (soldier.isAlive) {
        soldier.movementManager.stop();
      }
    }, soldier);

    soldier.once('animationcomplete_' + soldier.itemType + '_die', function (anim, frame) {
      soldier.active = false;
      soldier.shotArea.active = false;
      // soldier.destroy();
    }, soldier);

    soldier.on('animationcomplete_' + soldier.itemType + '_stop', function (anim, frame) {
      if (soldier.isAlive && soldier.movementManager.state === MovementManager.STATES.PAUSED && !soldier.movementManager.hasArrivedToPointer) {
        soldier.movementManager.walk();
      }
    }, soldier);

    // var collider = this.relatedScene.physics.add.overlap(soldier, this.items, function (soldier) {
    //   soldier.play("soldier_stop");
    //   soldier.body.stop();

    //   // this.relatedScene.physics.world.removeCollider(collider);
    // }, null, this, true);
  }

  // createGroup() {
  //   this.items.create(x, y, "soldier_stop")
  //   // this.relatedScene.physics.add.staticGroup({
  //   //   key: ["soldier_stop", "soldier_stop", "soldier_stop", "soldier_stop"],
  //   //   frameQuantity: 10,
  //   //   gridAlign: {
  //   //     width: 10,
  //   //     height: 4,
  //   //     cellWidth: 67,
  //   //     cellHeight: 34,
  //   //     x: 95,
  //   //     y: 100
  //   //   }
  //   // });
  // }

  fight(soldier, enemy) {
    soldier.setVelocity(0, 0);
    // soldier.setBounce(0, 0);
    if (soldier.movementManager.state === MovementManager.STATES.MOVING) {
      soldier.movementManager.stop();
    }
    if (enemy.movementManager.state === MovementManager.STATES.MOVING) {
      enemy.movementManager.stop();
    }
    if (enemy.isAlive && soldier.isAlive) {
      if(soldier.instance === 'Tanks'){
        soldier.movementManager.bomb(enemy);
      }else{
        soldier.movementManager.shot(enemy);
      }

      if(enemy.instance === 'Tanks'){
        enemy.movementManager.bomb(soldier);
      }else{
        enemy.movementManager.shot(soldier);
      }
      
    }

  }

  shot(soldier, enemy) {
    soldier.setVelocity(0, 0);
    // soldier.setBounce(0, 0);
    if (soldier.movementManager.state === MovementManager.STATES.MOVING) {
      soldier.movementManager.stop();
    }
    if (soldier.isAlive && enemy.isAlive) {
      soldier.movementManager.shot(enemy);
    }

  }

  // moveSoldiers() {
  //   this.items.children.each((soldier) => {

  //     if (!soldier.hasArrivedToPointer) {

  //       if (soldier.movementManager.state === MovementManager.STATES.MOVING &&
  //         Phaser.Geom.Rectangle.Contains(soldier.pointerPosition, soldier.x, soldier.y)) {
  //         this.stop(soldier);
  //       } else {
  //         this.walk(soldier);
  //       }

  //     }

  //   });
  // }

  pause(soldier1, soldier2) {
    if (soldier1.isAlive && soldier2.isAlive) {
      soldier1.movementManager.pause();
    }
  }

  tankImpact(soldier, tank) {
    tank.anims("tank_shot");
    this.die(soldier);
  }


}