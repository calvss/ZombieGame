var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

var maxScore = 10;
var score = maxScore;

var screenSizeX = 600;
var screenSizeY = 400;
var invaderWidth = 20;
var starWidth = 2;

var reset = 450;

var bullet = new Array(), bgStars = new Array(), player, playArea, invader = new Array(),wPressed, sPressed, aPressed, dPressed, ascii, timeLeft, highScore = 0, globalTime = 0;

var moveSpeed = 6;
var invaderSpeed = 0.5;
var bulletSpeed = 8;
var reloadTimer = 10; //reload speed in 10ms


function init()
{
	playArea = new box(0, 0, screenSizeX, screenSizeY, "black");
	infoBar = new box(0, screenSizeY, screenSizeX, 40, "grey");
	healthBar = new progressBar(100, 20, 1);
	
	player = new box(0,350,50, 50, "blue");
	
	setInterval(draw, 10);
	setInterval(globalTimeIncrement, 1000);
	interval(update, 10);
	
	for(i=0; i <= 50; i++)
	{
		bgStars[bgStars.length] = new box((screenSizeX - starWidth) * Math.random(), (screenSizeY - starWidth) * Math.random(), starWidth, starWidth, "white", 0, 0);
	}
	canvas.onmousedown = mouseDown;
}
//--------------------------------------------------Update-------------------------------------------------------
function update()
{
	
	document.onkeypress = keyDown;
	document.onkeyup = keyUp;
	
	if(score == 0)
	{
		alert("Game Over!");
	}
	
	if(reloadTimer) reloadTimer--;
	healthBar.healthPct = score/maxScore;
	healthBar.hLevel.width = healthBar.maxWidth*healthBar.healthPct;
	
	for(i=0; i < invader.length;i++)//set invader's vectors
	{
		invader[i].vx = (invader[i].x - player.x)/distance(invader[i], player);
		invader[i].vy = (invader[i].y - player.y)/distance(invader[i], player);
	}
	
	for(i=0; i < bullet.length;i++)//move every bullet in the play area
	{		
		if(recCol(bullet[i], playArea))
		{
			bullet[i].y-=(bullet[i].vy)*bulletSpeed;
			bullet[i].x-=(bullet[i].vx)*bulletSpeed;
		}
	}
	for(i=0; i < invader.length;i++)//move invaders towards player
	{
		invader[i].y-=(invader[i].vy)*invaderSpeed;
		invader[i].x-=(invader[i].vx)*invaderSpeed;
	}
		
	if(aPressed && player.x > 0)						//move the player at the specified move speed
	{													//
		player.x-=moveSpeed;							//left if 'a' is pressed and not at the leftmost edge
	}													//
	else if(dPressed && player.x + player.width < screenSizeX)	//
	{													//
		player.x+=moveSpeed;							//right if 'd' is pressed and not at the rightmost edge
	}													//
	if(wPressed && player.y > 0)
	{
		player.y-=moveSpeed;
	}
	else if(sPressed && player.y + player.height < 400)
	{
		player.y+=moveSpeed;
	}											//
		
	for(i=0; i < invader.length;i++)
	{
		for(j=0; j < bullet.length;j++)
		{
			if(recCol(bullet[j], invader[i])) //if any bullet collides with any invader
			{
				invader[i].x = (screenSizeX - invader[i].width) * Math.random();//reset the invader to random position
				invader[i].y = 0;				   //at the top of the screen
				
				bullet[j].y = reset;			//send the used bullet to a y level out of screen
			}
		}
		if(recCol(invader[i], player))//if any invader touches the player
			{
				invader[i].x = (screenSizeX - invader[i].width) * Math.random();//reset the invader to random position
				invader[i].y = 0					//at the top of the screen
				score--;							//and deduct the score
			}
	}
	
	for(i=0; i < bgStars.length ;i++)//move all the stars
	{
		bgStars[i].y++;
		
		if(!recCol(bgStars[i], playArea))
		{
			bgStars[i].y = 0;
			bgStars[i].x = (screenSizeX - starWidth) * Math.random();
		}
	}
	
}
//--------------------------------------------------End Of Update-------------------------------------------------------
function draw()
{
	playArea.drawBox(context);
	console.log(healthBar);
	
	for(i=0; i < invader.length;i++)//draw all the invaders
	{
		invader[i].drawBox(context);
	}
	for(i=0; i < bullet.length;i++)//draw all the bullets
	{
		if (typeof bullet[i] != 'undefined')
		{
			bullet[i].drawBox(context);
		}
	}
	//for(i=0; i < bgStars.length ;i++)//draw all the stars
	//{
	//	bgStars[i].drawBox(context);
	//}
	player.drawBox(context);
	infoBar.drawBox(context);
	healthBar.BG.drawBox(context);
	healthBar.hLevel.drawBox(context);
	document.getElementById("clock").innerHTML = "Lives Left: " + score;//print lives
}

function interval(func, wait, times){	//a better alternative to setInterval from thecodeship.com
    var interv = function(w, t){
        return function(){
            if(typeof t === "undefined" || t-- > 0){
                setTimeout(interv, w);
                try{
                    func.call(null);
                }
                catch(e){
                    t = 0;
                    throw e.toString();
                }
            }
        };
    }(wait, times);

    setTimeout(interv, wait);
};

function globalTimeIncrement()
{
	globalTime++;
	if((globalTime%2) == 0)		//every 2 seconds spawn a new invader
	{
		invader[invader.length] = new box((screenSizeX - invaderWidth) * Math.random(), 0, invaderWidth, invaderWidth, "yellow", 0, 0);//spawn 1 invader at random position at top of the screen
	}
	
	
}

init();
