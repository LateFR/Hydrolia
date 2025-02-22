export default class InventoryData extends Phaser.Plugins.BasePlugin{
    constructor(PluginManager){
        super(PluginManager)

        this.NUMBER_OF_SLOTS = 30 //nombre de slots de l'inventaire

        //Créé un tableau inventory stockant le contenu de chaque slot de l'inventaire (numéroté de 0 à NUMBER_OF_SLOT - 1 (ex: 29))
        //Le tableau est composé ainsi {0:{"type":"dirt"(type de l'item), "items": 2 (nombre d'item stacké sur le slot)}, 1: null (null si vide), ...}
        this.inventory = {}
        for (let n=0; n<this.NUMBER_OF_SLOTS; n++){
            this.inventory[n] = null
        }
    }

    verifyN(n){
        //A appeller avant de modifier inventory, empeche d'utiliser un slot non existant
        if (n>this.NUMBER_OF_SLOTS-1){ //n ne peut pas dépasser le nombre de slots - 1
            throw new Error("Slot value error")
        }
    }
    addItem(type,n,i){ 
        //Fonction add permettant d'ajouter un objet a partir de sa key de load ("stone", "dirt", ect.) et de sa position n dans l'inventaire (0 à 29)
        //i représente le nombre d'item que contiendra le slot
        //Leve une erreur "Already exists" si un item existe deja à ce slot. Utiliser replace pour remplacer l'item du slot

        this.verifyN(n)
        if (this.inventory[n] != null){
            throw new Error("Already exists")
        }

        this.inventory[n] = {"type":type, "items":i}
    }

    deleteItem(n){ 
        //Rend vide le slot n de l'inventaire. n peut être déja vide
        this.verifyN(n)
        this.inventory[n] = null
    }

    replace(type,n,i){ //Se comporte comme addItem met supprime l'item avant, empechant de lever une erreur
        this.verifyN(n)
        this.deleteItem(n) //Supprime puis ajoute l'item au slot
        this.addItem(type,n,i) 
    }

    setCount(n,i){
        //Set i en tant que nombre d'item contenu dans le slot. 
        //n ne peut pas être un slot vite. Sinon, cela leve une Empty error
        //Le i ne peut pas exeder 100. Cela leve une erreur "Overflow".
        
        if (i>100){
            throw new Error("Overflow")
        }
        this.verifyN(n)
        if (this.inventory[n] == null){
            throw new Error("Empty error")
        }
        
        this.inventory[n]["items"] = i

    }
    addCount(n,i,safe=false){ 
        //Ajoute i au nombre d'item contenu dans le slot. 
        //Retourne le nouveau nombre d'item contenu dans le slot n
        //Le nouveau i ne peut pas exeder 100. Cela leve une erreur "Overflow", sauf si safe est true. Dans ce cas, on log simplement "Overflow"
        //n ne peut pas être un slot vite. Sinon, cela leve une Empty error
        this.verifyN(n)
        if (this.inventory[n] == null){
            throw new Error("Empty error")
        }

        let oldI = this.inventory[n]["items"] //L'ancien contenu de i

        if (i+oldI>100){
            if(safe){
                console.error("Overflow")
            }else{
                throw new Error("Overflow")
            }
        }

        this.setCount(n,i+oldI) //Set le nouveau i

        return i+oldI //retourne le nouveau i

    }

    removeCount(n,i,safe=false){
        //Retire i au nombre d'item contenu dans le slot. 
        //Retourne le nouveau nombre d'item contenu dans le slot n
        //Le nouveau i ne peut pas etre inferieur à 0 (si 0, on supprime l'item et on retourne "Deleted"). Cela leve une erreur "Overflow", sauf si safe est true. Dans ce cas, on log simplement "Overflow"
        //n ne peut pas être un slot vite. Sinon, on leve une Empty error
        this.verifyN(n)
        if (this.inventory[n] == null){
            throw new Error("Empty error")
        }

        let oldI = this.inventory[n]["items"] //L'ancien contenu de i

        if (oldI-i<0){
            if(safe){
                console.error("Overflow")
            }else{
                throw new Error("Overflow")
            }
        }

        if (oldI-i == 0){
            this.deleteItem(n)
            return "Deleted"
        }else{
            this.setCount(n,oldI-i) //Set le nouveau i
        }

        return oldI-i //retourne le nouveau i

    }

    getInventory(){
        return this.inventory
    }
}