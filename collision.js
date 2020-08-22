// Copy from https://github.com/mourner/tinyqueue

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PriorityQueue = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var AbstractPriorityQueue, ArrayStrategy, BHeapStrategy, BinaryHeapStrategy, PriorityQueue,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AbstractPriorityQueue = _dereq_('./PriorityQueue/AbstractPriorityQueue');

ArrayStrategy = _dereq_('./PriorityQueue/ArrayStrategy');

BinaryHeapStrategy = _dereq_('./PriorityQueue/BinaryHeapStrategy');

BHeapStrategy = _dereq_('./PriorityQueue/BHeapStrategy');

PriorityQueue = (function(superClass) {
  extend(PriorityQueue, superClass);

  function PriorityQueue(options) {
    options || (options = {});
    options.strategy || (options.strategy = BinaryHeapStrategy);
    options.comparator || (options.comparator = function(a, b) {
      return (a || 0) - (b || 0);
    });
    PriorityQueue.__super__.constructor.call(this, options);
  }

  return PriorityQueue;

})(AbstractPriorityQueue);

PriorityQueue.ArrayStrategy = ArrayStrategy;

PriorityQueue.BinaryHeapStrategy = BinaryHeapStrategy;

PriorityQueue.BHeapStrategy = BHeapStrategy;

