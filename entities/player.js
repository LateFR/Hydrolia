export default class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y){
        super(scene,x,y,"player")
        this.isJumping = false //pour savoir si on est en train de sauter
        this.defaultGravityY = 500 //valeur de gravité Y par défaut. Ces 2 variables permettent de revenir a la gravité "normal" après une modification de la gravité
        this.defaultGravityX = 0 //valeur de graité X par défaut
        this.playerSpeed = 200 //vitesse du joueur. Peut importe le sens
    }
    create(){
        this.player = this.physics.add.sprite(this.game.config.width/2,this.game.config.height/2,"player") // créé un nouveau sprite avec pour id "player". physics le rend sensible à la physique. On peut faire un sprite sans "physics". this.game.config.width/x permet de definir la position du sprite par rapport a la taille de la fentre et donc de le placer au centre
        this.player.setGravity(this.defaultGravityX,this.defaultGravityY) //definit la gravité du joueur (que du joueur!!)
        this.player.setDisplaySize(this.game.config.width/100,this.game.config.height/100) //this.game.config.width/x permet de definir la taille du sprite par rapport a la taille de la fentre et donc de conserver le responsive

        this.player.body.setCollideWorldBounds(true); // Empêche de sortir de l'écran 

    }
}