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
        this.InventoryData = scene.plugins.get("InventoryData") //InventoryData est une class. On l'intencit ici
        this.blocs = new Map //Map contenant la liste de tous les éléments du chunk et leurs positions => Bloc : [x,y]

        this.chunk = this.scene.physics.add.staticGroup() //Créé le groupe statique, le chunk
        return this
    }

    async create(){
        return new Promise((resolve) => { //On retourne une promesse pour pouvoir await la création du chunk
            Object.keys(this.bloc_map).forEach(key => {this.newBloc(this.bloc_map[key])}) //Key est composée ainsi: [type,[x,y]]
            
            console.log("Chunk created")
            resolve() //On a finit l'execution, on résoud la promesse

        })
    }
    async endOfLoading(){ //Fonction de fin de chargement. A appeller apres le set du chunk, permet de reduire la charge initiale pour le confort utilisateur
        const player = this.player
        
        this.scene.physics.add.collider(this.player, this.chunk); //Ajoute la collision entre le player et le chunk, et douc touts les blocs
        this.scene.physics.add.overlap(this.player, this.chunk,()=>{ //Ajoute un evenement de collision entre le player et les blocs
            this.scene.events.emit('landed');//on verifit si on touche le sol. Si oui, on dit que le saut est stoppé
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

    async breakBloc(bloc){
        const playerX = this.Statics.to_hydrolia_x(this.player.body.x) //Recupere les cooredonnées x et y de player et les passes en coordonnées hydrolia
        const playerY = this.Statics.to_hydrolia_y(this.player.body.y)

        const blocX = this.Statics.to_hydrolia_x(this.blocs.get(bloc)[0]) //Pour les coor du bloc
        const blocY = this.Statics.to_hydrolia_y(this.blocs.get(bloc)[1])
        const max_dist = this.Statics.MAX_DIST_BREAK //Définit la distance maximum a laquelle on peut casser un bloc

        if (Math.abs(blocX-playerX)>max_dist || Math.abs(blocY-playerY)>max_dist){ //Si le player est a plus de 4 blocs de distance du bloc (x ou y), on ne le supprime pas
            return
        }
        this.chunk.remove(bloc,false,false) //Supprime du groupe mais ne detruit pas l'objet, sinon sa hitbox ne peux pas être supprimée. On doit tout faire manuellement
        this.blocs.delete(bloc) //Retire du map
        this.scene.physics.world.remove(bloc.body) //Supprime le corps physique du bloc (sa hitbox)
        bloc.destroy() // Supprime complètement l'objet de la scène
    }

    async newBloc(keyBloc){ //Key doit être composé ainsi composée ainsi: [type,[x,y]]
        if (keyBloc==undefined || keyBloc[0]=="air"){
            return // Signifie qu'il y a un bloc d'air. Peut être modifé par le futur depuis le backend
        }
        let x
        let y
        let bloc
        let type

        x = keyBloc[1][0] //coordonée x
        y = keyBloc[1][1] //coordonée y
        type = keyBloc[0] //le type de bloc (dirt,stone,ect.)
    
        if (y<this.highestY){ //Met à jour le point le plus haut
            this.highestY = y
            this.highestX = x
        }

        x = this.Statics.to_phaser_x(x) //on transforme nos position hydrolia en position in game
        y = this.Statics.to_phaser_y(y)
        
        bloc = this.chunk.create(x,y,type) // Créé le bloc
        //this.chunk.add(bloc) //On s'assure que les collisions sont mis a jour en ajoutant le bloc explicitement

        bloc.setDisplaySize(this.Statics.bloc_size,this.Statics.bloc_size) // définit la taile du bloc   
        bloc.body.setSize(this.Statics.bloc_size,this.Statics.bloc_size)
        bloc.setOffset(0.5,0.5)
        bloc.setOrigin(0.5,0.5)
        bloc.body.allowGravity = false; // Il ne doit pas tomber (annule la gravité)
        
        bloc.body.updateFromGameObject(); //Cette fonction miracle fait correspondre la hitbox et le visuels, reglant tout les problemes de hitbox rencontrés

        bloc.setInteractive() //Rend le bloc interactif (a la souris notament)

        let typeItem = "block" //Le type d'item (bloc, arme, consomable,ect.) Ici, toujours un bloc
        bloc.on("pointerdown",()=>{ //Appelle break bloc au click
            this.InventoryData.autoAdd(type,1,typeItem) //Ajoute 1 du bloc a l'inventaire 
            this.breakBloc(bloc)
        })
        
        this.blocs.set(bloc,[x,y])


    }
}