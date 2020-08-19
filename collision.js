const WALL_MAX_X = 900;
const WALL_MAX_Y = 600;

const TIME_UNIT = 1; // 1 second

const canvas = document.getElementById('canvas');

const context = canvas.getContext('2d');

const colours = ['White', 'Silver', 'Gray', 'Black', 'Red', 'Maroon',
'Yellow', 'Olive', 'Lime', 'Green', 'Aqua', 'Teal', 'Blue', 'Navy',
'Fuchsia', 'Purple'];


canvas.height = WALL_MAX_Y;
canvas.width = WALL_MAX_X;

function makeBall(posX, posY, radius, velocityX, velocityY) {
	return { x: posX, y: posY, radius: radius,
					vX: velocityX, vY: velocityY, m: (radius/50),
					colour: colours[randomInt(colours.length)]
				};
}

function getMovingDirection(v) {
  if (v == 0) {
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
      return Infinity;
   }
}

// Simulate elements at 30 fps == 1/30 sec for each frame rendering
// Therefore, we only need to compute all events within next 1/30 seconds.
// calculate distance between 0 to 1/30 of a second to see if the balls collide
// 1. get two line equations
// 2. check if they cross (i.e., not parallel)
// 3. compute time of when they cross
// 4. if the time is between t0 <= cross-time <= t1(= t0 + 1/30 sec), then it means collision.

// // TESTS
// console.log(distanceToWall(10, 10, 600))


/* test balls
b1 = makeBall(1,2,3,4,5) // hit right wall
b2 = makeBall(4,6, 7, -10, 10) // hit left wall
b3 = makeBall(34, 100, 122, 0,333) // hit no vertical wall
Infinity === distanceToWall(b3)

distance
*/

function timeToHitWall(x_or_y, vx_or_vy, max_x_or_y) {
  distance = distanceToWall(x_or_y, vx_or_vy, max_x_or_y);
  // console.log("1 " + distance)
  if (distance === Infinity) {
    return Infinity;
  }
  return (distance / Math.abs(vx_or_vy));
}

function timeToHitVerticalWall(ball) {
  return timeToHitWall(ball.x, ball.vX, WALL_MAX_X);
}

function timeToHitHorizontalWall(ball) {
  return timeToHitWall(ball.y, ball.vY, WALL_MAX_Y);
}

function calcDistSquareCoeff(l1, l2, lX1, lX2) {
	// use pythagoras
	locDiff = l1 - l2;
	velDiff = lX1 - lX2;
	return [Math.pow(locDiff, 2), //constant
				2 * locDiff * velDiff, 		// t^1
				Math.pow(velDiff, 2)];	//t^2
}

function timeToCollide(ball1, ball2) {
	coeffX = calcDistSquareCoeff(ball1.x, ball2.x, ball1.vX, ball2.vX);
	coeffY = calcDistSquareCoeff(ball1.y, ball2.y, ball1.vY, ball2.vY);

	//quadratics
	c = coeffX[0] + coeffY[0] - Math.pow((ball1.radius + ball2.radius), 2);
	b = coeffX[1] + coeffY[1];
	a = coeffX[2] + coeffY[2];

	//console.log("****" + a + ':' + b + ':' + c)
	sqrtPart = Math.sqrt(Math.pow(b, 2) - 4 * a * c);
// you need to add brackets between 2a for some reason
	t1 = (-b + sqrtPart) / (2 * a);
	t2 = (-b - sqrtPart) / (2 * a);

	if (t1 > 0 && t2 > 0) {
		return Math.min(t1, t2);
	} else if (t1 * t2 === 0) {
		return 0;
	} else if (t1 * t2 < 0) {
		negativeTime = Math.min(t1, t2);
		positiveTime = Math.max(t1, t2);
		if (-1 < negativeTime && negativeTime < 0) {
			return negativeTime;
		} else {
			return positiveTime;
		}
	} else {
		return Infinity;
	}
}

//
 b1 = makeBall(0, 0, 1, 1, 1); // hit right wall
 b2 = makeBall(4, 4, 1, -1, -1); // hit left wall
 b3 = makeBall(4, 0, 1, -1, 1);
 b4 = makeBall(0, 4, 1, 1, -1);
 b5 = makeBall(2, 4, 1, 0, -1);
//
 // console.log("1 2", timeToCollide(b1,b2))
 // console.log("1 3", timeToCollide(b1,b3))
 // console.log("1 4", timeToCollide(b1,b4))
 // console.log("1 5", timeToCollide(b1,b5))
 // console.log("1 2", calcDistSquareCoeff(0, 4, 1, -1))
 // console.log("1 3", calcDistSquareCoeff(0, 0, 1, 1))
 // console.log("1 4", calcDistSquareCoeff(0, 4, 1, -1))
 // console.log("1 5", calcDistSquareCoeff(0, 2, 1, 0))



