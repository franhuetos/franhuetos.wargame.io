import { Intro } from './scenes/intro.js';
import { Multiplayer } from './scenes/multiplayer.js';
import { Fase1 } from './scenes/fase1.js';
import { GameOver } from './scenes/gameOver.js';

const RESOLUTION ={
  XS: {
    WIDTH: 640,
    HEIGHT: 480
  },
  SM: {
    WIDTH: 960,
    HEIGHT: 540
  },
  MD: {
    WIDTH: 1280,
    HEIGHT: 720
  },
  LG: {
    WIDTH: 1920,
    HEIGHT: 1080
  },
  XL: {
    WIDTH: 2560,
    HEIGHT: 1440
  }

}

const config = {
  type: Phaser.AUTO,
  width: screen.width,
  height: screen.height,
  scene: [Intro, Multiplayer, Fase1, GameOver],
  zoom: 1,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 400 },
      debug: false,
      debugShowBody: false,
      debugShowStaticBody: false,
    }
  },
  // scale: {
  //   mode: Phaser.Scale.SHOW_ALL,
  //   parent: 'fase1',
  //   autoCenter: Phaser.Scale.CENTER_BOTH,
  //   width: screen.width,
  //   height: screen.height
  // },
  scale: {
    mode: Phaser.DOM.SHOW_ALL,
    orientation: Phaser.Scale.Orientation.PORTRAIT,
    width: 800,
    height: 600
    // width: RESOLUTION.XS.WIDTH,
    // height: RESOLUTION.XS.HEIGHT
  },
  backgroundColor: '#48d055',
  myConfig: {
    item: {
      scale: 0
    }
  }
}

var game = new Phaser.Game(config);