import WorldGeneration from "../../network/game/WorldGeneration.js"
import Chunk from "./Chunk.js"

export default class World{
    constructor(scene,player){
        this.scene = scene
        this.player = player //permet d'ajouter des collisions avec le player
        this.bloc_size = scene.game.config.width/20
        this.chunkList = []
        this.seed = Math.random()*100000 //seed aléatoire
        
    }

    //ici que doit être géré le cassage de bloc via des évenement.
    // Et la génération progressive des chunks
    generate_chunk(x){ // x=position x du chunk
        bloc_map = WorldGeneration(this.seed,x) //génére un chunk (sur le serveur) 
        let chunk = new Chunk(this.scene,x,y=400,bloc_map=bloc_map,this.player)
        this.chunkList.push(chunk)
    }
}