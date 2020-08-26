/* Constants */

// Walls
const WALL_MAX_X = 900;
const WALL_MAX_Y = 600;

// time
const TIME_UNIT = 1; // 1 second
const ONE_TICK = 500;

// canvas, colours, UI, etc
const CANVAS = document.getElementById('canvas');

const CONTEXT = CANVAS.getContext('2d');

const COLOURS = ['White', 'Silver', 'Gray', 'Black', 'Red', 'Maroon',
'Yellow', 'Olive', 'Lime', 'Green', 'Aqua', 'Teal', 'Blue', 'Navy',
'Fuchsia', 'Purple'];

CANVAS.height = WALL_MAX_Y;
CANVAS.width = WALL_MAX_X;

const ERROR_OF_MARGIN = 0.00000000001;

/* Functions */

// utility function
function sleep(ms) { // ms is milleseconds
	return new Promise(resolve => setTimeout(resolve, ms));
}



function isSameTime(time1, time2) {
  return Math.abs((time1 - time2)) < ERROR_OF_MARGIN
}

function randomInt(n) {
	//returns 0<= random integer < n
	return Math.floor(Math.random() * n);
}

// UI Functions
function clearCanvas() {
	CONTEXT.clearRect(0, 0, WALL_MAX_X, WALL_MAX_Y);
}

function paintBall(ball) {
	CONTEXT.beginPath();
	CONTEXT.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
	CONTEXT.fillStyle = ball.colour;
	CONTEXT.fill();
  CONTEXT.font = '50px serif';
  CONTEXT.fillStyle = 'pink';
  CONTEXT.fillText(String(ball.n), ball.x, ball.y)
}
////////////////////////////////////////////
function calcDistSquareCoeff(l1, l2, lX1, lX2) {
	// use pythagoras
	locDiff = l1 - l2;
	velDiff = lX1 - lX2;
	return [Math.pow(locDiff, 2), //constant
				2 * locDiff * velDiff, 		// t^1
				Math.pow(velDiff, 2)];	//t^2
}
////////////////////////////////////////
function makeBall(posX, posY, radius, velocityX, velocityY, n) {
	return {n: n,
          x: posX, y: posY, radius: radius,
					vX: velocityX, vY: velocityY, m: (radius/50),
					colour: COLOURS[randomInt(COLOURS.length)]
				};
}

function selectDirection(velocity) {
	probability = Math.random();
	if (0 <= probability && probability < 0.5) {
		return velocity;
	} else {
			return -velocity;
		}
}

function timeToCollide(ball1, ball2) {
	coeffX = calcDistSquareCoeff(ball1.x, ball2.x, ball1.vX, ball2.vX);
	coeffY = calcDistSquareCoeff(ball1.y, ball2.y, ball1.vY, ball2.vY);

	//quadratics
	c = coeffX[0] + coeffY[0] - Math.pow((ball1.radius + ball2.radius), 2);
	b = coeffX[1] + coeffY[1];
	a = coeffX[2] + coeffY[2];

	//console.log("****" + a + ':' + b + ':' + c)
  discriminant = Math.pow(b, 2) - 4 * a * c
  if (discriminant < 0) {
    //imaginary "roots"
    return  Number.MAX_VALUE;
  }
	sqrtPart = Math.sqrt(discriminant);
	t1 = (-b + sqrtPart) / (2 * a);
	t2 = (-b - sqrtPart) / (2 * a);

	if ((isSameTime(t1, 0)) || (isSameTime(t2, 0))) {
		return 0;
	} else if (t1 > 0 && t2 > 0) {
		return Math.min(t1, t2);
	} else {
		return Math.min(Math.abs(t1), Math.abs(t2));
	}
}

function velocitiesAfterCollision(m1, v1, m2, v2) {
  totalM = m1 + m2

  finalV1 = v1 * (m1 - m2) / totalM + (v2 * 2 * m2)/totalM;
  finalV2 = (v1* 2 * m1) / totalM + v2 * (m2 - m1)/totalM;

  return [finalV1, finalV2]
}
////////////////////////////////////////
function makeRandBall(max_x, max_y, max_radius, max_v, n) {
  let radius = randomInt(max_radius) + max_radius
  let x = randomInt(max_x - radius * 2) + radius
  let y = randomInt(max_y - radius * 2) + radius
  return makeBall(x, y, radius,
                  selectDirection(randomInt(10)),
                  selectDirection(randomInt(10))
                  , n);
}

function areBallsOverlapped(ball1, ball2) {
 d = Math.sqrt(Math.pow((ball2.x - ball1.x), 2) +
							 Math.pow((ball2.y - ball1.y), 2));
 return (d < ball1.radius + ball2.radius);
}

