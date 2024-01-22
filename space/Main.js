var canvas; 
var stage;

var win; 
var lose;

var lives = new createjs.Container(); //хранит жизни
var bullets = new createjs.Container(); //хранит пули
var enemies = new createjs.Container(); //хранит врагов

var bg; 
var bg2; 

var ship; 
var enemy; 
var boss;
var live;

var bullet;



var bossHealth = 20;
var score; 

var centerX = 360; 

var tkr = new Object(); //используетс€ дл€ прослушивани€ Ticker
var timerSource; //ссылаетс€ на метод setInterval
var timerSource2; //ссылаетс€ на метод setInterval
var manifest;

var preloader;

var totalLoaded = 0;

var loaderBar;
var outline, bar;
var width_p = 200;
var bossFinal = false;
function Main()
{

	
	  canvas = document.getElementById('Shooter');
	  canvas.style.background = "#CCCCCC";
  	stage = new createjs.Stage(canvas);
  		
  	stage.mouseEventsEnabled = true;
  	
  	progress = document.querySelector('#progressX');
  	
 

  	manifest = [
				{src:"bg.png", id:"bg"},
				{src:"bg2.png", id:"bg2"},
				{src:"ship.png", id:"ship"},
				{src:"enemy1.png", id:"enemy"},
				{src:"boss.png", id:"boss"},
				{src:"live.png", id:"live"},
				{src:"bullet.png", id:"bullet"},
				{src:"win.png", id:"win"},
				{src:"lose.png", id:"lose"},
				{src:"boss.mp3", id:"boss2"},
				{src:"explo.mp3", id:"explo"},
				{src:"shot.mp3", id:"shot"}
			];
    
    
    preloader = new createjs.LoadQueue(true, "assets/");
     
    preloader.installPlugin(createjs.Sound);
    
    drawPreloader();
    
    preloader.on('complete', handleComplete);
    preloader.on('progress', handleProgress);
    preloader.on("fileload", handleFileLoad);
    

    preloader.loadManifest(manifest);
    
    optimizeForTouchAndScreens();

	 createjs.Ticker.addEventListener("tick",function()
    {
      stage.update();
    });
	
}





function optimizeForTouchAndScreens () {
    if (typeof window.orientation !== 'undefined') {
        window.onorientationchange = onOrientationChange;
        if (createjs.Touch.isSupported()) {
            createjs.Touch.enable(stage);
        }
        onOrientationChange();
    }
    else {
        window.onresize = resizeGame;
        resizeGame();
    }
}
function onOrientationChange() {
   setTimeout(resizeGame, 100);
}

function resizeGame()
{
    var canvasRatio = canvas.height / canvas.width;
    var windowRatio = window.innerHeight / window.innerWidth;
    
    var offsetX, offsetY;
    var bounds = canvas.getBoundingClientRect();
    var parents = document.body.getBoundingClientRect();
    var width2 = bounds.width;
    var height2 = bounds.height;
    
    var type = {VERTICAL:0,HORIZONTAL:0}

    if (windowRatio < canvasRatio) {
        height = window.innerHeight;
        width = height / canvasRatio;
        
       
        type.VERTICAL = 0;
        type.HORIZONTAL = 1;
        console.log("HOTRIZONTAL")
        
    } else {
        type.VERTICAL = 1;
        type.HORIZONTAL = 0;
        console.log("VERTICAL")
       
        width = window.innerWidth;
        height = width * canvasRatio;
    }
    
    
    var offsetX = Math.floor((window.innerWidth - width) / 2);
    var offsetY = Math.floor((window.innerHeight - height) / 2);
    
    if(type.VERTICAL==1)
    {
      offsetX = 0;
    }
    if(type.HORIZONTAL==1)
    {
      offsetY = 0;
    }
    var style = canvas.style;
    style.marginLeft = offsetX + 'px';
    style.marginTop = offsetY + 'px';
    style.width = width + 'px';
    style.height = height + 'px';
}

