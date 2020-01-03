import { Cursor } from "../objects/Cursor/cursor";
import { Eye } from "../objects/Eye/eye";
import { ConfigType } from "../objects/Eye/schema";

export class StationaryScene extends Phaser.Scene {

    private balls: Phaser.GameObjects.Group;
    private dance;
    private charactorA: Eye;
    private charactorB: Eye;
    private inputA: ConfigType;
    private inputB: ConfigType;
    // private a;
    private downButton;
    private upButton;
    private spinSpeed: number;

    // https://stackoverflow.com/users/4966930/brae?tab=profile
  

    private Eyetemplate;
    
    // edit by arif
    private playerEyes;
    private image;

    constructor() {
        super({ key: "StationaryScene" });
    }
  
    preload(): void {

        this.load.image('sky', './src/games/gewgly/assets/images/sky.png');

        this.load.image('up-bubble', './src/games/gewgly/assets/images/up-bubble.png');
        this.load.image('down-bubble', './src/games/gewgly/assets/images/down-bubble.png');
        
        this.load.spritesheet('balls', './src/games/gewgly/assets/images/balls.png', { frameWidth: 17, frameHeight: 17 });

    }
//   https://labs.phaser.io/edit.html?src=src/actions/rotate%20around%20xy.js&v=3.21.0
    create(): void {

        this.add.image(400, 300, 'sky');
        this.balls = this.generateBalls();    
        this.dance = this.generateDance();
        // this.buttonsspeed();

        this.playerEyes = new Eye(this.generateEyeArg(200,135,3.0));
    }

    generateBalls() {

        const hitArea = new Phaser.Geom.Rectangle(0, 0, 32, 32);
        const hitAreaCallback = Phaser.Geom.Rectangle.Contains;        
        
        const circle = new Phaser.Geom.Circle(400, 300, 220);
        const balls  = this.add.group(null, { 
            key: 'balls', 
            frame: [0, 1, 5], 
            repeat: 5, 
            setScale: { x: 3, y: 3 },
            hitArea: hitArea,
            hitAreaCallback: hitAreaCallback,
        });

        // console.log(balls.getChildren().length);
       

        this.input.on('gameobjectover', function (pointer, gameObject) {
            document.body.style.cursor = 'pointer';
        });
        
        this.input.on('gameobjectout', function (pointer, gameObject) {
            document.body.style.cursor = 'default';
        });

        // https://photonstorm.github.io/phaser3-docs/Phaser.Types.GameObjects.Group.html#.GroupCreateConfig
        
        Phaser.Actions.PlaceOnCircle( balls.getChildren(), circle);
        return balls;
    }

    generateDance() {
        this.spinSpeed = 0.003;
        

        // console.log(this.upButton.getChildren().length);

        this.upButton = this.add.sprite(230, 530, 'down-bubble').setInteractive({ cursor: 'pointer' });

        this.downButton = this.add.sprite(80, 530, 'up-bubble').setInteractive({ cursor: 'pointer' });

        this.input.on('gameobjectup', function (pointer, gameobject) {

            if (gameobject === this.downButton &&  this.spinSpeed.timeScale > 100)
            {
                this.spinSpeed.timeScale -= 10.1;
            }
            else if (gameobject === this.upButton &&  this.spinSpeed.timeScale < 19.9)
            {
                this.spinSpeed.timeScale += 10.1;
            }
    
        });
    
        // https://phaser.discourse.group/t/how-to-create-key-combo-with-custom-buttons/2622
        return this.tweens.addCounter({
            from: 220,
            to: 160,
            duration: 9000,
            delay: 2000,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });
    }
    // setInteractive({useHandCursor: true})
  

    generateEyeArg( xCoor: number, yCoor: number, sScale: number) {

        return {
            scene           : this,
            parent          : this.add.sprite(xCoor,yCoor, null),
            target          : new Cursor( this ),   // game.input.mousePointer,
            x               : xCoor,                // x, y position is the location that the eyes 
            y               : yCoor,                // object is originally located within the parent
            width           : 10,                   // height/width is the total area of the eye object (subject to scaling)
            height          : 8,
            w2h             : 0.9,                  // Eye ball width to height ratio
            scale           : sScale,
            eyeSpacing      : 3.5,                    // Distance between eyes
            pupilScale      : 1.0,
            pupilRotRadius  : 0.7,                  // Factor of radius pupils can rotate around eye white
            pupilColor      : 0x0f00ff
        };
    }

    buttonsspeed(){

        this.upButton = this.add.sprite(230, 530, 'down-bubble').setInteractive({ cursor: 'pointer' });
        this.downButton = this.add.sprite(80, 530, 'up-bubble').setInteractive({ cursor: 'pointer' });
        
       
        this.tweens.add({
            targets: this.balls,
            // this
        });
            //  Buttons to control the Tween timescale
            // var downButton = this.add.image(70, 530, 'down-bubble');     


        // downButton.name = 'sky5';
        // downButton.scale.setTo(0.5, 0.5);     
      
    }



    update() {
        Phaser.Actions.RotateAroundDistance( this.balls.getChildren(), { x: 400, y: 300 }, this.spinSpeed, this.dance.getValue());
        this.playerEyes.update();
        // this.buttonsspeed.update();

    }
}
  