import WorldStatic from "../game/world/Statics"

export default class Inventory extends Phaser.Scene{
    constructor(){
        super("Inventory")
        
        this.inventoryData = this.plugins.get("InventoryData") //Instencit le plugin InventoryData comme une class.
        this.Statics = new WorldStatic(this) //Instencie WorldStatic avec la scene (this)
        this.SLOT_SIZE = this.Statics.to_phaser_x(0.5) //On definit la valeur de SLOT_SIZE en fonction de la largeur X de l'ecran et des blocs. Donner une valeur hydrolia (bloc) en param.
        this.COLUMNS = 6
        this.ROWS = Math.ceil(this.inventoryData.NUMBER_OF_SLOTS,this.COLUMNS) //Définit dynamiquement rows par rapport au nombre de colomne et de slots. Math.ceil arrondit au superieur, rajoutant une ligne si necessaire. 

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

    updateInventory(){ //A appeller pour mettre à jour l'affichage de l'inventaire (ou a le créer).
        
    }

    setupListener(){
        this.input.keyboard.on("keydown-A",()=>{
            this.scene.stop() //Termine cette scene
            this.scene.resume("MainScene")
        })
    }
}