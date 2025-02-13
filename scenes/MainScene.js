import Player from "../entities/Player.js"

export default class MainScene extends Phaser.Scene{
    constructor(){
        super("MainScene")
        this.player
        this.platform
        this.cursors
    }
    preload(){  // Fonction où charger nos assets //à déplacer un jour dans une scene spécialisé
        this.load.image("player","/assets/black_square.png") //charge notre image de player (un carré noir pour l'instant)
    }
    create(){
        this.cameras.main.setBackgroundColor(0xffffff) //set le backround en balnc (hex)

        this.player = new Player(this,100,100)

        //à déplacer dans un fichier entities
        this.platform = this.physics.add.staticGroup({ //groupe d'objet statique. Plateforme dans notre cas
            key: 'assets/black_square.png',
            frameQuantity: 100,  // Nombre d'objets créés dans le groupe
            setXY: { x: 0, y: this.game.config.height, stepX: 20 }  // Position initiale et intervalle entre les objets
        });
        this.physics.add.collider(this.player,this.platform)
        this.cursors = this.input.keyboard.createCursorKeys()

    }
    update() {
        this.player.update() //on "partage" l'update à player
    }

}