function makeCollisionEvent(ball1, ball2) {
	return {time: timeToCollide(ball1, ball2), ball1: ball1, ball2: ball2}
}

function updateVelocityAfterCollision(ball1, ball2) {
  //totalM = ball1.m + ball2.m;
  [vX1, vX2] = velocitiesAfterCollision(ball1.m, ball1.vX, ball2.m, ball2.vX);
  [vY1, vY2] = velocitiesAfterCollision(ball1.m, ball1.vY, ball2.m, ball2.vY);

  ball1.vX = vX1;
  ball1.vY = vY1;
  ball2.vX = vX2;
  ball2.vY = vY2;
  }

////////////////////////////////////////////

function createNonOverlappingBall(existingBalls, n) {
    newBall = makeRandBall(900, 600, 10, 50, n);
    for (var ball of existingBalls) {
        if (areBallsOverlapped(ball, newBall)) {
            return createNonOverlappingBall(existingBalls, n);
        }
    }
    return newBall;
}

function earlyCollisionEvents(balls) {
  // return array of events, which will occur the earliest time
  var queue = new PriorityQueue({ comparator: function(event1, event2) {
    return event1.time - event2.time;
  }})

  	// build queue
  	for (var i = 0; i < balls.length - 1; i++) {
  		for	(var j = i + 1; j < balls.length; j++) {
  				event = makeCollisionEvent(balls[i], balls[j]);
  				queue.queue(event);
  		}
  	}
    earlyTime = queue.peek().time;
  	earliestEvents = [];
    do {
      event = queue.dequeue()
      earliestEvents.push(event)
    } while (queue.length > 0 && queue.peek().time === earlyTime)

    nextEarliestTime = (queue.lengh > 0) ? queue.peek().time: Number.MAX_VALUE;

  	return [earliestEvents, nextEarliestTime];
  }

function changeForcesOfCollidingBalls(events) {
  for (const event of events) {
    updateVelocityAfterCollision(event.ball1, event.ball2);
  }
}

function moveBall(ball, time) {
    ball.x = ball.x + time * ball.vX;			// next x ball coordinate =
  	ball.y = ball.y + time * ball.vY;
}
///////////////////////////////////////////
function makeRandBalls(numberOfBalls) {
        //function will create an array of balls
        ballArray = new Array(numberOfBalls);
        for (i = 0; i < ballArray.length; i = i + 1) {
            ballArray[i] = createNonOverlappingBall(ballArray.slice(0, i), i);
        }
        return ballArray;
}

function paintBalls(balls) {
	clearCanvas();
	for (var ball of balls) {
		paintBall(ball);
	}
}

function moveBalls(balls) {
  [events, nextEarliestTime] = earlyCollisionEvents(balls)
  eventTime = events[0].time

  if (isSameTime(eventTime, 0)) {
    changeForcesOfCollidingBalls(events);
  }
  moveTime = isSameTime(eventTime, 0)
  ? Math.min(nextEarliestTime, 1)
  : Math.min(eventTime, 1);

	for (var ball of balls) {
		 moveBall(ball, moveTime)
   }
}

async function loop(seconds) {
	balls = makeRandBalls(10);
	// repeats here
	durationMs = 1000 * seconds;
	while (0 < durationMs) {
		paintBalls(balls);
		moveBalls(balls);
		await sleep(ONE_TICK); //
		durationMs = durationMs - ONE_TICK;
	}
}

function reset() {
	CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
}
/************************************************************************/


function getMovingDirection(v) {
  if (v === 0) {
  return 0; // means not moving
  } else if (v > 0) {
  return 1; // means moving positive direction
  } else {
  return -1; // moving negative direction
  }
}

function distanceToWall(x_or_y, vx_or_vy, max_x_or_y) {
  switch (getMovingDirection(vx_or_vy)) {
    case 1: // hit right or bottom wall
      return (max_x_or_y - x_or_y);
    case -1: // hit left or top wall
//      console.log("2")
      return x_or_y;
    default:
//      console.log("3")
      return Number.MAX_VALUE;
   }
}

function timeToHitWall(x_or_y, vx_or_vy, max_x_or_y) {
  distance = distanceToWall(x_or_y, vx_or_vy, max_x_or_y);
  // console.log("1 " + distance)
  if (distance === Number.MAX_VALUE) {
    return Number.MAX_VALUE;
  }
  return (distance / Math.abs(vx_or_vy));
}

function timeToHitVerticalWall(ball) {
  return timeToHitWall(ball.x, ball.vX, WALL_MAX_X);
}

function timeToHitHorizontalWall(ball) {
  return timeToHitWall(ball.y, ball.vY, WALL_MAX_Y);
}
