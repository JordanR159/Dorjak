
var ready = false;
var d = new Date();
var startTime;
var sun;
var planets = [];
var asteroids = [];
var data = [];
var asteroidSpawnRate = 2000 //in milliseconds
var baseRadius = 50;
var screenWidth = 1920;
var screenHeight = 1080;
var baseVel = 100;
var key;
var thrust;
var pressed;
var world;


self.onmessage = function(e)
{
	if(e.data.gameStatus === "init") {
		initWorld();
		pressed = 0;
		startTime = d.getTime();
	} else if(e.data.gameStatus === "input")
	key = e.data.key;
	pressed = e.data.keyStatus; //1 for pressed, 0 for released
}
 

function update() {
	var fps = 60;
	var timeStep = 1.0/fps;
	var iterations = 8;
	world.Step(timeStep, iterations);
	
	var currTime = d.getTime();
	if(currTime - startTime > asteroidSpawnRate) {	//asteroid generation
		startTime = currTime;
		generateAsteroids();
	}
	this.timer = setTimeout( function() { update(); }  , 1000 / this.fps);
}
function generateAsteroids() {
	 var numAsteroids =  getRandomInt(0, 3); //generates between 0-3 (inclusive)
	 var minRadius = Math.floor(baseSize / 4);
	 var maxRadius = baseRadius;
	 var minVel = Math.floor(baseVel / 2);
	 var maxVel = Math.floor(baseVel * 2);
	 for(var i = 0; i < numAsteroids; i++) {
		 var asteroid = Box2D.Collision.Shapes.b2CircleShape;
		 
		 var side = getRandomInt(1, 4) //generate start position
		 switch(side) {
			 case 1: //left
			 asteroid.m_position.Set(0, getRandomInt(0, screenHeight));
			 break;
			 case 2: //right
			 asteroid.m_position.Set(screenWidth, getRandomInt(0, screenHeight));
			 break;
			 case 3: //top
			 asteroid.m_position.Set(getRandomInt(0, screenWidth), screenHeight);
			 break;
			 case 4: //bottom
			 default:
			 asteroid.m_position.Set(getRandomInt(0, screenWidth), 0);
		 }
		 asteroid.m_radius.Set(getRandomInt(minRadius, maxRadius)); //generate size
		
		var angle = calculateAngle(asteroid, sun); //generate velocity
		var velocity = getRandomInt(minVel, maxVel);
		asteroid.m_baseVelocity = velocity;
		asteroid.m_velocity.Set(velocity*Math.cos(angle), velocity*Math.sin(angle)); 
		
		world.createBody(asteroid); //add to world
		asteroids.push(asteroid); //add to array
	 }
	
}

function initWorld()
{
	var gravity = new b2Vec2(0, 0);
	var worldAABB = new b2AABB();
	worldAABB.minVertex.Set(0,0);
	worldAABB.maxVertex.Set(screenWidth, screenHeight);
	world = new b2World(worldAABB, gravity, true);
	sun.m_position.Set(screenWidth/2, screenHeight/2);
	sun.m_radius = baseRad*5;
	world.CreateBody(sun);
	
	for(var i = 1; i < 11; i++)
	{
		var planetCircleDef = new b2CircleDef();
		var info = new b2Vec3();
		switch(i) {
			case 1: planetCircleDef.radius = baseRad*3;
			x = 
			break;
			case 2:planetCircleDef.radius = baseRad*2.25;
			break;
			case 3:planetCircleDef.radius = baseRad*1.5;
			break;
			case 4:planetCircleDef.radius = baseRad;
			break;
			case 7:planetCircleDef.radius = baseRad;
			break;
			case 8:planetCircleDef.radius = baseRad*1.5;
			break;
			case 9:planetCircleDef.radius = baseRad*2.25;
			break;
			case 10:planetCircleDef.radius = baseRad*3;
			default:
		}
		info.rad = planetBody.radius;
		var planetB = new b2BodyDef();
		planetB.addShape(planetCircleDef);
		planetB.position.Set(screenWidth/2, screenHeight*i/11);
		planetB.distanceFromSun = Math.abs(planetB.position.y - sun.position.y);
		switch(i) {
			case 1:
				planetB.angleFromSun = Math.PI/2;			
				planetB.baseVelocity = baseVel/2;
				planetB.linearVelocity.Set(baseVel/2, 0);
			break;
			case 2:
				planetB.angleFromSun = Math.PI/2;
				planetB.baseVelocity = baseVel/1.7;
				planetB.linearVelocity.Set(baseVel/1.7, 0);
			break;
			case 3:
				planetB.angleFromSun = Math.PI/2;
				planetB.baseVelocity = -baseVel/1.4;
				planetB.linearVelocity.Set(-baseVel/1.4, 0);
			break;
			case 4:
				planetB.angleFromSun = Math.PI/2;
				planetB.baseVelocity = baseVel;
				planetB.linearVelocity.Set(baseVel, 0);
			break;
			case 7:
				planetB.angleFromSun = Math.PI*3/2;
				planetB.baseVelocity = baseVel;
				planetB.linearVelocity.Set(baseVel, 0);
			break;
			case 8:
				planetB.angleFromSun = Math.PI*3/2;
				planetB.baseVelocity = -baseVel/1.4;
				planetB.linearVelocity.Set(-baseVel/1.4, 0);
			break;
			case 9:
				planetB.angleFromSun = Math.PI*3/2;
				planetB.baseVelocity = baseVel/1.7;
				planetB.linearVelocity.Set(baseVel/1.7, 0);
			break;
			case 10:
				planetB.angleFromSun = Math.PI*3/2;
				planetB.baseVelocity = baseVel/2;
				planetB.linearVelocity.Set(baseVel/2, 0);
			default:
		}
		var planetBody = world.CreateBody(planetB);
		info.angle = planetB.angleFromSun;
		info.dist = planetB.distanceFromSun;
		planets.push(planetBody);	
		data.push(info);
		if(i == 4)
		{
			i+= 2;
		}
	}
	
	for(var i = 0; i < 8; i++)
	{
		
	}
	
	postMessage({gameStatus : 'init', sun : {x : sun.m_position.x, y: sun.m_position.y , radius : sun.m_radius}, planets : data});
	ready = true;
}

function movePlanets()
{
	for(var planet in planets)
	{
		/*if(-selected- && pressed)
		{
			if(-speed-)
				thrust += 0.2;
			else if(-slow-)
				thrust -= 0.2;
		}
		else if(thrust < 0)
			thrust += 0.1;
		else if(thrust > 0)
			thrust -= 0.1;
		var angVelocity = (planet.m_baseVelocity + thrust*10)/planet.radiusFromSun;
		planet.angleToSun = planet.angleToSun + angVelocity;*/
	}
}





function calculateDistance(a, b) { //returns distance between object a and object b
	return Math.sqrt((a.m_position.x - b.m_position.x)*(a.m_position.x - b.m_position.x)+
					  (a.m_position.y - b.m_position.y)*(a.m_position.y - b.m_position.y));
}

function calculateAngle(current, target) {
	var triangleHeight = current.m_position.y - target.m_position.y;
	var triangleBase = current.m_position.x - target.m_position.x;
	return Math.atan(triangleBase/triangleHeight);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}















