
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

var width = 800;
var height = 600;

var background;
var player;
var platforms;
var diamonds;// diamonds add ten points to score
var rubies;// rubies take a life from the player
var score = 0;
var scoreText;
var livesText;
var lives = 4; //number of lives

function preload() {
  game.load.image('background', 'assets/deep-space.jpg');
  game.load.spritesheet('dude', "assets/dude.png", 32, 48);// user character
  game.load.image('diamond', 'assets/diamond.png');
  game.load.image('gem', 'assets/gem.png');// rubies image
  game.load.image('ground', 'assets/terrain1.png');
}//preload

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	background = game.add.tileSprite(0, 0, game.width, game.height, 'background');
  background.fixedToCamera = true;
	platforms = game.add.group();
	platforms.enableBody = true;

  for(var i =0; i < 88*3; i += 88){
    ground = platforms.create(i,game.world.height - 400, 'ground');
    ground.body.immovable = true;
  }

  for(var i =0; i < game.width +88; i += 88){
    ground = platforms.create(i,game.world.height - 30, 'ground');
    ground.body.immovable = true;
    ground.scale.setTo(1,1);
  }

  for(var i =0; i < 88*4; i += 88){
    ground = platforms.create(i,400, 'ground');
    ground.body.immovable = true;
  }

  for(var i =0; i < game.width; i += 88){
    if(i > 88 *5){
      ground = platforms.create(i,275, 'ground');
      ground.body.immovable = true;
    }
  }

  for(var i =0; i < game.width; i += 88){
    if(i > 88 *6 || i == 88 *5){
      ground = platforms.create(i,100, 'ground');
      ground.body.immovable = true;
    }
  }

	var textStyle = {fontSize: '32px', fill:'#0095DD'};
	livesText = game.add.text(135, 64, "Lives: " + lives, textStyle);
	livesText.anchor.set(1,0);

  player = game.add.sprite(0, 500, 'dude');
  game.physics.arcade.enable(player);
  player.inputEnabled = true;
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  game.camera.follow(player);

  player.body.collideWorldBounds = true;
  player.body.gravity.y = 300;

  cursors = game.input.keyboard.createCursorKeys();

  //Adding diamonds
  diamonds = game.add.group();
  diamonds.enableBody = true;

  //  Create a star inside of the 'stars' group
  var diamond = diamonds.create(0, 0, 'diamond');
  diamond.body.gravity.y = 300;
  diamond.body.bounce.y = 0.7 + Math.random() * 0.2;
  diamond.body.collideWorldBounds =true;
  game.physics.arcade.enable(diamond);

	rubies = game.add.group();
	rubies.enableBody = false;

	scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
	game.time.events.repeat(Phaser.Timer.SECOND * 2, 1000, createDiamonds, this);
	game.time.events.repeat(Phaser.Timer.SECOND * 4, 1000, createRubies, this);

}//create

function update() {
	player.body.velocity.x = 0;
	game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);
	game.physics.arcade.overlap(player, rubies, playerHitRubies, null, this);
	var hitPlatform = game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(diamonds, platforms);

  if (cursors.left.isDown){
      player.body.velocity.x = -250;
      player.animations.play('left');
  }
  else if (cursors.right.isDown){
      player.body.velocity.x = 250;
      player.animations.play('right');
  }else{
    	player.animations.stop();
      player.frame = 4;
  }//if-else

  if (cursors.up.isDown && (player.body.onFloor() || player.body.touching.down)){
      player.body.velocity.y = -400;
  }//if

}//update

function render(){
	//debugging
}//render

function createDiamonds(){
		var diamond = diamonds.create(game.world.randomX, 0, 'diamond');
    game.physics.enable(diamond, Phaser.Physics.ARCADE);

		diamond.body.gravity.y = 300;
    diamond.body.bounce.y = 0.7 * Math.random();
    diamond.body.collideWorldBounds = true;
}//createDiamonds

function createRubies(){
		var ruby = rubies.create(game.world.randomX, 0, 'gem');
    game.physics.enable(ruby, Phaser.Physics.ARCADE);
		ruby.body.gravity.y = 300;
}//createRubies

function collectDiamond (player, diamond) {
  	diamond.kill();
		score += 10;
		scoreText.text = "Score: " + score;
}//collectDiamond

function playerHitRubies(player,ruby){
		ruby.kill();
		lives--;
		alert("You lost a life!");
		if(lives != 0){
			livesText.setText("Lives: " + lives);
		}else{
			alert("You lost! Game over");
			location.reload();
		}//if-else
}//playerHitRubies
