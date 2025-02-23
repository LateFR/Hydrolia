import WorldStatic from "../game/world/Statics.js"

export default class Inventory extends Phaser.Scene{
    constructor(){
        super("Inventory")
        
        //Toutes les variables qui vont suivre seront définit dans create
        this.inventoryData = null //On instenciera ici le plugin InventoryData, on le recupère seulement dans create car il n'est pas encore pret lors de l'appel au constructeur
        this.Statics = null //Pareil. Ici sera instencié WorldStatics, mais il necessite la scene en paramètre, et elle n'existe pas encore lors de l'appel au contructeur

        this.SLOT_SIZE
        this.COLUMNS
        this.ROWS

        this.screenWidth
        this.screenHeight

        this.contenerSlot
    }
    create(){
        this.Statics = new WorldStatic(this) //Instencie WorldStatic avec la scene (this)
        this.inventoryData = this.plugins.get("InventoryData") //On instencit le plugin InventoryData comme une class.

        this.SLOT_SIZE = this.Statics.to_phaser_x(0.5) //On definit la valeur de SLOT_SIZE en fonction de la largeur X de l'ecran et des blocs. Donner une valeur hydrolia (bloc) en param.
        this.COLUMNS = 6
        this.ROWS = Math.ceil(this.inventoryData.NUMBER_OF_SLOTS/this.COLUMNS) //Définit dynamiquement rows par rapport au nombre de colomne et de slots. Math.ceil arrondit au superieur, rajoutant une ligne si necessaire. 

        this.screenWidth = this.scale.width
        this.screenHeight = this.scale.height

        this.contenerSlot = this.add.container( //Conteneur stokant tout les slot et item de l'inventaire. Permet notament de les placé par rapport au conteneur
            this.screenWidth/ 2, //Définit la position x du conteneur comme étant au centre de l'écran
            this.screenHeight/2, //Y centré
        )
        
        this.contenerSlot.setDepth(2)

        this.add.rectangle(
            this.screenWidth/ 2, //Définit la position x du rectangle comme étant au centre de l'écran
            this.screenHeight/2, //Y centré
            this.screenWidth/ 4, //Définit la hauteur, ici la moitié de la hauteur de l'écran
            this.screenWidth/4, //On fait un carré par rapport a la largeur
            0xF5F5DC //Couleur beige en hexadecimal 
        )

        this.updateInventory() //Créé les slots et leurs contenant
        this.setupListener()
    }

    async updateInventory(){ //A appeller pour mettre à jour l'affichage de l'inventaire (ou a le créer).
        let inventory = this.inventoryData.inventory
        let offsetX = -(this.screenWidth/15) //screenWidth/2 représente la largeur de l'inventaire, et la moitié de screenWidth/2 sa distance entre le centre et le bord
        let offsetY = -(this.screenWidth/15) //Même raisonnement, mais pour la hauteur
        
        for(let n=0; n<this.inventoryData.NUMBER_OF_SLOTS; n++){ //n represente le numéro du Slot et va de 0 à 29 (sauf si le nombre de slot a été changé)
            const x = ((n)%this.COLUMNS) * (this.SLOT_SIZE+2) +offsetX // slot%this.COLUMNS => donne la colone   * this.SLOT_SIZE => donne la distance par rapport au point 0    +offsetX => decale le point 0 a la gauche de l'inventaire
            const y = Math.floor((n)/this.ROWS) * (this.SLOT_SIZE+2) +offsetY // slot/this.ROWS => la ligne actuelle
            
            let slot = this.add.rectangle(x, y, this.SLOT_SIZE, this.SLOT_SIZE, 0xC8AD7F) //Créé un rectangle de largeur et de hauteur SLOT_SIZE, avec la couleur beige foncé
            this.contenerSlot.add(slot)

            if (inventory[n]!=null){//Si le slot est rempli
                let item = this.add.sprite(x,y,inventory[n]["is"]) //On créé sprite avec l'image de l'item, normalement loadé dans MainScene
                item.setDisplaySize(this.SLOT_SIZE*0.95,this.SLOT_SIZE*0.95) //On le redimensionne et on lui enleve 5% par rapport au rectangle du slot
                this.contenerSlot.add(item)
                item.setDepth(30) //Place l'item devant son fond, au premier plan.
            }
        };
    }

    setupListener(){
        this.input.keyboard.on("keydown-A",()=>{
            this.scene.stop() //Termine cette scene
            this.scene.resume("MainScene")
        })
    }
}