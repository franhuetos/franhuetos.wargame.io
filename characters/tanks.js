import { MovementManager } from "./MovementManager.js";

export class Tanks {
  
  constructor(scene, spritesheet) {
    this.type = spritesheet || 'tank';
    this.relatedScene = scene;
    this.VELOCITY = {
      WALK: 5,
      STOP: 0
    };
    this.items = this.relatedScene.physics.add.group();
    this.createAnims();
  }

  createAnims(){
    let tank_anims = {
      tank_walk: {
          key: this.type + '_walk',
          frames: this.relatedScene.anims.generateFrameNumbers(this.type, { start: 0, end: 7, first: 0 }),
          frameRate: 7,
          repeat: -1
      },
      tank_die: {
          key: this.type + '_die',
          frames: this.relatedScene.anims.generateFrameNumbers(this.type, { start: 10, end: 14, first: 0 }),
          frameRate: 15,
          repeat: 0
      },
      tank_stop: {
          key: this.type + '_stop',
          frames: this.relatedScene.anims.generateFrameNumbers(this.type, { start: 0, end: 0, first: 0 }),
          frameRate: 7,
          repeat: 0
      },
      tank_shot: {
          key: this.type + '_shot',
          frames: this.relatedScene.anims.generateFrameNumbers(this.type, { frames: [8, 9, 0] }),
          frameRate: 15,
          repeat: 0
      }
  }

  this.relatedScene.anims.create(tank_anims.tank_walk);
  this.relatedScene.anims.create(tank_anims.tank_die);
  this.relatedScene.anims.create(tank_anims.tank_stop);
  this.relatedScene.anims.create(tank_anims.tank_shot);

  }

  create(name, x, y, animation, velocity, relatedPower) {
    let tank = this.items.create(x, y, this.type);
    tank.instance = 'Tanks';
    tank.velocity = velocity || this.VELOCITY.WALK;
    tank.itemType = name;
    tank.name = `${name}_${this.items.children.entries.length}`;
    tank.movementManager = new MovementManager(tank, this);
    tank.isSelected = false;
    tank.anims.play(animation);
    tank.lives = 5;
    tank.isAlive = true;
    tank.selectable = true;
    tank.setVelocity(0);
    tank.setImmovable(true);
    tank.setScale(this.relatedScene.constants.scale || 1);
    tank.setCollideWorldBounds(true);
    // tank.body.setSize(tank.body.width*2, tank.body.height*2);
    tank.setBounce(0);
    tank.orientation = "left";
    tank.movementManager.hasArrivedToPointer = true;
    // tank.body.setSize(26, 1, false);
    // tank.body.setOffset(0, 11);


    tank.on('animationcomplete', function (anim, frame) {
      this.emit('animationcomplete_' + anim.key, anim, frame);
    }, tank);

    tank.on('animationcomplete_' + tank.itemType + '_shot', function (anim, frame) {
      tank.movementManager.state = MovementManager.STATES.STOPPED;
      if (tank.isAlive) {
        tank.movementManager.stop();
      }
    }, tank);

    tank.once('animationcomplete_' + tank.itemType + '_die', function (anim, frame) {
      tank.active = false;
      tank.shotArea.active = false;
    }, tank);

    tank.on('animationcomplete_' + tank.itemType + '_stop', function (anim, frame) {
      if (tank.isAlive && tank.movementManager.state === MovementManager.STATES.PAUSED && !tank.movementManager.hasArrivedToPointer) {
        tank.movementManager.walk();
      }
    }, tank);

    // var collider = this.relatedScene.physics.add.overlap(tank, this.items, function (tank) {
    //   tank.play("tank_stop");
    //   tank.body.stop();

    //   // this.physics.world.removeCollider(collider);
    // }, null, this, true);
  }

  createGroup() {
    this.items.create(x, y, "tank_stop")
    // this.relatedScene.physics.add.staticGroup({
    //   key: ["tank_stop", "tank_stop", "tank_stop", "tank_stop"],
    //   frameQuantity: 10,
    //   gridAlign: {
    //     width: 10,
    //     height: 4,
    //     cellWidth: 67,
    //     cellHeight: 34,
    //     x: 95,
    //     y: 100
    //   }
    // });
  }

  fight(tank, enemy) {
    tank.setVelocity(0, 0);
    enemy.setVelocity(0, 0);
    tank.setBounce(0, 0);
    tank.setBounce(0, 0);
    if (tank.movementManager.state === MovementManager.STATES.MOVING) {
      tank.movementManager.stop();
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

  shot(tank, enemy) {
    tank.setVelocity(0, 0);
    tank.setBounce(0, 0);
    if (tank.movementManager.state === MovementManager.STATES.MOVING) {
      tank.movementManager.stop();
    }
    if (tank.isAlive && enemy.isAlive) {
      if(tank.instance === 'Tanks'){
        tank.movementManager.bomb(enemy);
      }else{
        tank.movementManager.shot(enemy);
      }     
    }

  }

  // movetanks() {
  //   this.items.children.each((tank) => {

  //     if (!tank.hasArrivedToPointer) {

  //       if (tank.movementManager.state === MovementManager.STATES.MOVING &&
  //         Phaser.Geom.Rectangle.Contains(tank.pointerPosition, tank.x, tank.y)) {
  //         this.stop(tank);
  //       } else {
  //         this.walk(tank);
  //       }

  //     }

  //   });
  // }

  pause(tank1, tank2) {
    if (tank1.isAlive && tank2.isAlive) {
      tank1.movementManager.pause();
    }
  }

  tankImpact(soldier, tank) {
    tank.anims("tank_shot");
    this.die(soldier);
  }


}