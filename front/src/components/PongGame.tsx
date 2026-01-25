import React, { useEffect, useRef, useState } from 'react';

// Tipos para las props del componente
interface PongGameProps {
	mode: 'pvp' | 'ai';
	scoreToWin: number;
	onExit: () => void; // Callback para salir limpiamente sin recargar la página
}

// Interfaces para el estado del juego (interno)
interface GameState {
	ball: { x: number; y: number; width: number; height: number };
	paddleLeft: { x: number; y: number; width: number; height: number; score: number };
	paddleRight: { x: number; y: number; width: number; height: number; score: number };
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const PongGame: React.FC<PongGameProps> = ({ mode, scoreToWin, onExit }) => {
	// REFS: Usamos refs para datos que cambian muy rápido y no requieren re-render de React
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const socketRef = useRef<WebSocket | null>(null);
	const reqIdRef = useRef<number>(0);

	// Posiciones actuales (Lo que se dibuja)
	const currentPos = useRef({
		ball: { x: 400, y: 300 },
		paddleLeft: { y: 265 },
		paddleRight: { y: 265 },
		scoreLeft: 0,
		scoreRight: 0
	});

	// Objetivo del servidor (Hacia donde vamos)
	const serverTarget = useRef({
		ball: { x: 400, y: 300 },
		paddleLeft: { y: 265 },
		paddleRight: { y: 265 }
	});

	// ESTADO REACT: Solo para UI lenta (Menús, Ganador, Cuenta atrás)
	const [uiState, setUiState] = useState<'loading' | 'countdown' | 'playing' | 'ended'>('loading');
	const [countdown, setCountdown] = useState(3);
	const [winnerText, setWinnerText] = useState('');

	// Función Lerp (Interpolación Lineal)
	const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

	// Lógica principal al montar el componente
	useEffect(() => {
		// 1. Conexión WebSocket
		console.log(`Connecting: Mode=${mode}, Score=${scoreToWin}`);
		const socket = new WebSocket(`ws://localhost:3000/api/game/?mode=${mode}&score=${scoreToWin}`);
		socketRef.current = socket;

		// 2. Manejo de mensajes del servidor
		socket.onopen = () => {
			console.log("WS Connected");
			startCountdownSequence();
		};

		socket.onmessage = (event) => {
			try {
				const msg = JSON.parse(event.data);
				if (msg.type === 'UPDATE') {
					const s = msg.state;
					const PREDICTION = 0.05;

					// Lógica de predicción
					if (Math.abs(s.ball.speedX) > 0) {
						serverTarget.current.ball.x = s.ball.x + (s.ball.speedX * PREDICTION);
						serverTarget.current.ball.y = s.ball.y + (s.ball.speedY * PREDICTION);
					} else {
						serverTarget.current.ball.x = s.ball.x;
						serverTarget.current.ball.y = s.ball.y;
					}

					serverTarget.current.paddleLeft.y = s.paddleLeft.y;
					serverTarget.current.paddleRight.y = s.paddleRight.y;

					// Actualizamos scores en la ref para el dibujo
					currentPos.current.scoreLeft = s.paddleLeft.score;
					currentPos.current.scoreRight = s.paddleRight.score;

					// Detectar fin de juego
					if (s.status === 'ended') {
						setUiState((prev) => {
							if (prev !== 'ended') {
								let text = s.winner === 'left' ? "P1 WINS" : "P2 WINS";
								if (mode === 'ai' && s.winner === 'right') text = "AI WINS 🤖";
								setWinnerText(text);
								return 'ended';
							}
							return prev;
						});
					}

					// Detectar reinicio
					if (s.status === 'playing' && uiState === 'ended') {
						startCountdownSequence();
					}
				}
			} catch (e) { }
		};

		// 3. Inputs de teclado
		const keysPressed: Record<string, boolean> = {};
		const sendInput = (action: string, key: string) => {
			if (socket.readyState === WebSocket.OPEN) {
				let msgKey = '';
				if (key === 'ArrowUp') msgKey = 'RIGHT_UP';
				else if (key === 'ArrowDown') msgKey = 'RIGHT_DOWN';
				else if (key === 'w' || key === 'W') msgKey = 'LEFT_UP';
				else if (key === 's' || key === 'S') msgKey = 'LEFT_DOWN';

				if (msgKey) socket.send(JSON.stringify({ type: 'INPUT', action, key: msgKey }));
			}
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (["ArrowUp", "ArrowDown", " "].includes(e.key)) e.preventDefault();
			if (keysPressed[e.key]) return;
			keysPressed[e.key] = true;
			sendInput('PRESS', e.key);
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			keysPressed[e.key] = false;
			sendInput('RELEASE', e.key);
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		// 4. Iniciar Bucle de Dibujado
		requestAnimationFrame(gameLoop);

		// 5. Cleanup al desmontar
		return () => {
			if (socketRef.current) socketRef.current.close();
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			cancelAnimationFrame(reqIdRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Se ejecuta solo una vez al montar

	// Funciones auxiliares
	const startCountdownSequence = () => {
		setUiState('countdown');
		let count = 3;
		setCountdown(3);

		const interval = setInterval(() => {
			count--;
			setCountdown(count);
			if (count <= 0) {
				clearInterval(interval);
				setTimeout(() => setUiState('playing'), 500); // Pequeño delay en el "GO!"
			}
		}, 1000);
	};

	const handleRestart = () => {
		if (socketRef.current?.readyState === WebSocket.OPEN) {
			socketRef.current.send(JSON.stringify({ type: 'RESTART' }));
			// El servidor responderá con status 'playing' y activará el countdown en el onmessage
		}
	};

	// Bucle de Juego (Render Loop)
	const gameLoop = () => {
		if (!canvasRef.current) return;
		const ctx = canvasRef.current.getContext('2d');
		if (!ctx) return;

		// Lógica de LERP (Suavizado)
		const LERP_FACTOR = 0.3;
		const target = serverTarget.current;
		const current = currentPos.current;

		const dx = target.ball.x - current.ball.x;
		const dy = target.ball.y - current.ball.y;

		// Teletransporte si la distancia es muy grande (ej: respawn tras gol)
		if (Math.sqrt(dx * dx + dy * dy) > 100) {
			current.ball.x = target.ball.x;
			current.ball.y = target.ball.y;
		} else {
			current.ball.x = lerp(current.ball.x, target.ball.x, LERP_FACTOR);
			current.ball.y = lerp(current.ball.y, target.ball.y, LERP_FACTOR);
		}

		current.paddleLeft.y = lerp(current.paddleLeft.y, target.paddleLeft.y, LERP_FACTOR);
		current.paddleRight.y = lerp(current.paddleRight.y, target.paddleRight.y, LERP_FACTOR);

		// DIBUJADO
		// Fondo
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// Marcadores (Dibujados en Canvas como en el original)
		ctx.fillStyle = 'white';
		ctx.font = '50px Arial';
		ctx.textAlign = 'center';
		ctx.fillText(current.scoreLeft.toString(), CANVAS_WIDTH / 4, 100);
		ctx.fillText(current.scoreRight.toString(), (CANVAS_WIDTH / 4) * 3, 100);

		// Red central
		ctx.fillRect((CANVAS_WIDTH / 2) - 2, 0, 4, CANVAS_HEIGHT);

		// Bola
		ctx.fillStyle = 'white';
		ctx.fillRect(current.ball.x, current.ball.y, 18, 18); // Usamos 18x18 como en tu original

		// Palas
		ctx.fillStyle = 'red';
		ctx.fillRect(10, current.paddleLeft.y, 10, 70); // Pala izquierda

		ctx.fillStyle = 'blue';
		ctx.fillRect(CANVAS_WIDTH - 20, current.paddleRight.y, 10, 70); // Pala derecha

		reqIdRef.current = requestAnimationFrame(gameLoop);
	};

	// ESTILOS EN LÍNEA (Podrías pasarlos a CSS Modules)
	const overlayStyle: React.CSSProperties = {
		position: 'absolute',
		top: 0, left: 0, width: '100%', height: '100%',
		backgroundColor: 'rgba(0,0,0,0.85)',
		display: 'flex', flexDirection: 'column',
		justifyContent: 'center', alignItems: 'center',
		color: 'white', zIndex: 10
	};

	const buttonStyle: React.CSSProperties = {
		padding: '10px 20px', fontSize: '1.2em', margin: '10px',
		cursor: 'pointer', fontWeight: 'bold'
	};

	return (
		<div style={{
			position: 'relative',
			width: CANVAS_WIDTH,
			height: CANVAS_HEIGHT,
			margin: '0 auto',
			border: '2px solid white',
			boxSizing: 'content-box'
		}}>
			<canvas
				ref={canvasRef}
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
				style={{ display: 'block', backgroundColor: 'black' }}
			/>

			{/* OVERLAY: CARGANDO */}
			{uiState === 'loading' && (
				<div style={overlayStyle}>
					<h1>CONNECTING...</h1>
				</div>
			)}

			{/* OVERLAY: CUENTA ATRÁS */}
			{uiState === 'countdown' && (
				<div style={{ ...overlayStyle, backgroundColor: 'transparent' }}>
					<h1 style={{ fontSize: '4em', color: countdown === 0 ? 'yellow' : 'white' }}>
						{countdown === 0 ? 'GO!' : countdown}
					</h1>
				</div>
			)}

			{/* OVERLAY: FIN DE JUEGO */}
			{uiState === 'ended' && (
				<div style={overlayStyle}>
					<h1 style={{ fontSize: '3em', marginBottom: '20px' }}>{winnerText}</h1>
					<button style={buttonStyle} onClick={handleRestart}>JUGAR OTRA VEZ</button>
					<button style={{ ...buttonStyle, backgroundColor: '#ff4444', color: 'white' }} onClick={onExit}>
						SALIR AL MENÚ
					</button>
				</div>
			)}
		</div>
	);
};

export default PongGame;