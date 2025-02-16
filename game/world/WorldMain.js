import WorldGeneration from "../../network/game/WorldGeneration.js"
import Chunk from "./chunk.js"
import WorldStatic from "./Statics.js"

export default class World{
    constructor(scene,player){
        this.scene = scene
        this.player = player //permet d'ajouter plus tard des collisions avec le player
        
        this.chunkList = new Map() //Map qui stock en keys les chunks actuellement chargés, et en values le reference point en [x,y]
        this.seed = Math.round(Math.random()*100000) //seed aléatoire
        this.Static = new WorldStatic(this.scene)
        
        this.createChunk(0,true) //On crée le premier chunk
    }

    //ici que doit être géré le cassage de bloc via des évenement.
    // Et la génération progressive des chunks
    async createChunk(x,first=false){ // x=position x du chunk   first = pour savoir si c'est le premier chunk de la game
        let worldGen = new WorldGeneration(this.seed) //génére un chunk (sur le serveur) 
        
        let bloc_map = await worldGen.getChunk(x)
        
        let chunk = new Chunk(this.scene,bloc_map,this.player) //Initialise le chunk
        await chunk.create() //On créé le chunk
        await chunk.endOfLoading() //On finalise la création du chunk
        console.log("Chunk created")

        this.chunkList.set(chunk,chunk)

        if (first){
            this.player.setPosition(this.Static.to_phaser_x(chunk.X_of_HigestY),this.Static.to_phaser_y(chunk.highestY-3)) //On place le player au point le plus haut du premier chunk (avec un peu plus de hauteur). On le passe avant en position in game
            this.player.setGravityY(this.player.defaultGravityY) //Active la grvité du player
        }
    }
}