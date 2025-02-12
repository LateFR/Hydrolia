import MainScene from "./scenes/MainScene";

let config={
    type:Phaser.AUTO,
    with:800,
    height:600,
    scenes: [MainScene],
    physics:{
        default:"arcade",
        arcade:{debug:true}
    }
}

let game= new Phaser.Game(config)
