import Inventory from "/static/scenes/Inventory.js";
import MainScene from "/static/scenes/MainScene.js";
import InventoryData from "static/game/inventory/InventoryData";

const config={
    type: Phaser.AUTO, //Phaser choisit automatiquement si il faut utiliser Canva ou WebGL

    scale: {
        mode: Phaser.Scale.RESIZE, //redimensionne le jeu automatiquement
        auto: Phaser.Scale.CENTER_BOTH //centre automatiquement le jeu
    },
    width: window.innerWidth, //prend toute la largeur de l'écran
    height: window.innerHeight, //prend toute la hauteur de l'écran

    scene: [MainScene,Inventory], //Ajouter chaque scene dans ce tableau
    physics: {
        default:"arcade",
        arcade:{debug:true}
    },
    plugins: {
        global: [
            {key: "InventoryData", plugin: InventoryData, start: true}
        ]
    },
    pixelArt: true, // Évite le flou sur les jeux en pixel art
}

let game= new Phaser.Game(config)
