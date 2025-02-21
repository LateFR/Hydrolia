export default class Inventory extends Phaser.Scene{
    constructor(){
        super("Inventory")
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