module.exports = PriorityQueue;


},{"./PriorityQueue/AbstractPriorityQueue":2,"./PriorityQueue/ArrayStrategy":3,"./PriorityQueue/BHeapStrategy":4,"./PriorityQueue/BinaryHeapStrategy":5}],2:[function(_dereq_,module,exports){
var AbstractPriorityQueue;

module.exports = AbstractPriorityQueue = (function() {
  function AbstractPriorityQueue(options) {
    var ref;
    if ((options != null ? options.strategy : void 0) == null) {
      throw 'Must pass options.strategy, a strategy';
    }
    if ((options != null ? options.comparator : void 0) == null) {
      throw 'Must pass options.comparator, a comparator';
    }
    this.priv = new options.strategy(options);
    this.length = (options != null ? (ref = options.initialValues) != null ? ref.length : void 0 : void 0) || 0;
  }

  AbstractPriorityQueue.prototype.queue = function(value) {
    this.length++;
    this.priv.queue(value);
    return void 0;
  };

  AbstractPriorityQueue.prototype.dequeue = function(value) {
    if (!this.length) {
      throw 'Empty queue';
    }
    this.length--;
    return this.priv.dequeue();
  };

  AbstractPriorityQueue.prototype.peek = function(value) {
    if (!this.length) {
      throw 'Empty queue';
    }
    return this.priv.peek();
  };

  AbstractPriorityQueue.prototype.clear = function() {
    this.length = 0;
    return this.priv.clear();
  };

  return AbstractPriorityQueue;

})();


},{}],3:[function(_dereq_,module,exports){
var ArrayStrategy, binarySearchForIndexReversed;

binarySearchForIndexReversed = function(array, value, comparator) {
  var high, low, mid;
  low = 0;
  high = array.length;
  while (low < high) {
    mid = (low + high) >>> 1;
    if (comparator(array[mid], value) >= 0) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
};

module.exports = ArrayStrategy = (function() {
  function ArrayStrategy(options) {
    var ref;
    this.options = options;
    this.comparator = this.options.comparator;
    this.data = ((ref = this.options.initialValues) != null ? ref.slice(0) : void 0) || [];
    this.data.sort(this.comparator).reverse();
  }

  ArrayStrategy.prototype.queue = function(value) {
    var pos;
    pos = binarySearchForIndexReversed(this.data, value, this.comparator);
    this.data.splice(pos, 0, value);
    return void 0;
  };

  ArrayStrategy.prototype.dequeue = function() {
    return this.data.pop();
  };

  ArrayStrategy.prototype.peek = function() {
    return this.data[this.data.length - 1];
  };

  ArrayStrategy.prototype.clear = function() {
    this.data.length = 0;
    return void 0;
  };

  return ArrayStrategy;

})();


},{}],4:[function(_dereq_,module,exports){
var BHeapStrategy;

module.exports = BHeapStrategy = (function() {
  function BHeapStrategy(options) {
    var arr, i, j, k, len, ref, ref1, shift, value;
    this.comparator = (options != null ? options.comparator : void 0) || function(a, b) {
      return a - b;
    };
    this.pageSize = (options != null ? options.pageSize : void 0) || 512;
    this.length = 0;
    shift = 0;
    while ((1 << shift) < this.pageSize) {
      shift += 1;
    }
    if (1 << shift !== this.pageSize) {
      throw 'pageSize must be a power of two';
    }
    this._shift = shift;
    this._emptyMemoryPageTemplate = arr = [];
    for (i = j = 0, ref = this.pageSize; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      arr.push(null);
    }
    this._memory = [];
    this._mask = this.pageSize - 1;
    if (options.initialValues) {
      ref1 = options.initialValues;
      for (k = 0, len = ref1.length; k < len; k++) {
        value = ref1[k];
        this.queue(value);
      }
    }
  }

  BHeapStrategy.prototype.queue = function(value) {
    this.length += 1;
    this._write(this.length, value);
    this._bubbleUp(this.length, value);
    return void 0;
  };

  BHeapStrategy.prototype.dequeue = function() {
    var ret, val;
    ret = this._read(1);
    val = this._read(this.length);
    this.length -= 1;
    if (this.length > 0) {
      this._write(1, val);
      this._bubbleDown(1, val);
    }
    return ret;
  };

  BHeapStrategy.prototype.peek = function() {
    return this._read(1);
  };

  BHeapStrategy.prototype.clear = function() {
    this.length = 0;
    this._memory.length = 0;
    return void 0;
  };

  BHeapStrategy.prototype._write = function(index, value) {
    var page;
    page = index >> this._shift;
    while (page >= this._memory.length) {
      this._memory.push(this._emptyMemoryPageTemplate.slice(0));
    }
    return this._memory[page][index & this._mask] = value;
  };

  BHeapStrategy.prototype._read = function(index) {
    return this._memory[index >> this._shift][index & this._mask];
  };

  BHeapStrategy.prototype._bubbleUp = function(index, value) {
    var compare, indexInPage, parentIndex, parentValue;
    compare = this.comparator;
    while (index > 1) {
      indexInPage = index & this._mask;
      if (index < this.pageSize || indexInPage > 3) {
        parentIndex = (index & ~this._mask) | (indexInPage >> 1);
      } else if (indexInPage < 2) {
        parentIndex = (index - this.pageSize) >> this._shift;
        parentIndex += parentIndex & ~(this._mask >> 1);
        parentIndex |= this.pageSize >> 1;
      } else {
        parentIndex = index - 2;
      }
      parentValue = this._read(parentIndex);
      if (compare(parentValue, value) < 0) {
        break;
      }
      this._write(parentIndex, value);
      this._write(index, parentValue);
      index = parentIndex;
    }
    return void 0;
  };

  BHeapStrategy.prototype._bubbleDown = function(index, value) {
    var childIndex1, childIndex2, childValue1, childValue2, compare;
    compare = this.comparator;
    while (index < this.length) {
      if (index > this._mask && !(index & (this._mask - 1))) {
        childIndex1 = childIndex2 = index + 2;
      } else if (index & (this.pageSize >> 1)) {
        childIndex1 = (index & ~this._mask) >> 1;
        childIndex1 |= index & (this._mask >> 1);
        childIndex1 = (childIndex1 + 1) << this._shift;
        childIndex2 = childIndex1 + 1;
      } else {
        childIndex1 = index + (index & this._mask);
        childIndex2 = childIndex1 + 1;
      }
      if (childIndex1 !== childIndex2 && childIndex2 <= this.length) {
        childValue1 = this._read(childIndex1);
        childValue2 = this._read(childIndex2);
        if (compare(childValue1, value) < 0 && compare(childValue1, childValue2) <= 0) {
          this._write(childIndex1, value);
          this._write(index, childValue1);
          index = childIndex1;
        } else if (compare(childValue2, value) < 0) {
          this._write(childIndex2, value);
          this._write(index, childValue2);
          index = childIndex2;
        } else {
          break;
        }
      } else if (childIndex1 <= this.length) {
        childValue1 = this._read(childIndex1);
        if (compare(childValue1, value) < 0) {
          this._write(childIndex1, value);
          this._write(index, childValue1);
          index = childIndex1;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return void 0;
  };

  return BHeapStrategy;

})();


},{}],5:[function(_dereq_,module,exports){
var BinaryHeapStrategy;

module.exports = BinaryHeapStrategy = (function() {
  function BinaryHeapStrategy(options) {
    var ref;
    this.comparator = (options != null ? options.comparator : void 0) || function(a, b) {
      return a - b;
    };
    this.length = 0;
    this.data = ((ref = options.initialValues) != null ? ref.slice(0) : void 0) || [];
    this._heapify();
  }

  BinaryHeapStrategy.prototype._heapify = function() {
    var i, j, ref;
    if (this.data.length > 0) {
      for (i = j = 1, ref = this.data.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
        this._bubbleUp(i);
      }
    }
    return void 0;
  };

  BinaryHeapStrategy.prototype.queue = function(value) {
    this.data.push(value);
    this._bubbleUp(this.data.length - 1);
    return void 0;
  };

  BinaryHeapStrategy.prototype.dequeue = function() {
    var last, ret;
    ret = this.data[0];
    last = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = last;
      this._bubbleDown(0);
    }
    return ret;
  };

  BinaryHeapStrategy.prototype.peek = function() {
    return this.data[0];
  };

  BinaryHeapStrategy.prototype.clear = function() {
    this.length = 0;
    this.data.length = 0;
    return void 0;
  };

  BinaryHeapStrategy.prototype._bubbleUp = function(pos) {
    var parent, x;
    while (pos > 0) {
      parent = (pos - 1) >>> 1;
      if (this.comparator(this.data[pos], this.data[parent]) < 0) {
        x = this.data[parent];
        this.data[parent] = this.data[pos];
        this.data[pos] = x;
        pos = parent;
      } else {
        break;
      }
    }
    return void 0;
  };

  BinaryHeapStrategy.prototype._bubbleDown = function(pos) {
    var last, left, minIndex, right, x;
    last = this.data.length - 1;
    while (true) {
      left = (pos << 1) + 1;
      right = left + 1;
      minIndex = pos;
      if (left <= last && this.comparator(this.data[left], this.data[minIndex]) < 0) {
        minIndex = left;
      }
      if (right <= last && this.comparator(this.data[right], this.data[minIndex]) < 0) {
        minIndex = right;
      }
      if (minIndex !== pos) {
        x = this.data[minIndex];
        this.data[minIndex] = this.data[pos];
        this.data[pos] = x;
        pos = minIndex;
      } else {
        break;
      }
    }
    return void 0;
  };

  return BinaryHeapStrategy;

})();


},{}]},{},[1])(1)
});

