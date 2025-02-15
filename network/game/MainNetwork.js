export default class MainNetwork{
    static ID = "2001"

    static get URL_SERVER (){
        return "http://127.0.0.1:5500/"+this.ID+"/" //Constante statique de l'url du serveur. Ne peux pas être modifié
    }

}