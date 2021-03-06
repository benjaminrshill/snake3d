let container = document.querySelector('.container');
let az = document.querySelector('.az');
let up = document.querySelector('.up');
let down = document.querySelector('.down');
let left = document.querySelector('.left');
let right = document.querySelector('.right');
let scoreDisplay = document.querySelector('.scoreDisplay');
let width = 9;
let cubes;
let snake = [];
let direction = 1;
let speed = 0.9;
let appleIndex = 0;
let score = 0;
let intervalTime = 1000;
let interval = 0;
let paused = false;
let initialX = 0;
let initialY = 0;
let moveX = 0;
let moveY = 0;
let finalX = 0;
let finalY = 0;
document.addEventListener('keydown', keys);
makeBoard();
makeApple();
makeSnake();
makeInterval();

function makeBoard() {
    for (let i = 0; i < 2; i++) {
        let layer = document.createElement('div');
        layer.classList.add('layer');
        layer.classList.add('layer' + i);
        container.appendChild(layer);
        for (let i = 0; i < 100; i++) {
            let cube = document.createElement('div');
            cube.classList.add('cube');
            layer.appendChild(cube);
            for (let i = 0; i < 6; i++) {
                let face = document.createElement('div');
                face.classList.add('face');
                face.classList.add('face' + i);
                cube.appendChild(face);
            }
        }
    }
    cubes = document.querySelectorAll('.cube');
}

function restart() {
    paused = false;
    container.classList.remove('gameOver');
    direction = 1;
    score = 0;
    scoreDisplay.textContent = score;
    killApple();
    makeApple();
    killSnake();
    makeSnake();
    clearInterval(interval);
    intervalTime = 1000;
    makeInterval();
}

function moveSnake() {
    if ((new Set(snake)).size !== snake.length) {
        container.classList.add('gameOver');
        return clearInterval(interval);
    }
    let tail = snake.pop();
    snakeTail(tail);
    catchSides();
    snakeHead();
    eatApple(tail);
}

function makeSnake() {
    snake = [2, 1, 0];
    snake.forEach(index => {
        cubes[index].childNodes.forEach(face => face.classList.add('snake'));
    });
}

function killSnake() {
    snake.forEach(index => {
        cubes[index].childNodes.forEach(face => face.classList.remove('snake'));
    });
}

function snakeTail(tail) {
    cubes[tail].childNodes.forEach(face => face.classList.remove('snake'));
}

function snakeHead() {
    cubes[snake[0]].childNodes.forEach(face => face.classList.add('snake'));
}

function makeInterval() {
    interval = setInterval(moveSnake, intervalTime);
}

function pause() {
    paused ? makeInterval() : clearInterval(interval);
    paused = !paused;
}

function makeApple() {
    appleIndex = Math.floor(Math.random() * cubes.length);
    if (!snake.includes(appleIndex)) {
        let apple = document.createElement('div');
        cubes[appleIndex].appendChild(apple);
        apple.classList.add('apple');
    } else makeApple();
}

function killApple() {
    let apple = document.querySelector('.apple');
    cubes[appleIndex].removeChild(apple);
}

function catchSides() {
    if (direction === 1 && snake[0] % 10 === 9) {
        snake.unshift(snake[0] - 9);
    } else if (direction === -1 && snake[0] % 10 === 0) {
        snake.unshift(snake[0] + 9);
    } else if (direction === 10 && ((snake[0] >= 90 && snake[0] < 100) || (snake[0] > 189))) {
        snake.unshift(snake[0] - 90);
    } else if (direction === -10 && (snake[0] <= 9 || (snake[0] <= 109 && snake[0] > 99))) {
        snake.unshift(snake[0] + 90);
    } else if (direction === 100 && snake[0] > 99) {
        snake.unshift(snake[0] - 100);
    } else if (direction === -100 && snake[0] < 100) {
        snake.unshift(snake[0] + 100);
    } else {
        snake.unshift(snake[0] + direction);
    }
}

function eatApple(tail) {
    if (cubes[snake[0]].children.length > 6) {
        snake.push(tail);
        killApple();
        makeApple();
        score++;
        scoreDisplay.textContent = score;
        clearInterval(interval);
        intervalTime = intervalTime * speed;
        makeInterval();
    }
}

function goLeft() {
    direction = -1;
}

function goRight() {
    direction = 1;
}

function goUp() {
    direction = 0 - (width + 1);
}

function goDown() {
    direction = width + 1;
}

function goBack() {
    direction = 100;
}

function keys(e) {
    switch (e.key) {
        case "ArrowLeft":
            goLeft();
            break;
        case "ArrowRight":
            goRight();
            break;
        case "ArrowUp":
            goUp();
            break;
        case "ArrowDown":
            goDown();
            break;
        case "z":
            goBack();
            break;
        case "a":
            goBack();
            break;
        case "p":
            pause();
            break;
    }
}

function startTouch(e) {
    e.preventDefault();
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
}

function moveTouch(e) {
    if (initialX === 0 && initialY === 0) return;
    moveX = e.touches[0].clientX;
    moveY = e.touches[0].clientY;
    finalX = initialX - moveX;
    finalY = initialY - moveY;
}

function endTouch() {
    if (finalX > 100 && finalX > finalY) {
        goLeft();
    } else if ( finalX < -100 && finalX < finalY) {
        goRight();
    } else if (finalY > 100 && finalY > finalX) {
        goUp();
    } else if (finalY < -100 && finalY < finalX) {
        goDown();
    }
    initialX = 0;
    moveX = 0;
    finalX = 0;
}

document.addEventListener('touchstart', startTouch, false);
document.addEventListener('touchmove', moveTouch, false);
document.addEventListener('touchend', endTouch, false);
az.addEventListener('click', goBack, false);
up.addEventListener('click', goUp, false);
down.addEventListener('click', goDown, false);
left.addEventListener('click', goLeft, false);
right.addEventListener('click', goRight, false);