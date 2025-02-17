import WorldStatic from "./Statics.js"
export default class Chunk extends Phaser.GameObjects.Container{
    constructor(scene,x,y,bloc_map,player){
        super(scene,x,y)
        this.scene = scene
        this.scene.add.existing(this) // Ajoute le conteneur à la scène
        this.player = player
        this.bloc_map = bloc_map //Contient le chunk généré par le serveur (le chunk)
        this.highestY = 400 //Stock le point hydrolia y le plus haut du chunk pour permettre, si le chunk est le premier, d'y placer le joueur
        this.X_of_HigestY = 0 //Stock le y du point le plus haut du chunk

        this.Statics = new WorldStatic(scene)
        this.blocs = new Map //Map contenant la liste de tous les éléments du chunk et leurs positions => Bloc : [x,y]

        return this
    }

    async create(wait=0){
        return new Promise((resolve) => { //On retourne une promesse pour pouvoir await la création du chunk
            let i = 0
            
            let keys = Object.keys(this.bloc_map)
            //On utilise un interval pour pouvoir ralentir artificiellement la création du chunk (avec wait) et éviter le lag.
            let intervalID = setInterval(() => {  //bloc_map contient les positions et les types de blocs du chunk => i: ["type",[x,y]]  (note: x et y sont en "format" hydrolia)
                let key = keys[i]
                if (i > keys.length){
                    console.log("Creating of Chunk finished")
                    resolve() //On a finit l'execution
                    clearInterval(intervalID) //Stop l'interval
                }
                
                if (key==undefined || this.bloc_map[key][0]=="air"){
                    i+=1
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
                    this.X_of_HigestY = x
                }

                x = this.Statics.to_phaser_x(x) //on transforme nos position hydrolia en position in game
                y = this.Statics.to_phaser_y(y)
                
                bloc=this.scene.add.sprite(x,y,type)
                this.scene.physics.add.existing(bloc)
                

                this.add(bloc) //Ajoute le bloc au conteneur
                
                bloc.setDisplaySize(this.Statics.bloc_size,this.Statics.bloc_size) // définit la taile de l'apparence du bloc
                //bloc.body.setSize(this.Statics.bloc_size,this.Statics.bloc_size)
                //bloc.setOffset(0, 0); //garentit que la hitbox est bien aligné
                //bloc.setImmovable(true); // Le bloc ne doit pas bouger quand il est touché
                bloc.body.allowGravity = false; // Il ne doit pas tomber
                
                //A rajouter lorsque le cassage des blocs sera implémenté.
                
                // bloc.setInteractive()
                // bloc.on("pointerover",()=>{
                //     console.log("Un bloc est survolé")
                // })
                
                this.blocs.set(bloc,[x,y])

                
            i+=1
            if (i%100==0){
                console.log(i)
            }
            },wait);

        })
    }
    async endOfLoading(wait){ //Fonction de fin de chargement. A appeller apres le set du chunk, permet de reduire la charge initiale pour le confore utilisateur
        let i=0
        let blocsArray = [...this.blocs.keys()] // On récupere tout les blocs (contenus dans les keys de blocs) et on trasforme tout ca en Array avec "..."

        this.scene.physics.add.collider(this.player, blocsArray); //Ajoute la collision entre le player et les blocs du chunk
        this.scene.physics.add.collider(this.player, blocsArray,(player)=>{ //Ajoute un evenement de collision entre le player et les blocs
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
}