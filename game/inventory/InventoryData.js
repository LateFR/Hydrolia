export default class InventoryData extends Phaser.Plugins.BasePlugin{
    constructor(PluginManager){
        super(PluginManager)

        this.NUMBER_OF_SLOTS = 36 //nombre de slots de l'inventaire
        //Créé un tableau inventory stockant le contenu de chaque slot de l'inventaire (numéroté de 0 à NUMBER_OF_SLOT - 1 (ex: 29))
        //Le tableau est composé ainsi {0:{"is":"dirt"(ce qu'est l'item: dirt,stone,ect.), "items": 2 (nombre d'item stacké sur le slot), "type":"block" (si l'item est un bloc, une arme, un utilisable, ect.)}, 1: null (null si vide), ...}
        this.inventory = {}
        for (let n=0; n<this.NUMBER_OF_SLOTS; n++){
            this.inventory[n] = null
        }
        this.target = 0 //Le slot (n) selectionné actuellement pour la pose des blocs
    }

    isNull(n){ //Permet de savoir si un slot n est vide
        return this.inventory[n]==null //true si le slot est vide
    }
    isTargetNull(){ //Permet de savoir si target est vide
        return this.isNull(this.target)
    }
    verifyN(n){
        //A appeller avant de modifier inventory, empeche d'utiliser un slot non existant
        if (n>this.NUMBER_OF_SLOTS-1){ //n ne peut pas dépasser le nombre de slots - 1
            throw new Error("Slot value error")
        }
    }
    autoAdd(is,i,type){ 
        //Ajoute automatiquement les items a l'inventaire, soit dans le premier slot libre, soit il rajoute a un slot ayant le meme is. 
        // Retourne false si l'inventaire est plein, true si l'operation a réussi
        for(let n=0;n<this.NUMBER_OF_SLOTS;n++){
            if (this.isNull(n)){//Si le slot est vide
                this.addItem(is,n,i,type) //On ajoute l'item au slot
                return true
            }else if (this.inventory[n]["is"]==is && i+this.inventory[n]["items"]<100){ //Si le slot possede le meme item et que l'ajout de l'item ne fait pas dépasser la limite du slot
                this.addCount(n,i,type)
                return true
            }
        };

        return false
    }
    addItem(is,n,i,type){ 
        //Fonction add permettant d'ajouter un objet a partir de sa key de load ("stone", "dirt", ect.) et de sa position n dans l'inventaire (0 à 29)
        //i représente le nombre d'item que contiendra le slot
        //Leve une erreur "Already exists" si un item existe deja à ce slot. Utiliser replace pour remplacer l'item du slot

        this.verifyN(n)
        if (this.inventory[n] != null){
            throw new Error("Already exists")
        }

        this.inventory[n] = {"is":is, "items":i, "type":type}
    }

    deleteItem(n){ 
        //Rend vide le slot n de l'inventaire. n peut être déja vide
        this.verifyN(n)
        this.inventory[n] = null
    }

    replace(is,n,i,type){ //Se comporte comme addItem met supprime l'item avant, empechant de lever une erreur
        this.verifyN(n)
        this.deleteItem(n) //Supprime puis ajoute l'item au slot
        this.addItem(is,n,i,type) 
    }

    setCount(n,i){
        //Set i en tant que nombre d'item contenu dans le slot. 
        //n ne peut pas être un slot vite. Sinon, cela leve une Empty error
        //Le i ne peut pas exeder 100. Cela leve une erreur "Overflow".
        
        if (i>100){
            throw new Error("Overflow")
        }
        this.verifyN(n)
        if (i==0){
            this.deleteItem(n)
        }
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