function drawPreloader()
{

    var fon = new createjs.Bitmap("assets/fon.jpg");
    loaderBar = new createjs.Container();
    var height_p = 20;
    var x = (canvas.width / 2) - (width_p / 2);
    var y = (canvas.height / 2) - (height_p / 2);
    console.log(canvas.height);
    
    outline = new createjs.Shape();
    outline.graphics.beginStroke("#FFF");
    outline.graphics.drawRect(0,0, width_p, height_p);
    bar = new createjs.Shape();
    bar.graphics.beginFill("#d2354c");
      
    bar.graphics.drawRect(0,0, 1, height_p);
    
    
    outline.x = x;
    outline.y = y;
    bar.x = x;
    bar.y = y;
    
    
    loaderBar.addChild(fon,outline, bar);
    stage.addChild(loaderBar);
}

function handleProgress(event)
{

bar.scaleX = event.loaded * width_p;

}

function handleComplete(event) {


}

function handleFileLoad(event) {
  var data1 = event.item;
 
    switch(data1.type)
    {
      case "image":
      
         var img = new Image();
         img.src = data1.src;
         img.onload = handleLoadComplete;
         window[data1.id] = new createjs.Bitmap(img);
      break;

      case "sound":
      
      handleLoadComplete();
      break;
    }
}

 function handleLoadComplete(event) 
 {
  
	totalLoaded++;
	if(manifest.length==totalLoaded)
	{
		addGameView(); 
		
	}
 }




  function addGameView()
  {
    ship.x = centerX - 41; 
    ship.y = 1080 + 76; 
      
    /* ƒобавление жизни */
      
   for(var i = 0; i < 3; i++) 
   { 
        var l = new createjs.Bitmap(preloader.getResult("live"));
          
        l.x = 558 + (56 * i); 
        l.y = 1041; 
          
       lives.addChild(l); 
       stage.update(); 
    } 
    
   
    /* “екст счета */
      
    score = new createjs.Text('0', 'bold 32px Courier New', '#FFFFFF'); 
    score.maxWidth = 1000;  //fix for Chrome 17 
    score.x = 5; 
    score.y = 1046; 
      
    /* ƒобавл€ем объекты на сцену */
      
    bg2.y = -1080; 
    stage.addChild(bg, bg2, ship, enemies, bullets, lives, score); 
    createjs.Tween.get(ship).to({y:957}, 1000).call(startGame); 
  }
  function moveShip(e) 
  { 
      ship.x = e.stageX - 18.5; 
  }
  
  function shoot() 
  { 
      var b = new createjs.Bitmap(preloader.getResult("bullet"));
    
     
        
      b.x = ship.x + 13; 
      b.y = ship.y - 20; 
      
      bullets.addChild(b);  
       
      stage.update(); 
      createjs.Sound.play('shot'); 
     
  }
  
  function addEnemy() 
  { 
      var enemy = new createjs.Bitmap(preloader.getResult("enemy")); 
        
      enemy.x = Math.floor(Math.random() * (720 - 112)) 
      enemy.y = -112
        
      enemies.addChild(enemy); 
      
  }
  
  function moveEnemy()
  {
    stage.update(); 
  }
  
  function startGame() 
  { 
      stage.addEventListener("stagemousemove", moveShip);
      
      
      bg.addEventListener("click", shoot);
      bg2.addEventListener("click", shoot);
      
      createjs.Ticker.addEventListener("tick", update);
    
        
      timerSource = setInterval('addEnemy()', 1000); 
      timerSource2 = setInterval('moveEnemy()', 10); 
  }
  function update() 
{ 
    /* ѕереместить фон */
    bg.y += 10; 
    bg2.y += 10; 
      
    if(bg.y >= 1080) 
    { 
        bg.y = -1080; 
    } 
    else if(bg2.y >= 1080) 
    { 
        bg2.y = -1080; 
    }
    
    
    
    for(var i = 0; i < bullets.children.length; i++) 
    { 
        bullets.children[i].y -= 22; 
          
        
          
        if(bullets.children[i].y < - 45) 
        { 
            bullets.removeChildAt(i); 
        } 
    }
    
    
    if(parseInt(score.text) >= 500 && !bossFinal) 
    { 
        bossFinal = true;
        boss = new createjs.Bitmap(preloader.getResult("boss")); 
        createjs.Sound.play('boss2');
       
                  
        boss.x = centerX - 202; 
        boss.y = -411; 
             
        stage.addChild(boss); 
        createjs.Tween.get(boss).to({y:90}, 2000)   //вывести босса на игровую площадку
    }
   
    for(var j = 0; j < enemies.children.length; j++) 
    { 
        enemies.children[j].y += 11; 
          
        
        //”ничтожаем противника если он уходит за границу игрвого пол€  
        if(enemies.children[j].y > 1080 + 112) 
        { 
            enemies.removeChildAt(j); 
        }
        
        
        //„ерез цикл производим действи€ с пул€ми которые были созданы ранее
        for(var k = 0; k < bullets.children.length; k++) 
        { 
            
            //—толкновение снар€дов с врагами и уничтожение обоих 
            if(bullets.children[k].x >= enemies.children[j].x && bullets.children[k].x + 24 < enemies.children[j].x + 110 && bullets.children[k].y < enemies.children[j].y + 90) 
            { 
                bullets.removeChildAt(k); 
                enemies.removeChildAt(j); 
                stage.update(); 
                createjs.Sound.play('explo');
                //ƒобавл€ем очки при уничтожении противника 50 очков за штуку
                score.text = parseFloat(score.text + 50); 
            }
           //—толкновение снар€да с боссом
          if(bossFinal && bullets.children[k].x >= boss.x && bullets.children[k].x + 24 < boss.x + 411 && bullets.children[k].y < boss.y + 364) 
          { 
             
              bullets.removeChildAt(k); 
              bossHealth--; 
              stage.update(); 
              createjs.Sound.play('explo'); 
              //ƒобавл€ем 50 очков за каждое попадание
              score.text = parseInt(score.text + 50); 
          } 
        }
     
        //—толкновение врага с кораблем игрока и уничтожение обоих
        if(enemies.hitTest(ship.x, ship.y) || enemies.hitTest(ship.x + 83, ship.y)) 
        { 
            
            //
            enemies.removeChildAt(j); 
            lives.removeChildAt(lives.children.length-1); 
           // 
            
            ship.y = 1080 + 76; 
            createjs.Tween.get(ship).to({y:957}, 1000) 
            createjs.Sound.play('explo'); 
        } 
    }
    
    // огда здоровье босса дойдет до нул€, выводим сообщение о победе 
    if(bossHealth <= 0) 
    { 
        bossFinal = false;
        alertStatus('win'); 
    } 
      
    
    // огда здоровье корабл€ дойдет до нул€ по€витс€ сообщение о поражении
    if(lives.children.length <= 0) 
    { 
        alertStatus('lose'); 
    } 
}

function alertStatus(e) 
{ 
    /* ”далить слушателей событи€ */
    
    stage.removeEventListener("stagemousemove", moveShip);      
    
    bg.removeEventListener("click", shoot);
   
    
    
    createjs.Ticker.removeEventListener("tick", update);  
   
      
    timerSource = null; 
    timerSource2 = null;  
    /* ѕоказать сообщение */
      
    if(e == 'win') 
    { 
        win = new createjs.Bitmap(preloader.getResult("win")); 
        win.x = 0; 
        win.y = 0; 
        stage.addChild(win); 
        stage.removeChild(enemies, boss); 
    } 
    else
    { 
        lose = new createjs.Bitmap(preloader.getResult("lose")); 
        lose.x = 0; 
        lose.y = 0; 
        stage.addChild(lose); 
        stage.removeChild(enemies, ship); 
    } 
    bg.addEventListener("click", function(){
      window.location.reload();
    });
    bg2.addEventListener("click", function(){
      window.location.reload();
    }); 
      
   
    stage.update(); 
}
