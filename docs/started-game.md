## Integración del Módulo de Juego 

### 1. Lógica del Juego (Nuevo)

* **`front/game.ts` (Archivo Nuevo)**
    * Este archivo será el hogar de toda la lógica de Pong.
    * Contiene la función `loadGame()` que se encarga de "montar" el juego: borra el contenido de `#app` y pinta el `<canvas>`.
    * Se ha añadido un *game loop* básico usando `requestAnimationFrame` (funciones `gameLoop`, `draw`, `update`).
    * Actualmente pinta un cuadrado (`square`) que rebota en los bordes y dos palas (`paddleLeft`, `paddleRight`) estáticas.

### 2. Conexión con el Login (Modificado)

* **`front/login.ts` (Modificado)**
    * Se **importa** `loadGame` desde `game.ts`.
    * Se **llama** a `loadGame()` temporalmente cuando el formulario de login hace `submit`, para poder probar y desarrollar el juego.

Para probar, añadir en logi.ts: 

linea 1: //import { loadGame } from './game';

linea 61(debajo de console.log(login_email, login_password);): loadGame();