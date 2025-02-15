export default class World extends Phaser.GameObjects{
    constructor(scene){
        super(scene)
        this.scene = scene
        this.bloc_size = scene.game.config.width/20
    }

    //ici que doit être géré le cassage de bloc via des évenement.
    // Et la génération progressive des chunks
}