// -------------
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
      return Number.MAX_VALUE;
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
Number.MAX_VALUE === distanceToWall(b3)

distance
*/

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
  discriminant = Math.pow(b, 2) - 4 * a * c
  if (discriminant < 0) {
    //imaginary "roots"
    return  Number.MAX_VALUE;
  }
	sqrtPart = Math.sqrt(discriminant);
// you need to add brackets between 2a for some reason
	t1 = (-b + sqrtPart) / (2 * a);
	t2 = (-b - sqrtPart) / (2 * a);

	if (t1 > 0 && t2 > 0) {
		return Math.min(t1, t2);
	} else if (t1 * t2 === 0) {
		return 0;
	} else if (t1 * t2 < 0) {
		return Math.max(t1, t2);
	} else {
		return Number.MAX_VALUE;
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



function moveBall(ball, time) {
    ball.x = ball.x + time * ball.vX;			// next x ball coordinate =
  	ball.y = ball.y + time * ball.vY;
}

function moveBalls(balls) {
  [events, nextEarliestTime] = earlyCollisionEvents(balls)
  eventTime = events[0].time

  if (eventTime === 0) {
    changeForcesOfCollidingBalls(events);
  }
	for (var ball of balls) {
		moveBall(ball, (eventTime === 0) ? Math.min(nextEarliestTime, 1)
    : Math.min(eventTime, 1));
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

//pairCollision = timeToCollide(ball1, ball2)

function changeForcesOfCollidingBalls(events) {
  for (const event of events) {
    updateVelocityAfterCollision(event.ball1, event.ball2);
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

function makeCollisionEvent(ball1, ball2) {
	return {time: timeToCollide(ball1, ball2), ball1: ball1, ball2: ball2}
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
  } while (earlyTime === queue.peek().time)

	return [earliestEvents, queue.peek().time]
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
		await sleep(oneTick); //
		durationMs = durationMs - oneTick;
	}

	// this loop was going too fast so sleep function was needed
}
//	var interval = setInterval(draw, 0);



function reset() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
