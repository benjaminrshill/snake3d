let container = document.querySelector('.container');
let scoreDisplay = document.querySelector('.scoreDisplay');
let appleIndex = 0;
let width = 9;
let snake = [2, 1, 0];
let direction = 1;
let score = 0;
let speed = 0.9;
let intervalTime = 1000;
let interval = 0;
document.addEventListener('keydown', control);
createBoard();
let cubes = document.querySelectorAll('.cube');
startGame();

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
}

function startGame() {
    randomApple();
    snake.forEach(index => {
        cubes[index].childNodes.forEach(face => face.classList.add('snake'));
    });
    interval = setInterval(moveSnake, intervalTime);
}

function restart() {
    clearInterval(interval);
    container.classList.remove('gameOver');
    let apple = document.querySelector('.apple');
    cubes[appleIndex].removeChild(apple);
    randomApple();
    snake.forEach(index => {
        cubes[index].childNodes.forEach(face => face.classList.remove('snake'));
    });
    snake = [2, 1, 0];
    direction = 1;
    intervalTime = 1000;
    snake.forEach(index => {
        cubes[index].childNodes.forEach(face => face.classList.add('snake'));
    });
    interval = setInterval(moveSnake, intervalTime);
}

function moveSnake() {
    if ((new Set(snake)).size !== snake.length) {
        container.classList.add('gameOver');
        return clearInterval(interval);
    }
    let tail = snake.pop();
    cubes[tail].childNodes.forEach(face => face.classList.remove('snake'));
    catchSides();
    cubes[snake[0]].childNodes.forEach(face => face.classList.add('snake'));
    eatApple(tail);
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
        let apple = document.querySelector('.apple');
        snake.push(tail);
        cubes[appleIndex].removeChild(apple);
        randomApple();
        score++;
        scoreDisplay.textContent = score;
        clearInterval(interval);
        intervalTime = intervalTime * speed;
        interval = setInterval(moveSnake, intervalTime);
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
