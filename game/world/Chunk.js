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

        console.log(this.player.body.x,this.player.body.x)
        console.log(x,y)
        
        this.Statics = new WorldStatic(scene)
        this.blocs = {} //contient la liste de tous les éléments du chunk et leurs positions => ChildElement: (x,y)

        return this
    }

    async create(wait=0){
        return new Promise((resolve) => { //On retourne une promesse pour pouvoir await la création du chunk
            let i = 0

            //On utilise un interval pour pouvoir ralentir artificiellement la création du chunk (avec wait) et éviter le lag.
            let intervalID = setInterval(() => {  //bloc_map contient les positions et les types de blocs du chunk => i: ["type",[x,y]]  (note: x et y sont en "format" hydrolia)
                let key=Object.keys(this.bloc_map)[i]

                if (i>Object.keys(this.bloc_map).length){
                    console.log("Creating of Chunk finished")
                    resolve() //On a finit l'execution
                    clearInterval(intervalID) //Stop l'interval
                }
                
                if (key==undefined || key[0]=="air"){
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
                
                if (type=="dirt"){
                    bloc=this.scene.physics.add.sprite(x,y,"player") //a changer lorsque les assets seront plus poussé. Actuellement, représente un bloc noir.
                }else(
                    bloc=this.scene.physics.add.sprite(x,y,"bloc")
                )
                
                bloc.setImmovable(true); // Le bloc ne doit pas bouger quand il est touché
                bloc.body.allowGravity = false; // Il ne doit pas tomber

                this.add(bloc) //Ajoute le bloc au conteneur
                bloc.setSize(1,1) //définit la taille du bloc
                bloc.setOffset(0, 0); //garentit que la hitbox est bien aligné
                bloc.setInteractive()

                bloc.on("pointerover",()=>{
                    console.log("Un bloc est survolé")
                })
                
                this.blocs[bloc] = [x,y]

                
            i+=1
            if (i%100==0){
                console.log(i)
            }
            },wait);

        })
    }
    async endOfLoading(wait){ //Fonction de fin de chargement. A appeller apres le set du chunk, permet de reduire la charge initiale pour le confore utilisateur
        let i=0
        let interval = setInterval(()=>{
            console.log(this.player.body.x,this.player.body.y)
            if (i>Object.keys(this.blocs).length){
                clearInterval(interval)
            }
            let bloc = Object.keys(this.blocs)[i] //on parcourt tout les blocs

            this.scene.physics.add.collider(this.player,bloc,(player)=>{ //Ajoute de la collision avec les blocs
                player.emit('landed');//on verifit si on touche le sol. Si oui, on dit que le saut est stoppé
            })
        },wait)
    }
}