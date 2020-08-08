
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
function findGradientIntercept(ball) {
	gradient = ball.vY/ball.vX // y = ax + b (a is known)
	intercept = ball.y - gradient * ball.x
  return [gradient, intercept]
}

function findCommonPoint(gradient1, intercept1, gradient2, intercept2) {
	// 0 = (g1 - g2) x + (i1 -i2)
	// (g1 -g2) x = -(i1 - i2)
	// x = -(i1 - i2) / (g1 - g2)
	x = -(intercept1 - intercept2) / (gradient1 - gradient2)
	console.log((intercept1 - intercept2),  (gradient1 - gradient2))
	y = gradient1 * x + intercept1 // y = ax + b
	return [x, y]
}

console.log(findCommonPoint(1, 2, 1/2, 4))
//
// gradient1 = ball1.vy/ball1.vx // y = ax + b (a is known)
// ball1.y = gradient1 * ball1.x + b
// intercept1 = ball1.y - gradient1 * ball1.x
//
// gradient2 = ball2.vy/ball2.vx // y = ax + b (a is known)
// ball2.y = gradient2 * ball2.x + b
// intercept2 = ball2.y - gradient2 * ball2.x



function distancebetweenBalls (ball1, ball2) {
		x: posX, y: posY, radius: radius, vX: velocityX, vY: velocityY, m: mass
  		distanceDots = Math.sqrt(Math.pow((ball1.x + ball1.y + (ball1.vX + ball1.vY)*t), 2) + Math.sprt(Math.pow((ball2.x + ball2.y + (ball2.vX + ball2.vY)*t), 2)
  		distanceBalls = distanceDots - (ball1.r + ball2.r)
  	}


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

function timeToCollide(ball1,ball2) {
	// return the time, which will happen in near future.
	// If there are more than two future times, return near future time only
	// If there is no future time (meaning all happened already in the past)
	// return INFINITY

  // (a + b)^2
	a = ball1.x - ball2.x
	b = ball1.vX - ball2.vX
	// (c + d)^2
	c = ball1.y - ball2.y
	d = ball1.vY - ball2.vY

	constant = Math.pow(a, 2) + Math.pow(c, 2)
	coef1 = 2*a*b + 2*c*d // the t's coefficient
	coef2 = Math.pow(b ,2) + Math.pow(d, 2) // t squared coefficient

  commmonTerm = Math.sqrt(Math.pow(coef1, 2) - 4 * coef2 * constant)
	time1 = (- coef1 + commmonTerm) / (2 * coef2)
	time2 = (- coef1 - commmonTerm) / (2 * coef2)
//	time1 = (-coef1 + Math.sqrt(Math.pow(coef1, 2) - 4*coef2*constant))/2*coef2
//	time2 = (-coef1 - Math.sqrt(Math.pow(coef1, 2) - 4*coef2*constant))/2*coef2

	if (time1 > 0 && time2 > 0) {
		return min(time1, time2)
	} else if (time1 > 0 && time2 < 0) {
			return time1
	} else if (time1 < 0 && time2 > 0) {
			return time2
	} else if (time1 == 0 || time2 == 0) {
			return 0
	} else {
			return INFINITY
	}

//	currentDistance = distanceBetweenBalls(ball1, ball2)
// make x and y values separate
// 		x: posX, y: posY, radius: radius, vX: velocityX, vY: velocityY, m: mass
// nextX(t) = (ball1.x + ball1.vX*t)
// nextX2(t) = (ball2.x + ball2.vX*t)
// nextY(t) = (ball1.y + ball1.vY*t)
// nextY2(t) = (ball2.y + ball2.vY*t)
// newDistance(t) = Math.sqrt((nextX(t)-nextX2(t))^2) + ((nextY(t)-nextY2(t))^2)
//console.log(">>>" + ball1.vX  + ":" + ball2.vX + ":" + ball1.vY + ":" + ball2.vY)
	return (-ball1.x + ball2.x - ball1.y + ball2.y -2*ball1.radius + 2*ball2.radius)/((ball1.vX - ball2.vX) + ball1.vY - ball2.vY)
}
//
 b1 = makeBall(1,2, 6,3,4,5) // hit right wall
 b2 = makeBall(8,2, 6, -3,4,5) // hit left wall
//
 console.log("time:" + timeToCollide(b1,b2))



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
