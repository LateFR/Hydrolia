import WorldStatic from "./Statics.js"
export default class Chunk{
    constructor(scene,bloc_map,player,referencePoint){
        this.scene = scene
        
        this.player = player
        this.bloc_map = bloc_map //Contient le chunk généré par le serveur (le chunk)
        this.highestY = 400 //Stock le point hydrolia y le plus haut du chunk pour permettre, si le chunk est le premier, d'y placer le joueur
        this.highestX = 0 //Stock le y du point le plus haut du chunk

        this.referencePoint = referencePoint //Sert de point de référence X du chunk. Permet notament de savoir quand charcher/décharger un chunk

        this.Statics = new WorldStatic(scene)
        this.blocs = new Map //Map contenant la liste de tous les éléments du chunk et leurs positions => Bloc : [x,y]

        this.chunk = this.scene.physics.add.staticGroup() //Créé le groupe statique, le chunk
        return this
    }

    async create(){
        return new Promise((resolve) => { //On retourne une promesse pour pouvoir await la création du chunk
            Object.keys(this.bloc_map).forEach(key => { //Key est composée ainsi: [type,x,y]
                if (key==undefined || this.bloc_map[key][0]=="air"){
                    return // Signifie qu'il y a un bloc d'air. Peut être modifé par le futur depuis le backend
                }
                let x
                let y
                let bloc
                let type

                x = this.bloc_map[key][1][0] //coordonée x
                y = this.bloc_map[key][1][1] //coordonée y
                type = this.bloc_map[key][0] //le type de bloc (dirt,stone,ect.)
                
                if (y<this.highestY){ //Met à jour le point le plus haut
                    this.highestY = y
                    this.highestX = x
                }

                x = this.Statics.to_phaser_x(x) //on transforme nos position hydrolia en position in game
                y = this.Statics.to_phaser_y(y)
                
                bloc = this.chunk.create(x,y,type) // Créé le bloc
                
                bloc.setDisplaySize(this.Statics.bloc_size,this.Statics.bloc_size) // définit la taile du bloc   
                
                bloc.body.allowGravity = false; // Il ne doit pas tomber (annule la gravité)
                
                bloc.body.updateFromGameObject(); //Cette fonction miracle fait correspondre la hitbox et le visuels, reglant tout les problemes de hitbox rencontrés

                //A rajouter lorsque le cassage des blocs sera implémenté.
                
                // bloc.setInteractive()
                // bloc.on("pointerover",()=>{
                //     console.log("Un bloc est survolé")
                // })
                
                this.blocs.set(bloc,[x,y])

            });
            
            console.log("Chunk created")
            resolve() //On a finit l'execution, on résoud la promesse

        })
    }
    async endOfLoading(){ //Fonction de fin de chargement. A appeller apres le set du chunk, permet de reduire la charge initiale pour le confort utilisateur

        this.scene.physics.add.collider(this.player, this.chunk); //Ajoute la collision entre le player et le chunk, et douc touts les blocs
        this.scene.physics.add.collider(this.player, this.chunk,(player)=>{ //Ajoute un evenement de collision entre le player et les blocs
            player.emit('landed');//on verifit si on touche le sol. Si oui, on dit que le saut est stoppé
        })
        
        //Cet interval ne sert actuellement a rien, mais si il y a une boucle a ajouter, merci d'utiliser l'interval

        // let interval = setInterval(()=>{
        //     console.log(this.player.body.x,this.player.body.y)
        //     if (i>Object.keys(this.blocs).length){
        //         clearInterval(interval)
        //     }
        //     let bloc = Object.keys(this.blocs)[i] //on parcourt tout les blocs
        // },wait)

        console.log("Chunk is ready")
    }

    async delete(){
        this.chunk.clear(true, true); // Supprime tout le chunk et ses blocs
    }
}