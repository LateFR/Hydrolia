import WorldGeneration from "../../network/game/WorldGeneration.js"
import Chunk from "./chunk.js"
import WorldStatic from "./Statics.js"

export default class World{
    constructor(scene,player){
        this.scene = scene
        this.player = player //permet d'ajouter plus tard des collisions avec le player
        
        this.chunkList = [] //Liste des chunks actuellement chargés. Le plus à droite de la map est en index -1 et le plus à gauche en 0.
        this.inCreating = false //Empêche que plus de 1 chunk soit créé à la fois. Preserve les performances
        this.firstCreateFinished = false //permet d'empecher le lancement d'update tant que l'on a pas créé le premier chunk

        this.seed = Math.round(Math.random()*100000) //seed aléatoire
        this.Static = new WorldStatic(this.scene)
        
        this.createChunk(0,true, true) //On crée le premier chunk
        let x = 0+this.Static.CHUNK_WIDTH //Définit la position du nouveau chunk en fonction du chunk le plus à droite et de la taille d'un chunk (0=position d'origine du chunk 1)
        this.createChunk(x,true) //Crée le 2e chunk (vers la droite)
        // x = -this.Static.CHUNK_WIDTH //Définit la position du nouveau chunk en fonction du chunk le plus à droite et de la taille d'un chunk (0=position d'origine du chunk 1)
        // this.createChunk(x,false) //Crée le 3e chunk (vers la gauche)
        return this
    }

    //ici que doit être géré le cassage de bloc via des évenement.
    // Et la génération progressive des chunks
    async createChunk(x,toRight = false, first=false){ // x=position x du chunk   toRight = si le nouveau chunk est le plus a droite (false= c'est le plus a gauche) first = pour savoir si c'est le premier chunk de la game
        this.inCreating = true
        console.log("x:",x)
        this.chunkList.forEach(chunk => {
            console.log(chunk.referencePoint)
        });
        let worldGen = new WorldGeneration(this.seed) //génére un chunk (sur le serveur) 
        
        let bloc_map = await worldGen.getChunk(x)
        
        let chunk = new Chunk(this.scene,bloc_map,this.player,x) //Initialise le chunk
        await chunk.create() //On créé le chunk
        await chunk.endOfLoading() //On finalise la création du chunk


        if (first){
            this.chunkList.push(chunk)
            let newX = this.Static.to_phaser_x(chunk.highestX)
            let newY = this.Static.to_phaser_y(chunk.highestY-3)
            
            this.player.setPosition(newX,newY) //On place le player au point le plus haut du premier chunk (avec un peu plus de hauteur). On le passe avant en position in game
            
            this.scene.cameras.main.setScroll(newX,newY)
            this.player.setGravityY(this.player.defaultGravityY) //Active la gravité du player

            this.firstCreateFinished = true

        }else if(toRight){
            this.chunkList.push(chunk) //Ajoute le chunk a la fin
        }else if(!toRight){
            this.chunkList.unshift(chunk) //Ajoute le chunk au début
        }
        this.inCreating = false //fin de la création
    }

    async removeChunk(chunk){
        let index = this.chunkList.indexOf(chunk) //Cherche l'index du chunk
        this.chunkList.slice(index,1) //Supprime le chunk des chunks actifs
        chunk.delete() //Appelle la fonction de suppression du chunk
        chunk = null //Libère la mémoire
        console.log("chunk deleted",index)

    }
    async update(){
        if (!this.firstCreateFinished || this.inCreating){
            return
        }
        
        let playerX = this.Static.to_hydrolia_x(this.player.body.x) //Convertit en coor hydrolia

        console.log(this.Static.to_hydrolia_x(this.player.body.x), "|",Math.abs(this.chunkList[this.chunkList.length - 1].referencePoint- playerX),Math.abs(this.chunkList[this.chunkList.length - 1].referencePoint- playerX)< this.Static.SPACING_THRESHOLD,Math.abs(this.chunkList[0].referencePoint - playerX),Math.abs(this.chunkList[0].referencePoint - playerX)< this.Static.SPACING_THRESHOLD,"|",this.Static.SPACING_THRESHOLD)

        if (Math.abs(this.chunkList[this.chunkList.length - 1].referencePoint- playerX) < this.Static.SPACING_THRESHOLD){ //Si jamais le player est à moins de 50 (valeur définit dans static) blocs du chunk le plus à droite
            if (this.chunkList.length >= this.Static.NUM_CHUNKS){ 
                this.removeChunk(this.chunkList[0]) //Supprime le chunk à l'opposé si il y a moins 5 chunks chargés
            }

            if (!this.inCreating){
                let x = this.chunkList[this.chunkList.length - 1].referencePoint + this.Static.CHUNK_WIDTH //Définit la position du nouveau chunk en fonction du chunk le plus à droite et de la taille d'un chunk
                this.createChunk(x,true) //On crée un chunk avec la taille d'un chunk plus loin
            }

        }
        if (Math.abs(this.chunkList[0].referencePoint - playerX) < this.Static.SPACING_THRESHOLD){ //Si jamais le player est à moins de 50 blocs du chunk le plus à gauche
            if (this.chunkList.length >= this.Static.NUM_CHUNKS){ //Supprime le chunk à l'opposé si il y a moins 5 chunks chargés
                this.removeChunk(this.chunkList[this.chunkList.length - 1])
            }

            if (!this.inCreating){
                let x = this.chunkList[0].referencePoint - this.Static.CHUNK_WIDTH //Définit la position du nouveau chunk crée en fonction du chunk le plus à gauche et de la taille d'un chunk. Opération inverse que pour la droite car on le nouveau chunk est plus à gauche donc la coor. diminue
                this.createChunk(x,false) //On crée un chunk avec la taille d'un chunk plus loin
            }

        }

    }
}