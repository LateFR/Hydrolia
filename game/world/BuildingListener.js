import WorldStatic from "./Statics"

export default class BuildingListener{
    constructor(scene){
        this.scene = scene
        this.inventoryData = this.scene.plugins.get("InventoryData") //On instencit le plugins InventoryData
        this.Statics = new WorldStatic(scene)
    }

    setupListener(){
        this.scene.input.on("pointerdown",(pointer, gameObjects)=>{ //pointer = l'evenement de clic    gameObjects = la liste des objets cliqués
            if(gameObjects.lenght == 0){ //Si gameObjects ne contient aucun élément, alors on a cliqué sur un espace vide et on appelle executeItem
                this.executeItem(pointer)
            }
        })
    }
    executeItem(pointer = null){
        if(this.inventoryData.isTargetNull()){ //On ne fait rien si le target de l'inventaire est vide
            return
        }
        target = this.inventoryData.inventory[this.inventoryData.target]

        if(target.type == "block"){ //Cas ou le type d'item est le bloc.
            this.layBlock(target)
        } 
    }

    layBlock(bloc,pointer){
        const X = Math.floor(this.Statics.to_hydrolia_x(pointer.worldX))
        const Y = Math.floor(this.Statics.to_hydrolia_y(pointer.worldY))

        chunk = this.scene.world.getPlayerChunk(pointer.worldX) //On "detourne" getPlayerChunk pour obtenir le chunk du pointer meme si c'est fait pour le player

        if (chunk == null){ //Si le pointer est dans un chunk pas encore chargé
            return //On ne fait rien
        }

        chunk.newBloc([bloc,X,Y]) //On créé un nouveau bloc
    }
}