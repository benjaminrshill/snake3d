let container = document.querySelector('.container');
let scoreDisplay = document.querySelector('.scoreDisplay');
let width = 9;
let appleIndex = 0;
let snake = [2,1,0];
let direction = 1;
let layer = 0;
let score = 0;
let speed = 0.9;
let intervalTime = 1000;
let interval = 0;

document.addEventListener('keydown', control);
createBoard();
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
    let cubes = document.querySelectorAll('.cube');
    randomApple(cubes);
    snake.forEach(index => {
        cubes[index].childNodes.forEach(face => face.classList.add('snake'));
    });
    interval = setInterval(moveSnake, intervalTime);
}

function moveSnake() {
    if ((new Set(snake)).size !== snake.length || layer > 1 || layer < 0) {
        container.classList.add('gameOver');
        return clearInterval(interval);
    }
    let cubes = document.querySelectorAll('.cube');
    let tail = snake.pop();
    cubes[tail].childNodes.forEach(face => face.classList.remove('snake'));
    catchSides();
    cubes[snake[0]].childNodes.forEach(face => face.classList.add('snake'));

    eatApple(cubes, tail);
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
    } else {
        snake.unshift(snake[0] + direction);
    }
}

function eatApple(cubes, tail) {
    if (cubes[snake[0]].children.length > 6) {
        let apple = document.querySelector('.apple');
        cubes[appleIndex].removeChild(apple);
        cubes[tail].childNodes.forEach(face => face.classList.remove('snake'));
        snake.push(tail);
        randomApple(cubes);
        score++;
        scoreDisplay.textContent = score;
        clearInterval(interval);
        intervalTime = intervalTime * speed;
        interval = setInterval(moveSnake, intervalTime);
    }
}

function randomApple(cubes) {
    appleIndex = Math.floor(Math.random() * cubes.length);
    if (!snake.includes(appleIndex)) {
        let apple = document.createElement('div');
        apple.classList.add('apple');
        cubes[appleIndex].appendChild(apple);
    } else randomApple(cubes);
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
            layer++;
            break;
        case "z":
            direction = -100;
            layer--;
            break;
    }
}
