import MainScene from "/static/scenes/MainScene.js";

const config={
    type: Phaser.AUTO, //Phaser choisit automatiquement si il faut utiliser Canva ou WebGL

    scale: {
        mode: Phaser.Scale.RESIZE, //redimensionne le jeu automatiquement
        auto: Phaser.Scale.CENTER_BOTH //centre automatiquement le jeu
    },
    width: window.innerWidth, //prend toute la largeur de l'écran
    height: window.innerHeight, //prend toute la hauteur de l'écran

    scene: [MainScene], //Ajouter chaque scene dans ce tableau
    physics: {
        default:"arcade",
        arcade:{debug:true}
    },
    pixelArt: true, // Évite le flou sur les jeux en pixel art
}

let game= new Phaser.Game(config)
