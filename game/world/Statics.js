export default class WorldStatic{
    constructor(scene){
        this.scene = scene
        this.bloc_size = scene.game.config.width/20
    }
    
    to_phaser_coor(x=0,y=0){ //on peut appeller avec 1 seule coor et ne recuperer que celle qui nous arrange
        return x*this.bloc_size,y*this.bloc_size //fonction pour connaitre les coordonnées phaser a partir de coordonnées hydrolia (bloc par bloc)
    }
    to_hydrolia_coor(x=0,y=0){
        return x/this.bloc_size,y/this.bloc_size
    }
}