import MainNetwork from "./MainNetwork.js";

export default class WorldGeneration{
    constructor(seed,x){
        this.url_server = MainNetwork.URL_SERVER
        this.seed = seed
        this.id = MainNetwork.ID
        return this.generateChunk(x)
    }

    async generateChunk(x){
        const params = {
            seed: this.seed,
            coor_x: x //la coordonnée x la plus à l'ouest du chunk
        }
        // Crée une query string à partir de l'objet params
        let query_seed = new URLSearchParams(params).toString()
        
        let url = `${this.url_server}/world_generation/?${query_seed}`

        try{
            let response = await fetch(url, {
                method: "GET"
            })
            if (response.ok){
                return await response.json()
            } else{
                console.error("Erreur dans la requête pour la génération de chunk", await response.text())
            }
        } catch(error){
            console.error("Erreur lors de la récuperation de la génénération de chunk:", error)
        }
    }
}