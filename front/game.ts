/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gmontoro <gmontoro@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 18:17:35 by gmontoro          #+#    #+#             */
/*   Updated: 2025/11/17 18:26:43 by gmontoro         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Create square
const square = {
	x: 10,
	y: 10,
	width: 30,
	height: 30,
	speedX: 3,
	speedY: 3
};

// Variables for canvas and context
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;




// Create paddles
const paddleLeft = {
	x: 1,
	y: 50,
	width: 10,
	height: 70,
	speed: 10
};

const paddleRight = {
	x: 800 - 10,
	y: 50,
	width: 10,
	height: 70,
	speed: 10
};

let scoreRight = 0;
let scoreLeft = 0;

const keysPressed: { [key: string]: boolean } = {};

// To draw the current state
function draw() {
	// Repaint everything black
	context.fillStyle = 'black';
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = 'white';
	context.font = '50px Arial';
	context.textAlign = 'center';

	// Left score
	context.fillText(scoreLeft.toString(), canvas.width / 4, 100);

	// Right score
	context.fillText(scoreRight.toString(), (canvas.width / 4) * 3, 100);

	// Middle line
	context.fillRect((canvas.width / 2) - 2, 0, 4, canvas.height);

	// Ball
	context.fillStyle = 'white';
	context.fillRect(square.x, square.y, square.width, square.height);

	// Left paddle
	context.fillStyle = 'red';
	context.fillRect(paddleLeft.x, paddleLeft.y, paddleLeft.width, paddleLeft.height);

	// Right paddle
	context.fillStyle = 'blue';
	context.fillRect(paddleRight.x, paddleRight.y, paddleRight.width, paddleRight.height);
}


// This function calculates the NEW position
function update() {
	// Move the square
	square.x += square.speedX;
	square.y += square.speedY;

	// Paddle movement: w/s for left, arrowup/down for right
	if (keysPressed['w']) {
		paddleLeft.y -= paddleLeft.speed;
	}

	if (keysPressed['s']) {
		paddleLeft.y += paddleLeft.speed;
	}

	if (keysPressed['ArrowUp']) {
		paddleRight.y -= paddleRight.speed;
	}

	if (keysPressed['ArrowDown']) {
		paddleRight.y += paddleRight.speed;
	}

	// Handle what happens when the paddle hits a border
	if (paddleLeft.y < 0) {
		paddleLeft.y = 0;
	}
	if (paddleLeft.y + paddleLeft.height > canvas.height) {
		paddleLeft.y = canvas.height - paddleLeft.height;
	}

	if (paddleRight.y < 0) {
		paddleRight.y = 0;
	}
	if (paddleRight.y + paddleRight.height > canvas.height) {
		paddleRight.y = canvas.height - paddleRight.height;
	}

	// COLLISIONS WITH PADDLES AND TOP/BOTTOM BORDERS
	// Right paddle
	if (square.x + square.width >= paddleRight.x) {
		if ((square.y > paddleRight.y && square.y + square.height < paddleRight.y + paddleRight.height) ||
			(square.y < paddleRight.y && square.y + square.height > paddleRight.y) ||
			(square.y > paddleRight.y && square.y < paddleRight.y + paddleRight.height)) {
			square.speedX = -square.speedX - 0.5;
			square.x = paddleRight.x - square.width; // To avoid sticky paddles
		}
		else {
			square.x = canvas.width / 2;
			square.y = canvas.height / 2;
			square.speedX = -3;
			square.speedY = -3;
			scoreLeft++;
		}
	}

	// Left paddle
	if (square.x < paddleLeft.x + paddleLeft.width) {
		if ((square.y > paddleLeft.y && square.y + square.height < paddleLeft.y + paddleLeft.height) ||
			(square.y < paddleLeft.y && square.y + square.height > paddleLeft.y) ||
			(square.y > paddleLeft.y && square.y < paddleLeft.y + paddleLeft.height)) {
			square.speedX = -square.speedX + 0.5;
			square.x = paddleLeft.x + paddleLeft.width; // To avoid sticky paddles
		}
		else {
			square.x = canvas.width / 2;
			square.y = canvas.height / 2;
			square.speedX = 3;
			square.speedY = 3;
			scoreRight++;
		}
	}

	// Bottom border
	if (square.y + square.height > canvas.height) {
		square.speedY = -square.speedY;
	}

	// Top border
	if (square.y < 0) {
		square.speedY = -square.speedY;
	}
}

function gameLoop() {

	update();
	draw();
	requestAnimationFrame(gameLoop); // Call gameloop recursively every frame. This is the loop
}


export function loadGame() {

	const app = document.getElementById('app')!;

	// Create the canvas
	app.innerHTML = `
        <style>
            #gameCanvas {
                background-color: #000;
                border: 1px solid #fff;
            }
        </style>
        <canvas id="gameCanvas" width="800" height="600"></canvas>
    `;

	// Assign global variables
	canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
	context = canvas.getContext('2d')!;

	if (!context) {
		console.error("No se pudo obtener el contexto 2D");
		return;
	}

	console.log("¡El juego ha cargado! Iniciando game loop...");

	// Event listeners to capture key presses
	document.addEventListener('keydown', (event) => {
		keysPressed[event.key] = true;
	});

	document.addEventListener('keyup', (event) => {
		keysPressed[event.key] = false;
	});

	gameLoop();
}