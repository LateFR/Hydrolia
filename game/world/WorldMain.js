import WorldGeneration from "../../network/game/WorldGeneration.js"
import Chunk from "./chunk.js"

export default class World{
    constructor(scene,player){
        this.scene = scene
        this.player = player //permet d'ajouter des collisions avec le player
        this.bloc_size = scene.game.config.width/20
        this.chunkList = []
        this.seed = Math.round(Math.random()*100000) //seed aléatoire
        this.generate_chunk(0)
    }

    //ici que doit être géré le cassage de bloc via des évenement.
    // Et la génération progressive des chunks
    generate_chunk(x){ // x=position x du chunk
        let bloc_map = new WorldGeneration(this.seed,x) //génére un chunk (sur le serveur) 
        let chunk = new Chunk(this.scene,x,400,bloc_map,this.player) //400= position y du chunk, le max
        this.chunkList.push(chunk)
    }
}