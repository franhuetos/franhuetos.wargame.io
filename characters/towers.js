import { MovementManager } from "./MovementManager.js";

export class Towers {
  
  shotArea;
  
  constructor(scene, spritesheet) {
    this.type = spritesheet || "tower";
    this.relatedScene = scene;
    this.items = this.relatedScene.physics.add.group();
    this.createAnims();
  }

  createAnims(){
    const tower_anims = {
      tower_die: {
          key: this.type + '_die',
          frames: this.relatedScene.anims.generateFrameNumbers(this.type, { start: 2, end: 5, first: 2 }),
          frameRate: 7,
          repeat: 0
      },
      tower_explode: {
          key: this.type + '_explode',
          frames: this.relatedScene.anims.generateFrameNumbers(this.type, { start: 7, end: 11, first: 7 }),
          frameRate: 7,
          repeat: 0
      },
      tower_shot: {
          key: this.type + '_shot',
          frames: this.relatedScene.anims.generateFrameNumbers(this.type, { frames: [0, 1] }),
          frameRate: 7,
          repeat: 0
      },
      tower_stop: {
        key: this.type + '_stop',
        frames: this.relatedScene.anims.generateFrameNumbers(this.type, { start: 0, end: 0, first: 0 }),
        frameRate: 7,
        repeat: 0
      }
    };
    this.relatedScene.anims.create(tower_anims.tower_die);
    this.relatedScene.anims.create(tower_anims.tower_explode);
    this.relatedScene.anims.create(tower_anims.tower_shot);
    this.relatedScene.anims.create(tower_anims.tower_stop);
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
        max: y && y.max? y.max  : 280
      }
    };
    this.shotArea =  this.relatedScene.physics.add.group();
    for (let i = 0; i < numItems; i++) {
        let x = Phaser.Math.RND.between(coordinates.x.min, coordinates.x.max);
        let y = Phaser.Math.RND.between(coordinates.y.min, coordinates.y.max);
        this.create('tower', x, y, 'tower_stop');
        let shotArea = this.relatedScene.physics.add.image(150, 50);
        shotArea.body.setBoundsRectangle(x, y, 150, 50);
        this.shotArea.create(x, y, shotArea);
        this.shotArea.children.entries[i].item = this.items.children.entries[i];
        this.items.children.entries[i].shotArea = this.shotArea.children.entries[i];
        // this.shotArea.children.entries[i].body.width = 100;
        this.items.children.entries[i].shotArea.setDepth(-1);
        this.items.children.entries[i].shotArea.setSize(150, 50);
        this.items.children.entries[i].setVelocity(0);
        this.items.children.entries[i].setImmovable(true);
        this.items.children.entries[i].setBounce(0);
    }
    return this.shotArea;
  }


  create(name, x, y, animation, velocity, relatedPower) {
    let tower = this.items.create(x, y, this.type);
    tower.instance = 'Towers';
    tower.itemType = name;
    tower.name = `${name}_${this.items.children.entries.length}`;
    tower.movementManager = new MovementManager(tower, this);
    tower.anims.play(animation);
    tower.lives = 1;
    tower.isAlive = true;
    tower.selectable = false;
    tower.isStatic = true;
    tower.setImmovable(true);
    tower.setScale(this.relatedScene.constants.scale || 1);
    tower.orientation = "left";
    tower.movementManager.setRightSoldierOrientation();
    tower.movementManager.hasArrivedToPointer = true;

    tower.on('animationcomplete', function (anim, frame) {
      this.emit('animationcomplete_' + anim.key, anim, frame);
    }, tower);

    tower.on('animationcomplete_' + tower.itemType + '_shot', function (anim, frame) {
      tower.movementManager.state = MovementManager.STATES.STOPPED;
      if (tower.isAlive) {
        tower.movementManager.stop();
      }
    }, tower);

    tower.once('animationcomplete_' + tower.itemType + '_die', function (anim, frame) {
      tower.active = false;
      tower.shotArea.active = false;
      tower.shotArea.destroy();
    }, tower);

    tower.on('animationcomplete_' + tower.itemType + '_explode', function (anim, frame) {
        tower.active = false;
        tower.shotArea.active = false;
        tower.shotArea.destroy();
    }, tower);

  }


  fight(soldier, enemy) {
    soldier.setVelocity(0, 0);
    enemy.setVelocity(0, 0);
    soldier.setBounce(0, 0);
    soldier.setBounce(0, 0);
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

  shot(tower, enemy) {
    if (tower.isAlive && enemy.isAlive) {
      tower.movementManager.shot(enemy);
    }
  }


}