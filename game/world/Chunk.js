import WorldStatic from "./Statics.js"
export default class Chunk extends Phaser.GameObjects.Container{
    constructor(scene,x,y,bloc_map,player){
        super(scene,x,y)
        this.scene = scene
        this.scene.add.existing(this) // Ajoute le conteneur à la scène
        this.player = player
        this.bloc_map = bloc_map //Contient ce qu'a généré le serveur (le chunk)

        //Génération du chunk
        this.Statics = new WorldStatic(scene)
        this.blocs = {} //contient la liste de tous les éléments du chunk et leurs positions => ChildElement: (x,y)
        Object.keys(this.bloc_map).forEach(i => {  //bloc_map contient les positions et les types de blocs du chunk => i: ["type",[x,y]]  (note: x et y sont en "format" hydrolia)

            let x
            let coor
            let y
            let bloc
            let type

            coor = this.bloc_map[i][2] //coordonées
            type = this.bloc_map[i][1]
            if (type == "dirt" || type=="stone") //A modifier. Une fonction de transition type=>asset serait mieux
                x = this.Statics.to_phaser_coor(coor[0]) //on transforme nos position hydrolia en position in game
                y = this.Statics.to_phaser_coor(coor[1])
                

                bloc=this.scene.add.sprite(x,y,"player") //a changer lorsque les assets seront plus poussé. Actuellement, représente un bloc noir.
                bloc.setSize(this.Statics.bloc_size) //définit la taille du bloc
                this.blocs[bloc] = [x,y]

                if (type=="dirt"){
                    bloc.setTint(0x6b3f2a)  //Donne une teinte marron au sprite pr le différencier de la stone
                }
                
                this.scene.physics.add.collider(this.player,bloc,(player)=>{ //Ajoute de la collision avec les blocs
                    player.emit('landed');//on verifit si on touche le sol. Si oui, on dit que le saut est stoppé
                })
        });

        return this
    }


}