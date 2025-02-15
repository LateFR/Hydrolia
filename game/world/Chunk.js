import WorldStatic from "./WorldStatic.js"
export default class Chunk extends Phaser.GameObjects.Container{
    constructor(scene,x,y,bloc_map,player){
        this.scene = scene
        this.scene.add.existing(this) // Ajoute le conteneur à la scène

        //Génération du chunk
        this.Statics = new WorldStatic(scene)
        this.blocs = {} //contient la liste de tous les éléments du chunk et leurs positions => ChildElement: (x,y)
        Object.keys(bloc_map).forEach(element => {  //bloc_map contient les positions et les types de blocs du chunk => (x,y): "type"

            if (bloc_map[element]=="dirt" || bloc_map[element]=="stone") //A modifier. Une fonction de transition type=>asset serait mieux
                bloc=scene.add.sprite("player") //a changer lorsque les assets seront plus poussé. Actuellement, représent un bloc noir.
                bloc.setSize(this.Statics.bloc_size) //définit la taille du bloc
                this.blocs[bloc] == (element)

                if (bloc_map[element]=="dirt"){
                    sprite.setTint(0x6b3f2a)  //Donne une teinte marron au sprite pr le différencier de la stone
                }
                
                this.scene.physics.add.collider(this.player,bloc,(player)=>{ //Ajoute de la collision avec les blocs
                    player.emit('landed');//on verifit si on touche le sol. Si oui, on dit que le saut est stoppé
                })
        });

        return this
    }


}