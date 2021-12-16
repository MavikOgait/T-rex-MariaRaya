var trex, trex_running, trex_stop, edges;
var groundImage, ground, groundInvisivel;
var nuvem, nuvemImagem, nuvemGrupo;
var obstaculo, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6, obstaculoGrupo;
var aleatorio, pontuacao;
var GameOver, Restart, GameOverImage, RestartImage;
var saltar_sound, checkpoint_sound, morrer_sound;  

var FIM = 0;
var PLAY = 1;
var estadoJogo = PLAY;

function preload(){  //Carrega a imagem
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_stop = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  nuvemImagem = loadImage("cloud.png");

  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");

  GameOverImage = loadImage("gameOver.png");
  RestartImage = loadImage("restart.png");

  saltar_sound = loadSound("jump.mp3");
  morrer_sound = loadSound("die.mp3");
  checkpoint_sound = loadSound("checkpoint.mp3");
}

function setup(){
  createCanvas(600,200);

  //criando o trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running); // Associa a imagem ao sprite
  trex.addAnimation("collided", trex_stop); 
  edges = createEdgeSprites();
  
  //adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50

  // Chão
  ground = createSprite(200,180,400,20);
  ground.x = ground.width / 2; //Situa a posição x do chão
  ground.addAnimation("chão", groundImage);

  //Chão invisível
  groundInvisivel = createSprite(200,190,400,10);
  groundInvisivel.visible = false;

  //Pontuação
  pontuacao = 0;

  nuvemGrupo = new Group();
  obstaculoGrupo = new Group();

  trex.setCollider("circle", 0, 0, 40);

  // Restart
    GameOver = createSprite(300, 80);
    GameOver.addImage(GameOverImage);
    GameOver.scale = 0.5;

    Restart = createSprite(300, 120);
    Restart.addImage(RestartImage);
    Restart.scale = 0.4;

}


function draw(){
  //definir a cor do plano de fundo 
  background("white");

  text("Pontuação: " + pontuacao, 500, 40);
 
  if (estadoJogo == PLAY){

    Restart.visible = false;
    GameOver.visible = false;  
    
    //movimento do chão
    ground.velocityX = -2;
    pontuacao = pontuacao + Math.round(getFrameRate()/60);

    //som da pontuação
    if (pontuacao % 100 == 0 && pontuacao > 0){
      checkpoint_sound.play();
    }


    if (ground.x < 0){
      ground.x = ground.width / 2;  // Faz a repetição do chão 
    }

     //pular quando tecla de espaço for pressionada
    if(keyDown("space") && trex.y > 100){
    trex.velocityY = -10;
    saltar_sound.play();
    }

    trex.velocityY = trex.velocityY + 1; // Faz com que o T-Rex retorne ao chão

    // Criar nuvens
    criarNuvens ();

    //Criar obstáculos 
    criarObstaculos ();

    if (obstaculoGrupo.isTouching(trex)){
      estadoJogo = FIM;
      morrer_sound.play();
    }

  } else if (estadoJogo == FIM) {

    Restart.visible = true;
    GameOver.visible = true;
  
    ground.velocityX = 0; 
    trex.velocityX = 0;
    trex.velocityY = 0;

    //Parar obstáculo e nuvens
    obstaculoGrupo.setVelocityXEach(0);
    nuvemGrupo.setVelocityXEach(0);

    //Mudar a animação do trex
    trex.changeAnimation("collided", trex_stop);

    // reniciar o jogo
    if (mousePressedOver(Restart)){
      reset();
    }

    //Tempo de vida para os sprites não sumirem
    obstaculoGrupo.setLifetimeEach(-1);
    nuvemGrupo.setLifetimeEach(-1);

    //GameOver ++ Restart

  }

  console.log(frameCount);

 //impedir que o trex caia
  trex.collide(groundInvisivel);

  drawSprites();
}

function criarNuvens(){
  if (frameCount % 50 == 0){
    nuvem = createSprite(600,100,40,10);
    nuvem.velocityX = -5;
    nuvem.addImage(nuvemImagem);
    nuvem.y = random(30,100);
    nuvem.scale = 0.6;

    nuvem.lifetime = 220;  // vida da nuvem

    // Ajuste de profundidade

    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1; 

    nuvemGrupo.add(nuvem);
  }
}

function criarObstaculos (){
  if (frameCount % 50 == 0){
    obstaculo = createSprite(605,165,10,40);
    obstaculo.velocityX = -(4 + pontuacao / 100);

    aleatorio = Math.round(random(1,6));

      switch(aleatorio){
        case 1: obstaculo.addImage(obstaculo1);
        break;

        case 2: obstaculo.addImage(obstaculo2);
        break;

        case 3: obstaculo.addImage(obstaculo3);
        break;

        case 4: obstaculo.addImage(obstaculo4);
        break;

        case 5: obstaculo.addImage(obstaculo5);
        break;

        case 6: obstaculo.addImage(obstaculo6);
        break;

        default: break;
     }

      // Escala + Tempo de Vida

      obstaculo.scale = 0.45;
      obstaculo.lifetime = 220;

      obstaculoGrupo.add(obstaculo);
  }
}

function reset(){
  estadoJogo = PLAY;
  pontuacao = 0;

  Restart.visible = false;
  GameOver.visible = false;

  obstaculoGrupo.destroyEach();
  nuvemGrupo.destroyEach();
  trex.changeAnimation("running", trex_running);
}