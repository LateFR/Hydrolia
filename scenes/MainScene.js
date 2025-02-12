export default class MainScene extends Phaser.Scene{
    constructor(){
        super("MainScene")
    }
    preload(){

    }
    create(){
        let player = this.physics.add.sprite(100,100,"player") // créé un nouveau sprite avec pour id "player". physics le rend sensible à la physique. On peut faire un sprite sans "physics"

        let platform = this.physics.add.staticGroup() //groupe d'objet statique. Plateforme dans notre cas
        platform.create(400,500,"platform") 

        this.physics.add.collider(player,platform)
        const cursors = this.input.keyboard.createCursorKeys()

    }
}