function moveBall(ball) {
	ball.x = ball.x + ball.vX;			// next x ball coordinate =
	ball.y = ball.y + ball.vY;
}

function moveBalls(balls) {
	for (var ball of balls) {
		moveBall(ball);
	}
}

function randomInt(n) {
	//returns 0<= random integer < n
	return Math.floor(Math.random() * n);
}

function makeRandBall(max_x_or_y, max_x_or_y, max_radius, max_vX_or_vY, max_vX_or_vY) {
	return makeBall(randomInt(max_x_or_y) + 5, randomInt(max_x_or_y) + 5,
									randomInt(max_radius) + 5,
									selectDirection(randomInt(max_vX_or_vY)),
									selectDirection(randomInt(max_vX_or_vY)));
}
// if it is =< instead of <=, it will be invalid left hand assigment, syntax error
function selectDirection(velocity) {
	probability = Math.random();
	if (0 <= probability && probability < 0.5) {
		return velocity;
	} else {
			return -velocity;
		}
}

/*
function makeRandBall(max_x_or_y, max_x_or_y, max_radius, max_vX_or_vY, max_vX_or_vY) {
	return makeBall(randomInt(max_x_or_y) + 5, randomInt(max_x_or_y) + 5,
									randomInt(max_radius) + 5,
									randomInt(max_vX_or_vY) + 5, randomInt(max_vX_or_vY) + 5,
									)
} this one is faulty because it only selects velocity in a positive direction
so every ball goes in the same direction
*/
// function makeRandBalls(numberOfBalls) {
// 	//function will create an array of balls
// 	ballArray = new Array(numberOfBalls)
// 	for (i = 0; i < ballArray.length; i = i + 1) {
// 			// each ball has random x and y, vx and vy, radius and mass
// 			ballArray[i] = makeRandBall(600, 600, 50, 50, 50, 10)
// 	}
// 	return ballArray
// }

function paintBall(ball) {
	context.beginPath();
	context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
	context.fillStyle = ball.colour;
	context.fill();
}

function paintBalls(balls) {
	clearCanvas();
	for (var ball of balls) {
		paintBall(ball);
	}
}

function getMomentumOfBall(ball) {
	return {fX: ball.m * ball.vX, fY: ball.m * ball.vY};
}

function updateVelocityAfterCollision(ball1, ball2) {
	// momentum =
	//impulse (change in momentum)
	force1 = getMomentumOfBall(ball1);
	force2 = getMomentumOfBall(ball2);
	ball1.vX = force1.fX + force2.fX;
	ball1.vY = force1.fY + force2.fY;
	ball2.vX = force1.fX + force2.fX;
	ball2.vY = force1.fY + force2.fY;
}

function wallCollision() {
	if (ball.y + ball.radius > canvas.height) {
			ball.vY = ball.vY * -1;
			}
	if (ball.y + ball.radius < 0) {
			ball.vY = ball.vY * -1;
			}
	if (ball.x + ball.radius > canvas.width) {
			ball.vX = ball.vX * -1;
			}
	if (ball.x + ball.radius < 0) {
			ball.vX = ball.vX * -1;
			}
}

function clearCanvas() {
	context.clearRect(0, 0, WALL_MAX_X, WALL_MAX_Y);
}
// ms is milleseconds
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function changeSomeForcesOfBalls(balls) {
	for (var i = 0; i < balls.length - 1; i++) {
		for	(var j = i + 1; j < balls.length; j++) {
			if (timeToCollide(balls[i], balls[j]) <= 0) {
				updateVelocityAfterCollision(balls[i], balls[j]);
			}
		}
	}
}

function areBallsOverlapped(ball1, ball2) {
 d = Math.sqrt(Math.pow((ball2.x - ball1.x), 2) +
							 Math.pow((ball2.y - ball1.y), 2));
 return (d < ball1.radius + ball2.radius);
}

function createNonOverlappingBall(existingBalls) {
    newBall = makeRandBall(900, 600, 50, 50, 50);
    for (var ball of existingBalls) {
        if (areBallsOverlapped(ball, newBall)) {
            return createNonOverlappingBall(existingBalls);
        }
    }
    return newBall;
}

function makeRandBalls(numberOfBalls) {
        //function will create an array of balls
        ballArray = new Array(numberOfBalls);
        for (i = 0; i < ballArray.length; i = i + 1) {
            ballArray[i] = createNonOverlappingBall(ballArray.slice(0, i));
        }
        return ballArray;
}

const oneTick = 90;
async function loop(seconds) {
	balls = makeRandBalls(20);
//	paintBalls(balls)
	// repeats here
	durationMs = 1000 * seconds;
	while (0 < durationMs) {
		paintBalls(balls);
		moveBalls(balls);
		changeSomeForcesOfBalls(balls);
		await sleep(oneTick); //
		durationMs = durationMs - oneTick;
	}

	// this loop was going too fast so sleep function was needed
}
//	var interval = setInterval(draw, 0);



function reset() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
