export class SelectionDemoScene extends Phaser.Scene {
    /** @type {Phaser.GameObjects.Rectangle} */
    // selection;
    selectedItems;
    childrenScene;
    selectedArea;
    selectedAreaAux;
    selectedAreaPainted;
    selectionInitialized;
    paintedAreaColor = "#1995dc";
    paintedAreaOpacity = 0.5;

    constructor(key) {
        super(key);
        this.selectedItems = [];
        this.selectionInitialized = false;
        // create a new Rectangle
        this.selectedArea = new Phaser.Geom.Rectangle(0, 0, 0, 0);
        this.selectedAreaAux = new Phaser.Geom.Rectangle(0, 0, 0, 0);
    }

    createPointerSelector(childrenScene) {
        this.childrenScene = childrenScene;

        //create clean painted area
        this.selectedAreaPainted = this.childrenScene.add.rectangle(0, 0, 0, 0, this.paintedAreaColor, this.paintedAreaOpacity);

        this.input.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
        this.input.on(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove, this);
        this.input.on(Phaser.Input.Events.POINTER_UP, this.handlePointerUp, this);
    }

    /**
     * @param {Phaser.Input.Pointer} pointer
     * @param {Phaser.GameObjects.GameObject[]} currentlyOver
    */
    handlePointerDown(pointer, currentlyOver) {
        this.selectionInitialized = false;
        this.selectedAreaAux.x = pointer.x
        this.selectedAreaAux.y = pointer.y
        this.selectedAreaAux.centerX = pointer.x
        this.selectedAreaAux.centerY = pointer.y
        this.selectedAreaAux.width = 0;
        this.selectedAreaAux.height = 0;

        //clean painted area
        this.selectedAreaPainted.x = this.selectedAreaAux.x;
        this.selectedAreaPainted.y = this.selectedAreaAux.y;
        // this.selectedAreaPainted.width = 0;
        // this.selectedAreaPainted.height = 0;
    }

    /**
     * @param {Phaser.Input.Pointer} pointer
     * @param {Phaser.GameObjects.GameObject[]} currentlyOver
    */
    handlePointerMove(pointer, currentlyOver) {
        if (!pointer.isDown) {
            return
        }

        const dx = pointer.x - pointer.prevPosition.x
        const dy = pointer.y - pointer.prevPosition.y

        this.selectedAreaPainted.width += dx;
        this.selectedAreaPainted.height += dy;

        //update pinted area
        this.selectedAreaAux = new Phaser.Geom.Rectangle(
            this.selectedAreaPainted.x,
            this.selectedAreaPainted.y,
            this.selectedAreaPainted.width,
            this.selectedAreaPainted.height
        )

        // console.log("this.selectedAreaAux %O", this.selectedAreaAux);

        // check if width or height is negative
        // and then adjust
        if (this.selectedAreaAux.width < 0) {
            this.selectedAreaAux.x += this.selectedAreaAux.width
            this.selectedAreaAux.width *= -1
        }
        if (this.selectedAreaAux.height < 0) {
            this.selectedAreaAux.y += this.selectedAreaAux.height
            this.selectedAreaAux.height *= -1
        }

    }

    /**
     * @param {Phaser.Input.Pointer} pointer
     * @param {Phaser.GameObjects.GameObject[]} currentlyOver
    */
    handlePointerUp(pointer, currentlyOver) {

        if (this.selectedAreaAux.width > 4 || this.selectedAreaAux.height > 4) {
            this.selectionInitialized = true;

            this.soldiers.items.children.entries.forEach(e=> {
                if(e.selectable != false && e.isAlive){
                    e.setAlpha(1);
                    e.clearTint();
                }
            });
            this.tanks.items.children.entries.forEach(e=> {
                if(e.selectable != false && e.isAlive){
                    e.setAlpha(1);
                    e.clearTint();
                }
            });
            this.enemies.items.children.entries.forEach(e=> {
                if(e.selectable != false && e.isAlive){
                    e.setAlpha(1);
                    e.clearTint();
                }
            });
            this.tanksEnemies.items.children.entries.forEach(e=> {
                if(e.selectable != false && e.isAlive){
                    e.setAlpha(1);
                    e.clearTint();
                }
            });

            this.selectedArea.x = this.selectedAreaAux.x;
            this.selectedArea.y = this.selectedAreaAux.y;
            this.selectedArea.width = this.selectedAreaAux.width;
            this.selectedArea.height = this.selectedAreaAux.height;
            this.selectedArea.centerX = this.selectedAreaAux.centerX;
            this.selectedArea.centerY = this.selectedAreaAux.centerY;

            // this.selectedAreaPainted = this.childrenScene.add.rectangle(this.selectedArea.x, this.selectedArea.y, this.selectedArea.width, this.selectedArea.height, "#00bfff", 0.5);

            // use the new Rectangle to check for overlap
            const selected = this.physics.overlapRect(
                this.selectedArea.x,
                this.selectedArea.y,
                this.selectedArea.width,
                this.selectedArea.height
            );

            // do something with selected
            this.selectedItems = selected;
            this.selectedItems.forEach(element => {
                if(element.gameObject.isAlive && element.gameObject.selectable != false){
                    element.gameObject.setAlpha(1);
                    element.gameObject.setTint(0xffe80054);
                }
            });

        }

        //clean selectedAreaAux
        this.selectedAreaAux = new Phaser.Geom.Rectangle(0, 0, 0, 0);
        //clean painted area
        this.selectedAreaPainted.x = 0;
        this.selectedAreaPainted.y = 0;
        this.selectedAreaPainted.width = 0;
        this.selectedAreaPainted.height = 0;

    }
}