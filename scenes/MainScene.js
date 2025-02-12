export default class MainScene extends Phaser.Scene{
    constructor(){
        super("MainScene")
        this.player
        this.platform
        this.cursors
        this.isJumping = false //pour savoir si on est en train de sauter
        this.defaultGravityY = 500 //valeur de gravité Y par défaut. Ces 2 variables permettent de revenir a la gravité "normal" après une modification de la gravité
        this.defaultGravityX = 500 //valeur de graité X par défaut
        this.onTheGround = false //pour savoir si le joueur touche le sol
    }
    preload(){  // Fonction où charger nos assets
        this.load.image("player","/assets/black_square.png") //charge notre image de player (un carré noir pour l'instant)
    }
    create(){
        this.cameras.main.setBackgroundColor(0xffffff) //set le backround en balnc (hex)

        this.player = this.physics.add.sprite(this.game.config.width/2,this.game.config.height/2,"player") // créé un nouveau sprite avec pour id "player". physics le rend sensible à la physique. On peut faire un sprite sans "physics". this.game.config.width/x permet de definir la position du sprite par rapport a la taille de la fentre et donc de le placer au centre
        this.player.setGravity(0,0)
        this.player.setDisplaySize(this.game.config.width/100,this.game.config.height/100) //this.game.config.width/x permet de definir la taille du sprite par rapport a la taille de la fentre et donc de conserver le responsive

        this.player.body.setCollideWorldBounds(true); // Empêche de sortir de l'écran 

        this.platform = this.physics.add.staticGroup() //groupe d'objet statique. Plateforme dans notre cas
        this.platform.create(1,1,"platform") 

        this.physics.add.collider(this.player,this.platform)
        this.cursors = this.input.keyboard.createCursorKeys()

    }
    update() {
        let pressed
        if (this.cursors.left.isDown){ //si fleche gauche pressé
            this.player.setVelocityX(-100) //on met une velocité de 100 sur l'axe X
            pressed=true //on verrouille pour ne pas que le dernier if stop la velocité
        }
        if (this.cursors.right.isDown){ //si fleche droite
            this.player.setVelocityX(100) //on va vers la droite
            pressed=true
        }
        if(this.cursors.up.isDown){ //fleche du haut
            this.player.setVelocityY(-100) //ect.
            pressed=true
        }
        if(this.cursors.down.isDown){
            this.player.setVelocityY(100)
            pressed=true
        }
        if(this.cursors.space.isDown){
            this.jump()
        }
        if (this.player.body.touching.down) {//surveille si le joueur touche le sol
            this.onTheGround = true; // Le joueur est sur le sol
        }else{
            this.onTheGround = false // Le joueur ne touche pas le sol
        }
    }
    jump(y=200,speed=200){ //fonction de saut. Y designe la hauteur du saut et Speed la vitesse. Par défaut, les 2 sont à 200
        if (this.isJumping){ //on verifie si on ne saute pas deja. Si oui, on stop
            return "Already jumping"
        }
        this.isJumping = true //si on ne saute pas déja, on dit qu'on saute a present
        this.player.setGravityY(0) //on annule la gravité Y
        this.player.setVelocityY(-speed) //on monte de Y en setAcceleration
        
        this.time.delayedCall(y, ()=>{ //on attend y temps la montée.
            this.player.setVelocityY(0) //on stop la montée
            this.player.setGravityY(this.defaultGravityY) //on remet la gravité par défaut
        })
        while (!this.onTheGround){ //on attent que le joueur touche le sol (onTheGround)
            this.time.delayedCall(200, ()=>{}) //on attent 20 ms pour pas detruire les performance
        }
        this.isJumping = false //on dit qu'on a fini le saut
    }
}