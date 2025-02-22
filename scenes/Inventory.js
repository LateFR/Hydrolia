export default class Inventory extends Phaser.Scene{
    constructor(){
        super("Inventory")
        this.inventoryData = this.plugins.get("InventoryData") //Instencit le plugin InventoryData comme une class.
        this.contenerSlot = this.add.container( //Conteneur stokant tout les slot et item de l'inventaire. Permet notament de les placé par rapport au conteneur
            this.scale.width/ 2, //Définit la position x du conteneur comme étant au centre de l'écran
            this.scale.height/2, //Y centré
        )
    }
    create(){
        this.add.rectangle(
            this.scale.width/ 2, //Définit la position x du rectangle comme étant au centre de l'écran
            this.scale.height/2, //Y centré
            this.scale.width/ 2, //Définit la hauteur, ici la moitié de la hauteur de l'écran
            this.scale.height/2, //Prend la moitié de la largeur de l'écran
            0xF5F5DC //Couleur beige en hexadecimal 
        )

        this.setupListener()
    }

    setupListener(){
        this.input.keyboard.on("keydown-A",()=>{
            this.scene.stop() //Termine cette scene
            this.scene.resume("MainScene")
        })
    }
}