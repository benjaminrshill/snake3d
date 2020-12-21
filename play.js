let container = document.querySelector('.container');
let scoreDisplay = document.querySelector('.scoreDisplay');
let width = 9;
let snake = [2, 1, 0];
let direction = 1;
let speed = 0.9;
let appleIndex = 0;
let score = 0;
let intervalTime = 1000;
let interval = 0;
let cubes;
document.addEventListener('keydown', control);
createBoard();
randomApple();
makeSnake();
makeInterval();

function createBoard() {
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
    container.classList.remove('gameOver');
    snake = [2, 1, 0];
    direction = 1;
    score = 0;
    scoreDisplay.textContent = score;
    killApple();
    randomApple();
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
    snake.forEach(index => {
        cubes[index].childNodes.forEach(face => face.classList.add('snake'));
    });
}

function snakeTail(tail) {
    cubes[tail].childNodes.forEach(face => face.classList.remove('snake'));
}

function snakeHead() {
    cubes[snake[0]].childNodes.forEach(face => face.classList.add('snake'));
}

function killSnake() {
    snake.forEach(index => {
        cubes[index].childNodes.forEach(face => face.classList.remove('snake'));
    });
}

function makeInterval() {
    interval = setInterval(moveSnake, intervalTime);
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
    } else if (direction === -10 && (snake[0] <= 9 || (snake[0] <= 109 && snake[0] > 99))) {
        snake.unshift(snake[0] + 90);
    } else if (direction === 10 && ((snake[0] >= 90 && snake[0] < 100) || (snake[0] > 189))) {
        snake.unshift(snake[0] - 90);
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
        randomApple();
        score++;
        scoreDisplay.textContent = score;
        clearInterval(interval);
        intervalTime = intervalTime * speed;
        makeInterval();
    }
}

function randomApple() {
    appleIndex = Math.floor(Math.random() * cubes.length);
    if (!snake.includes(appleIndex)) {
        let apple = document.createElement('div');
        cubes[appleIndex].appendChild(apple);
        apple.classList.add('apple');
    } else randomApple();
}

function control(e) {
    switch (e.key) {
        case "ArrowLeft":
            direction = -1;
            break;
        case "ArrowRight":
            direction = 1;
            break;
        case "ArrowUp":
            direction = 0 - (width + 1);
            break;
        case "ArrowDown":
            direction = width + 1;
            break;
        case "a":
            direction = 100;
            break;
        case "z":
            direction = -100;
            break;
    }
}
