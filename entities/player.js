import { FacebookInstantGamesLeaderboard } from "phaser"

export default class Player extends Phaser.Physics.Arcade.Sprite{
    //note: ici, this designe le player et ses propriétés
    constructor(scene,x,y){
        super(scene,x,y,"player")

        this.scene = scene
        this.cursors
        this.isJumping = false //pour savoir si on est en train de sauter
        this.defaultGravityY = 500 //valeur de gravité Y par défaut. Ces 2 variables permettent de revenir a la gravité "normal" après une modification de la gravité
        this.defaultGravityX = 0 //valeur de graité X par défaut
        this.playerSpeed = 200 //vitesse du joueur. Peut importe le sens

       
    }
    create(){
        this.scene.add.existing(this) //on ajoute le player (this) à la scène et au jeu
        this.scene.physics.add.existing(this)
        
        this.setGravity(this.defaultGravityX,this.defaultGravityY) //definit la gravité du joueur (que du joueur!!)
        this.setDisplaySize(this.scene.game.config.width/100,this.scene.game.config.height/100) //this.scene.game.config.width/x permet de definir la taille du sprite par rapport a la taille de la fentre et donc de conserver le responsive

        this.setCollideWorldBounds(true); // Empêche de sortir de l'écran 

        this.cursors = this.scene.input.keyboard.createCursorKeys()
    }
    update(){
        let pressed=false
        if (this.cursors.left.isDown){ //si fleche gauche pressé
            this.setVelocityX(-this.playerSpeed) //on met une velocité de 100 sur l'axe X
            pressed=true //on verrouille pour ne pas que le dernier if stop la velocité
        }
        if (this.cursors.right.isDown){ //si fleche droite
            this.setVelocityX(this.playerSpeed) //on va vers la droite
            pressed=true
        }
        if(this.cursors.space.isDown){
            this.jump()
        }else if(!pressed){
            this.setVelocityX(0)
        }
        if (this.body.touching.down) { //on verifit si on touche le sol. Si oui, on dit que le saut est stoppé et on remet la velocité a 0
            if (this.isJumping){
                this.setVelocityY(0)
                this.isJumping=False
            }
        }
    }
    //Je pense que cette fonction est facilement optimisable. Merci de le faire dès que possible
    jump(y=200,speed=400){ //fonction de saut. Y designe la hauteur du saut et Speed la vitesse. Par défaut, les 2 sont à 200
        
        if (this.isJumping || !this.body.touching.down) return; // Empêche le double saut si le joueur n'est pas au sol

        this.isJumping = true //si on ne saute pas déja, on dit qu'on saute a present
        
        this.setVelocityY(-speed) //on monte de Y en setAcceleration
        
        this.scene.time.delayedCall(y, ()=>{ //on attend "y" temps la montée.
            this.setVelocityY(0) //on stop la montée
            this.setGravityY(this.defaultGravityY) //on remet la gravité par défaut //on attend que le joueur touche le sol
        })

        this.waitHitGround(()=>{this.isJumping = false}) //fin du saut lorsqu'on touche le sol
    }
    waitHitGround(callback){ //fonction auxiliaire à jump. Attend que this.body.touching.down==true
        let interval = setInterval(() => {
            if (this.body.touching.down) {
                clearInterval(interval); // Arrête la vérification
                callback(); // Exécute la suite du code
            }
        }, 200); // Vérifie la condition toutes les 200ms
    }

}