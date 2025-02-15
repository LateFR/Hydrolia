export default class WorldStatic{
    constructor(scene){
        super(scene)
        this.scene = scene
        this.bloc_size = scene.game.config.width/20
    }
    
    to_phaser_coor(x,y){
        return (x*this.bloc_size,y*this.bloc_size) //fonction pour connaitre les coordonnées phaser a partir de coordonnées hydrolia (bloc par bloc)
    }
    to_hydrolia_coor(x,y){
        return (x/this.bloc_size,y/this.bloc_size)
    }
}