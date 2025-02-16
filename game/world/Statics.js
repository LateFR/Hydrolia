export default class WorldStatic{
    constructor(scene){
        this.scene = scene
        this.bloc_size = scene.game.config.width/20
    }
    
    to_phaser_x(x=0){ //on peut également appeller avec 1 seule coor et ne recuperer que celle qui nous arrange*
        return x*this.bloc_size //fonction pour connaitre les coordonnées phaser a partir de coordonnées hydrolia (bloc par bloc)
    }
    to_phaser_y(y=0){
        return y*this.bloc_size
    }
    to_hydrolia_x(x=0){
        return x/this.bloc_size
    }
    to_hydrolia_y(y=0){
        return y/this.bloc_size
    }
}