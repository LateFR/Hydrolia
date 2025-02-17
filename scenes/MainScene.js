import Player from "../game/entities/player.js"
import World from "../game/world/WorldMain.js"
import WorldStatic from "../game/world/Statics.js"

export default class MainScene extends Phaser.Scene{
    constructor(){
        super("MainScene")
        this.player
        this.platform
        this.world 
    }
    preload(){  // Fonction où charger nos assets //à déplacer un jour dans une scene spécialisé
        this.load.image("player","/static/assets/black_square.png") //charge notre image de player (un carré noir pour l'instant)
        this.load.image("stone","/static/assets/stone.png")
        this.load.image("dirt", "/static/assets/dirt.png")
    }
    create(){
        this.cameras.main.setBackgroundColor(0xffffff) //set le backround en blanc (hex)

        let Static = new WorldStatic(this) // On passe la scene (ici, this) à WorldStatic

        let heightWorld = Static.to_phaser_y(Static.HEIGHT) //On choisit la taille du monde de façon a ce qu'elle fasse 300(ou la hauteur définie dans Static) bloc de long
        let widthWorld = Static.to_phaser_x(Static.WIDTH)
        this.physics.world.setBounds(-100000,0,widthWorld,heightWorld); //set la taille du monde. Ne pas toucher
        this.physics.world.drawDebug = true; // Affiche les limites du monde

        this.player = new Player(this,0,Static.to_phaser_y(50)) //On place le player a 360 blocs de haut (y=0 est le haut du monde, et on compte vers le bas)
        this.cameras.main.startFollow(this.player, true, 1, 1); //La caméra suit le joueur
        this.player.create(); // on appelle le create
        this.add.existing(this.player);
        this.physics.add.existing(this.player);
        this.physics.world.enable(this.player);
        console.log("Scène active ?", this.scene.isActive("MainScene"));
        this.world = new World(this,this.player)
        

    }
    update() {
        this.player.update() //on "partage" l'update à player
        this.world.update()
    }

}