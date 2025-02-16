import Player from "../game/entities/player.js"
import World from "../game/world/WorldMain.js"

export default class MainScene extends Phaser.Scene{
    constructor(){
        super("MainScene")
        this.player
        this.platform
        this.world 
    }
    preload(){  // Fonction où charger nos assets //à déplacer un jour dans une scene spécialisé
        this.load.image("player","/assets/black_square.png") //charge notre image de player (un carré noir pour l'instant)
    }
    create(){
        this.cameras.main.setBackgroundColor(0xffffff) //set le backround en blanc (hex)

        this.physics.world.setBounds(-100000,0,200000,400); //set la taille du monde. Ne pas toucher
        
        this.player = new Player(this,0,300)
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1); //La caméra suit le joueur
        this.player.create(); // on appelle le create
        this.add.existing(this.player);
        this.physics.add.existing(this.player);

        this.world = new World(this,this.player)
        

    }
    update() {
        this.player.update() //on "partage" l'update à player
    }

}