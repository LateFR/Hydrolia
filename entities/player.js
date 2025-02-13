export default class Player extends Phaser.Physics.Arcade.Sprite{
    //note: ici, this designe le player et ses propriétés
    constructor(scene,x,y){
        super(scene,x,y,"player")

        this.scene = scene
        this.cursors

        this.defaultGravityY = 500 //valeur de gravité Y par défaut. Ces 2 variables permettent de revenir a la gravité "normal" après une modification de la gravité
        this.defaultGravityX = 0 //valeur de graité X par défaut
        this.playerSpeed = 200 //vitesse du joueur. Peut importe le sens
        
        this.isJumping = false //pour savoir si on est en train de sauter
        this.isDashing = false //pour savoir si on est en train de dasher
        this.pressed=  false //définit si une touche a été pressee sur la frame
       
    }
    create(){
        this.scene.add.existing(this) //on ajoute le player (this) à la scène et au jeu
        this.scene.physics.add.existing(this)
        
        this.setDisplaySize(this.scene.game.config.width/100,this.scene.game.config.height/100) //this.scene.game.config.width/x permet de definir la taille du sprite par rapport a la taille de la fentre et donc de conserver le responsive
        this.setGravity(this.defaultGravityX,this.defaultGravityY) //definit la gravité du joueur (que du joueur!!)
        this.setCollideWorldBounds(true); // Empêche de sortir de l'écran 

        this.setupListeners()
    }
    update(){
        
        if(!pressed){
            this.setVelocityX(0)
            this.pressed==false
        }
        if (this.body.blocked.down) { //on verifit si on touche le sol. Si oui, on dit que le saut est stoppé
            this.isJumping=false 
        }
    }

    setupListeners(){//fonction d'initialisation réunnisant tout les listeners
        this.scene.input.keyboard.on("keydown-LEFT",(event)=>{
            this.setVelocityX(-this.playerSpeed) //on met une velocité de 100 sur l'axe X
            this.pressed=true //on verrouille pour ne pas que le dernier if stop la velocité
        })
        this.scene.input.keyboard.on("keydown-RIGHT",(event)=>{
            this.setVelocityX(this.playerSpeed) //on va vers la droite
            this.pressed=true
        })
        this.scene.input.keyboard.on("keydown-SPACE",(event)=>{
            this.jump()
        })
        this.scene.input.keyboard.on("Keydown-KeyE",(event)=>{
            this.dash()
        })

    }
    jump(y=500){ //fonction de saut. Y designe la hauteur du saut

        if (this.isJumping || !this.body.blocked.down) return; // Empêche le double saut si le joueur n'est pas au sol

        this.isJumping = true //si on ne saute pas déja, on dit qu'on saute a present
        this.setVelocityY(-y)

    }

    dash(x=500){
        if (this.isDashing) return
        
        this.setAccelerationX(x)
    }

}