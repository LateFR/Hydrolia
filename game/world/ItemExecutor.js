import WorldStatic from "./Statics.js"

export default class ItemExecutor{
    constructor(scene){
        this.scene = scene
        this.inventoryData = this.scene.plugins.get("InventoryData") //On instencit le plugins InventoryData
        this.Statics = new WorldStatic(scene)
        this.setupListener()
    }

    setupListener(){
        this.scene.input.on("pointerdown",(pointer, gameObjects)=>{ //pointer = l'evenement de clic    gameObjects = la liste des objets cliqués
            if (gameObjects.length > 0) {
                return; // On ne fait rien si on a cliqué sur un objet interactif
            }else{
                this.executeItem(pointer)
            }
        })
    }
    executeItem(pointer = null){
        if(this.inventoryData.isTargetNull()){ //On ne fait rien si le target de l'inventaire est vide
            return
        }
        let target = this.inventoryData.inventory[this.inventoryData.target]
        
        if(target.type == "block"){ //Cas ou le type d'item est le bloc.
            this.layBlock(pointer,target.is)
        } 

        this.inventoryData.removeCount(this.inventoryData.target,1)
    }

    layBlock(pointer,is){
        const X = Math.round(this.Statics.to_hydrolia_x(pointer.worldX))
        const Y = Math.round(this.Statics.to_hydrolia_y(pointer.worldY))
        
        let chunk = this.scene.world.getPlayerChunk(X) //On "detourne" getPlayerChunk pour obtenir le chunk du pointer meme si c'est fait pour le player

        if (chunk == null){ //Si le pointer est dans un chunk pas encore chargé
            return //On ne fait rien
        }
        chunk.newBloc([is,[X,Y]]) //On crée un nouveau bloc
    }
}