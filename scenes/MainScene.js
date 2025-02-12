export default class MainScene extends Phaser.Scene{
    constructor(){
        super("MainScene")
    }
    preload(){

    }
    create(){
        const player = this.add.rectangle(50,50,50,50,0xffffff) // créé un nouveau sprite avec pour id "player". physics le rend sensible à la physique. On peut faire un sprite sans "physics". Ici, tant qu'on a pas d'Asset, c'est un rectagle. Ligne originale: this.physics.add.sprite(100,100,"player")
        this.physics.add.existing(player)//ajoute la physique. A supprimer quand sprite et assets
        player.body.setCollideWorldBounds(true); // Empêche de sortir de l'écran 

        const platform = this.physics.add.staticGroup() //groupe d'objet statique. Plateforme dans notre cas
        platform.create(400,500,"platform") 

        this.physics.add.collider(player,platform)
        const cursors = this.input.keyboard.createCursorKeys()

    }
}