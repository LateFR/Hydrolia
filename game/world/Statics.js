export default class WorldStatic{
    constructor(scene){
        this.scene = scene
        this.bloc_size = scene.game.config.width/20
        this.CHUNK_WIDTH = 50
        this.HEIGHT = 300 //hauteur du monde
        this.WIDTH = 1000000 //Largeur du monde
        this.NUM_CHUNKS = 3 //Nombre de chunks à être charchés en même temps
        this.SPACING_THRESHOLD = 75 //Le seuil d'espacement (en blocs) entre le player et les chunks les plus loins de lui pour déclancher la création d'un chunk
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