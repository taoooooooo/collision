
//var canvas = document.getElementById("canvas");

const WALL_MAX_X = 600
const WALL_MAX_Y = 600

const INFINITY = Number.MAX_VALUE
const TIME_UNIT = 1 // 1 second

function makeBall (posX, posY, radius, velocityX, velocityY, mass) {
	return { x: posX, y: posY, radius: radius, vX: velocityX, vY: velocityY, m: mass }
}

function getMovingDirection(v) {
  if (v == 0) {
  return 0 // means not moving
  } else if (v > 0) {
  return 1 // means moving positive direction
  } else {
  return -1 // moving negative direction
  }
}

function distanceToWall (x_or_y, vx_or_vy, max_x_or_y) {
  switch (getMovingDirection(vx_or_vy)) {
    case 1: // hit right or bottom wall
      return (max_x_or_y - x_or_y)
    case -1: // hit left or top wall
//      console.log("2")
      return x_or_y
    default:
//      console.log("3")
      return INFINITY
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
INFINITY === distanceToWall(b3)

distance
*/

function timeToHitWall(x_or_y, vx_or_vy, max_x_or_y) {
  distance = distanceToWall(x_or_y, vx_or_vy, max_x_or_y)
  // console.log("1 " + distance)
  if (distance === INFINITY) {
    return INFINITY
  }
  return (distance / Math.abs(vx_or_vy))
}

function timeToHitVerticalWall(ball) {
  return timeToHitWall(ball.x, ball.vX, WALL_MAX_X)
}

function timeToHitHorizontalWall(ball) {
  return timeToHitWall(ball.y, ball.vY, WALL_MAX_Y)
}

function calcDistSquareCoeff(l1, l2, lX1, lX2) {
	// use pythagoras
	locDiff = l1-l2
	velDiff = lX1-lX2
	return[Math.pow(locDiff, 2), //constant
				2*locDiff*velDiff, 		// t^1
				Math.pow(velDiff, 2)]	//t^2
}

function timeToCollide(ball1,ball2) {
	coeffX = calcDistSquareCoeff(ball1.x, ball2.x, ball1.vX, ball2.vX)
	coeffY = calcDistSquareCoeff(ball1.y, ball2.y, ball1.vY, ball2.vY)

	//quadratics
	c = coeffX[0] + coeffY[0] - Math.pow((ball1.radius + ball2.radius), 2)
	b = coeffX[1] + coeffY[1]
	a = coeffX[2] + coeffY[2]

	console.log("****" + a + ':' + b + ':' + c)
	sqrtPart = Math.sqrt(Math.pow(b, 2) - 4*a*c)
// you need to add brackets between 2a for some reason
	t1 = (-b + sqrtPart)/(2*a)
	t2 = (-b - sqrtPart)/(2*a)

	if (t1 > 0 && t2 > 0) {
		return Math.min(t1, t2)
	} else if (t1*t2 === 0) {
		return 0
	} else if (t1*t2 < 0) {
		return Math.max(t1, t2)
	} else {
		return INFINITY
	}
}

//
 b1 = makeBall(0,0,1,1,1,5) // hit right wall
 b2 = makeBall(4,4,1,-1,-1,5) // hit left wall
 b3 = makeBall(4,0,1,-1,1,5)
 b4 = makeBall(0,4,1,1,-1,5)
 b5 = makeBall(2,4,1,0,-1,5)
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

			drawBall();
			ball.xValue += ball.dx;
			ball.yValue += ball.dy;

			if (ball.y + ball.radius > canvas.height) {
				ball.dy = ball.dy * -1;
			}
			if (ball.y + ball.radius< 0) {
				ball.dy = ball.dy * -1;
			}
			if (ball.x + ball.radius > canvas.width) {
				ball.dx = ball.dx * -1;
			}
			if (ball.x + ball.radius < 0) {
				ball.dx = ball.dx * -1;
			}
			/*
				The check above stops the ball moving off the bottom of the screen.
			*/
		}

	//	var interval = setInterval(draw, 0);

		function reset() {
			ctx.clearRect(0,0, canvas.width, canvas.height);
}
