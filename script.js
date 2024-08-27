const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;

let paddle1Y = canvas.height / 2 - paddleHeight / 2;
let paddle2Y = canvas.height / 2 - paddleHeight / 2;

let paddle1DY = 0;
let paddle2DY = 0;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballDX = 4;
let ballDY = 4;

let player1Score = 0;
let player2Score = 0;

const paddleSpeed = 8;

function drawPaddle(x, y) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = '32px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(player1Score, canvas.width / 4, 50);
    ctx.fillText(player2Score, 3 * canvas.width / 4, 50);
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPaddle(0, paddle1Y); // Raquete esquerda
    drawPaddle(canvas.width - paddleWidth, paddle2Y); // Raquete direita

    drawBall();
    drawScore();

    paddle1Y += paddle1DY;
    paddle2Y += paddle2DY;

    if (paddle1Y < 0) paddle1Y = 0;
    if (paddle1Y + paddleHeight > canvas.height) paddle1Y = canvas.height - paddleHeight;
    if (paddle2Y < 0) paddle2Y = 0;
    if (paddle2Y + paddleHeight > canvas.height) paddle2Y = canvas.height - paddleHeight;

    ballX += ballDX;
    ballY += ballDY;

    // Verificar colisão com as paredes superior e inferior
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballDY = -ballDY;
    }

    // Verificar colisão com a raquete esquerda
    if (ballX - ballRadius < paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
        ballDX = -ballDX;
        // Ajustar o ângulo de reflexo da bola com base na posição de colisão
        let deltaY = ballY - (paddle1Y + paddleHeight / 2);
        ballDY = deltaY * 0.2;
    }

    // Verificar colisão com a raquete direita
    if (ballX + ballRadius > canvas.width - paddleWidth && ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
        ballDX = -ballDX;
        // Ajustar o ângulo de reflexo da bola com base na posição de colisão
        let deltaY = ballY - (paddle2Y + paddleHeight / 2);
        ballDY = deltaY * 0.2;
    }

    // Verificar se a bola saiu pela esquerda ou pela direita
    if (ballX - ballRadius < 0) {
        player2Score++;
        resetBall();
    } else if (ballX + ballRadius > canvas.width) {
        player1Score++;
        resetBall();
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballDX = -ballDX;
    ballDY = 4;
}

function keyDownHandler(event) {
    switch (event.key) {
        case 'ArrowUp':
            paddle2DY = -paddleSpeed;
            break;
        case 'ArrowDown':
            paddle2DY = paddleSpeed;
            break;
        case 'w':
        case 'W':
            paddle1DY = -paddleSpeed;
            break;
        case 's':
        case 'S':
            paddle1DY = paddleSpeed;
            break;
    }
}

function keyUpHandler(event) {
    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
            paddle2DY = 0;
            break;
        case 'w':
        case 'W':
        case 's':
        case 'S':
            paddle1DY = 0;
            break;
    }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

setInterval(updateGame, 1000 / 60); // 60 FPS
