
		var canvas = document.getElementById("canvas");

console.log("see")
		const WALL_MAX_X = 600
		const WALL_MAX_Y = 600

		const INFINITY = Number.MAX_VALUE
		const TIME_UNIT = 1 // 1 second

		function makeBall (posX, posY, radius, velocityX, velocityY) {
			return { x: posX, y: posY, radius: radius, vX: velocityX, vY: velocityY }
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

	function distancetoBall (x_or_y, vx_or_vy, max_x_or_y) {
		switch (getM)
	}

/* test balls
b1 = makeBall(1,2,3,4,5) // hit right wall
b2 = makeBall(4,6, 7, -10, 10) // hit left wall
b3 = makeBall(34, 100, 122, 0,333) // hit no vertical wall
INFINITY === distanceToWall(b3)
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

		var interval = setInterval(draw, 0);

		function reset() {
			ctx.clearRect(0,0, canvas.width, canvas.height);
