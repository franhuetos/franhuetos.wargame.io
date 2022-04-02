       //Pathfinder -> crea una ruta para mover el srpite
       {
        this.createPointerSelector(this);
        this.load.scenePlugin('rexboardplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js', 'rexBoard', 'rexBoard');
        this.pathFinder = this.rexBoard.add.pathFinder({
            occupiedTest: false,
            blockerTest: false,

            //** cost **
            cost: 1,   // constant cost
            costCallback: undefined,
            costCallbackScope: undefined,
            cacheCost: true,

            pathMode: 10,  // A*
            weight: 10,   // weight for A* searching mode
            shuffleNeighbors: false,
        });
       }

       // Creacion manual de mapa
       {
        const mapJson = MapFase1.data.layers.dataTest;
        const level = [
            [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
            [  1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1 ],
            [  2,   2,   2,   2,   2,   2,   2,   2,   2,   2,   2 ],
            [  7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7 ],
            [  12,   12,   12,   12,   12,   12,   12,   12,   12,   12,   12 ],
            [  13,   13,   13,   13,   13,   13,   13,   13,   13,   13,   13 ],
            [  15,   15,   15,   15,   15,   15,   15,   15,   15,   15,   15 ],
            [  15,   15,   15,   15,   15,   15,   15,   15,   15,   15,   15 ],
            [  15,   15,   15,   15,   15,   15,   15,   15,   15,   15,   15 ],
            [  15,   15,   15,   15,   15,   15,   15,   15,   15,   15,   15 ]
          ];
        this.map = this.make.tilemap({data: level, tileWidth: 10, tileHeight: 10});
        this.map.addTilesetImage("tiles");
        const layer = this.map.createLayer(0, "tiles", 0, 0);
       }

       //Crear una capa random en el mapa
       {
           layer.randomize(0, 0, this.map.width, this.map.height, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
       }
