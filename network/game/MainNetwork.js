export default class MainNetwork{
    static ID = "2001"

    static get URL_SERVER (){
        return "http://88.160.36.153:50080/"+this.ID //Constante statique de l'url du serveur. Ne peux pas être modifié
    }

}