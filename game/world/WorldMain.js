import WorldGeneration from "../../network/game/WorldGeneration.js"
import Chunk from "./chunk.js"
import WorldStatic from "./Statics.js"

export default class World{
    constructor(scene,player){
        this.scene = scene
        this.player = player //permet d'ajouter plus tard des collisions avec le player
        
        this.chunkList = new Map() //Map qui stock en keys les chunks actuellement chargés, et en values le reference point en x
        this.rightmost //Stock le chunk le plus a droite de chargé
        this.leftmost //Le plus à gauche
        this.inCreating = false //Empêche que plus de 1 chunk soit créé à la fois. Preserve les performances
        this.firstCreateFinished = false //permet d'empecher le lancement d'update tant que l'on a pas créé le premier chunk

        this.seed = Math.round(Math.random()*100000) //seed aléatoire
        this.Static = new WorldStatic(this.scene)
        
        this.createChunk(0,true, true) //On crée le premier chunk
        return this
    }

    //ici que doit être géré le cassage de bloc via des évenement.
    // Et la génération progressive des chunks
    async createChunk(x,toRight = false, first=false){ // x=position x du chunk   toRight = si le nouveau chunk est le plus a droite (false= c'est le plus a gauche) first = pour savoir si c'est le premier chunk de la game
        window.onerror = function(message, source, lineno, colno, error) {
            console.error("Erreur JS détectée :", message, "à", source, "ligne", lineno, "colonne", colno, error);
        };
        this.inCreating = true

        let worldGen = new WorldGeneration(this.seed) //génére un chunk (sur le serveur) 
        
        let bloc_map = await worldGen.getChunk(x)
        
        let chunk = new Chunk(this.scene,bloc_map,this.player,x) //Initialise le chunk
        await chunk.create() //On créé le chunk
        await chunk.endOfLoading() //On finalise la création du chunk

        this.chunkList.set(chunk,x)

        if (first){
            this.rightmost = chunk //Il est a la fois le plus à droite et le plus à gauche
            this.leftmost = chunk
            
            let newX = this.Static.to_phaser_x(chunk.highestX)
            let newY = this.Static.to_phaser_y(chunk.highestY-3)
            
            this.player.setPosition(newX,newY) //On place le player au point le plus haut du premier chunk (avec un peu plus de hauteur). On le passe avant en position in game
            this.player.body.reset(newX, newY);
            
            this.player.setGravityY(this.player.defaultGravityY) //Active la grvité du player

            this.firstCreateFinished = true

        }else if(toRight){
            this.rightmost = chunk
        }else if(!toRight){
            this.leftmost = chunk
        }

        this.inCreating = false //fin de la création
    }

    async removeChunk(chunk){
        this.chunkList.delete(chunk) //Supprime le chunk des chunks actifs
        this.chunk.delete()
        this.chunk = null

    }
    update(){
        if (!this.firstCreateFinished){
            return
        }
        
        let playerX = this.Static.to_hydrolia_x(this.player.body.x) //Convertit en coor hydrolia
        
        if (this.rightmost.referencePoint- playerX < this.Static.SPACING_THRESHOLD){ //Si jamais le player est à moins de 50 blocs du player
            if (this.chunkList.size >= this.Static.NUM_CHUNKS){ //Supprime le chunk à l'opposé si il y a moins 5 chunks chargés
                this.removeChunk(this.leftmost)
            }

            if (!this.inCreating){
                let x = this.rightmost.referencePoint + this.Static.CHUNK_WIDTH
                this.createChunk(x, toRight = true) //On créer un chunk avec la taille d'un chunk plus loin
            }

        }
        if (this.leftmost.referencePoint- playerX < this.Static.SPACING_THRESHOLD){ //Si jamais le player est à moins de 50 blocs du player
            if (this.chunkList.size >= this.Static.NUM_CHUNKS){ //Supprime le chunk à l'opposé si il y a moins 5 chunks chargés
                this.removeChunk(this.leftmost)
            }

            if (!this.inCreating){
                let x = this.leftmost.referencePoint - this.Static.CHUNK_WIDTH
                this.createChunk(x, toRight = false) //On créer un chunk avec la taille d'un chunk plus loin
            }

        }

    }
}