import Player from "../../entities/player.js"
import World from "../game/world/WorldMain.js"

export default class MainScene extends Phaser.Scene{
    constructor(){
        super("MainScene")
        this.player
        this.platform
        this.world = new World()
    }
    preload(){  // Fonction où charger nos assets //à déplacer un jour dans une scene spécialisé
        this.load.image("player","/assets/black_square.png") //charge notre image de player (un carré noir pour l'instant)
    }
    create(){
        this.cameras.main.setBackgroundColor(0xffffff) //set le backround en balnc (hex)

        this.physics.world.setBounds();// Désactive la limite du monde (donc il faut faire attention a pas faire de lag)

        this.player = new Player(this,100,100)
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1); //La caméra suit le joueur
        this.player.create(); // on appelle le create
        this.add.existing(this.player);
        this.physics.add.existing(this.player);

        
        this.physics.add.collider(this.player, this.platform, (player, platform) => {
            player.emit('landed');//on verifit si on touche le sol. Si oui, on dit que le saut est stoppé
        });
        this.cursors = this.input.keyboard.createCursorKeys()

    }
    update() {
        this.player.update() //on "partage" l'update à player
    }

}