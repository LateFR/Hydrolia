import WorldGeneration from "../../network/game/WorldGeneration.js"
import Chunk from "./chunk.js"

export default class World{
    constructor(scene,player){
        this.scene = scene
        this.player = player //permet d'ajouter des collisions avec le player
        this.bloc_size = scene.game.config.width/2
        this.chunkList = []
        this.seed = Math.round(Math.random()*100000) //seed aléatoire
        this.create_chunk(0)
    }

    //ici que doit être géré le cassage de bloc via des évenement.
    // Et la génération progressive des chunks
    create_chunk(x){ // x=position x du chunk
        let worldGen = new WorldGeneration(this.seed) //génére un chunk (sur le serveur) 
        
        worldGen.getChunk(x).then((response)=>{
            let bloc_map=response
            let chunk = new Chunk(this.scene,x,0,bloc_map,this.player) //0 = position y du chunk
            this.chunkList.push(chunk)
        })
    }
}