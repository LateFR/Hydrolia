export default class Player extends Phaser.Physics.Arcade.Sprite{
    //note: ici, this designe le player et ses propriétés
    constructor(scene,x,y){
        super(scene,x,y,"player")

        this.scene = scene
        this.cursors
        this.inventoryData = this.scene.plugins.get("InventoryData") //On instencit le plugins InventoryData

        this.defaultGravityY = 500 //valeur de gravité Y par défaut. Ces 2 variables permettent de revenir a la gravité "normal" après une modification de la gravité
        this.defaultGravityX = 0 //valeur de graité X par défaut
        this.playerSpeed = 200 //vitesse du joueur. Peut importe la direction

        this.isJumping = false //pour savoir si on est en train de sauter
        this.isDashing = false //pour savoir si on est en train de dasher. Variable générale utilisable partout
        this.isCouldownDash = false //variable intermediare pour donner la fin du couldown. Spécifique au dash
        this.pressed=  false //définit si une touche a été pressee sur la frame
        this.direction = "right" //donne la direction du player. "left" ou "right" pour l'instant
        this.E_pressed = false //pour savoir si la touche E est appuyée. Permet d'empecher le spam de dash sans relacher E
    }
    create(){
        this.scene.add.existing(this) //on ajoute le player (this) à la scène et au jeu
        this.scene.physics.add.existing(this)
        this.setDepth(10) //Place le player au premier plan
        
        this.setDisplaySize(this.scene.game.config.width/100,this.scene.game.config.height/100) //this.scene.game.config.width/x permet de definir la taille du sprite par rapport a la taille de la fentre et donc de conserver le responsive
        this.setGravity(this.defaultGravityX,0) //definit la gravité du joueur (que du joueur!!). La gravité y sera activé a la fin de la création du premier chunk
        this.setCollideWorldBounds(true); // Empêche de sortir de l'écran 

        this.setupListeners()
    }
    update(){
        if (!this.pressed && !this.isDashing) {
            this.setVelocity(0,0);
        }
    }

    setupListeners(){//fonction d'initialisation réunnisant tout les listeners
        this.scene.input.keyboard.on("keydown-Q",(event)=>{
            if (this.isDashing || this.pressed){//empêche le player de se déplacer durant le dash on ne fait rien si on se déplace déja
                return
            }
            this.setVelocityX(-this.playerSpeed) //on met une velocité de 100 sur l'axe X
            this.pressed=true //on verrouille pour ne pas que le dernier if stop la velocité
            this.direction = "left"
            if (!this.flipX){
                this.setFlipX(true) // Retourne le sprite vers la gauche
            }
        })
        
        this.scene.input.keyboard.on("keydown-D",(event)=>{
            if (this.isDashing || this.pressed){//empêche le player de se déplacer durant le dash et on ne fait rien si on se déplace déja
                return
            }
            this.setVelocityX(this.playerSpeed) //on va vers la droite
            this.pressed=true
            this.direction = "right"
            if(this.flipX){
                this.setFlipX(false) // Retourne le sprite vers la droite
            }
        })
        this.scene.input.keyboard.on("keydown-Z",()=>{//0n change de target de slot avec Z (vers le haut) ou S (vers le bas)
            this.inventoryData.target+=1
            if(this.inventoryData.target >= this.inventoryData.NUMBER_OF_SLOTS){
                this.inventoryData.target = 0
            }
        })
        
        this.scene.input.keyboard.on("keydown-S",()=>{//0n change de target de slot avec Z (vers le haut) ou S (vers le bas)
            this.inventoryData.target-=1
            if(this.inventoryData.target < 0){
                this.inventoryData.target = this.inventoryData.NUMBER_OF_SLOTS
            }
        })
        this.scene.input.keyboard.on("keyup-Q", (event) => {
            this.pressed = false;
        });

        this.scene.input.keyboard.on("keyup-D", (event) => {
            this.pressed = false;
        });


        this.scene.input.keyboard.on("keydown-SPACE",(event)=>{
            this.jump()
        })
        this.scene.input.keyboard.on("keydown-E",(event)=>{
            if(this.E_pressed){ //on ne dash pas si E est déja préssé. Empèche le spam de E
                return
            }
            this.E_pressed = true
            this.dash()
        })
        this.scene.input.keyboard.on("keyup-E",(event)=>{
            this.E_pressed = false
        })


        // Écoute l'événement personnalisé 'landed'
        this.scene.events.on('landed', () => {
            console.log("landed")
            this.isJumping = false;
        });
    }
    jump(y=500){ //fonction de saut. Y designe la hauteur du saut

        if (this.isJumping || !this.body.blocked.down) return; // Empêche le double saut si le joueur n'est pas au sol

        this.isJumping = true //si on ne saute pas déja, on dit qu'on saute a present
        this.setVelocityY(-y) //on donne une impulsion, la gravité fait le reste

    }

    dash(speed=600,time=200,couldown=1000){ //x=vitesse du dash    time=durée du dash   couldown=durée du couldown  //idée: un élément qui affiche le couldown
        if (this.isDashing || this.isCouldownDash) return
        
        this.isDashing = true
        this.isCouldownDash = true
        let last_velocity = this.body.velocity.x //permet de conserver la vitesse avant le dash pr pas stopper le mouvement

        if (this.direction=="left"){
            this.setFlipX(true) // Retourne le sprite vers la gauche
            speed=-speed //on dash vers la gauche
        }else{
            this.setFlipX(false) // Retourne le sprite vers la droite
        }
        this.setVelocityX(speed)
        
        setTimeout(() => {
            this.setVelocityX(last_velocity); // Arrêter le dash après 200ms 
            this.isDashing=false
        }, time);
        
        setTimeout(() => {
            this.isCouldownDash=false//couldown de 500 ms avant de laisser le joueur redasher
        }, time+couldown);
    }

}