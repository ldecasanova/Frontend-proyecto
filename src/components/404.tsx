// src/components/NotFound/NotFound.tsx

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();
  const [showGame, setShowGame] = useState(false);

  const handleGoHome = () => {
    navigate('/dashboard'); // Cambia esta ruta según la página principal de tu aplicación
  };

  const handleStartGame = () => {
    setShowGame(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <FaExclamationTriangle size={80} color="#f59e0b" style={styles.icon} />
        </div>
        <h1 style={styles.title}>404</h1>
        <p style={styles.subtitle}>Página no encontrada</p>
        <div style={styles.buttonGroup}>
          <button onClick={handleGoHome} style={styles.button}>
            Volver al Inicio
          </button>
          {!showGame && (
            <button onClick={handleStartGame} style={styles.button}>
              Iniciar Juego
            </button>
          )}
        </div>
      </div>
      {showGame && (
        <div style={styles.gameContainer}>
          <SnakeGame />
        </div>
      )}
    </div>
  );
};

/**
 * Componente del Juego Snake
 */
const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [snake, setSnake] = useState<[number, number][]>([[10, 10]]);
  const [direction, setDirection] = useState<[number, number]>([0, -1]); // [dx, dy]
  const [food, setFood] = useState<[number, number]>([15, 15]);
  const [score, setScore] = useState(0);

  // Tamaño del canvas
  const canvasSize = 400;
  const cellSize = 20;
  const initialSpeed = 200; // milisegundos
  const [speed, setSpeed] = useState(initialSpeed);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Manejar el cambio de dirección con las teclas de flecha
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction[1] !== 1) setDirection([0, -1]);
          break;
        case 'ArrowDown':
          if (direction[1] !== -1) setDirection([0, 1]);
          break;
        case 'ArrowLeft':
          if (direction[0] !== 1) setDirection([-1, 0]);
          break;
        case 'ArrowRight':
          if (direction[0] !== -1) setDirection([1, 0]);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Juego Loop
  useEffect(() => {
    if (gameOver) return;

    intervalRef.current = setInterval(() => {
      moveSnake();
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [snake, direction, gameOver, speed]);

  // Dibujar en el canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Limpiar canvas
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        // Dibujar comida
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(food[0] * cellSize, food[1] * cellSize, cellSize, cellSize);

        // Dibujar serpiente
        ctx.fillStyle = '#4CAF50';
        snake.forEach(([x, y]) => {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        });
      }
    }
  }, [snake, food, canvasSize, cellSize]);

  // Función para mover la serpiente
  const moveSnake = () => {
    const newSnake = [...snake];
    const head = newSnake[newSnake.length - 1];
    const newHead: [number, number] = [
      head[0] + direction[0],
      head[1] + direction[1],
    ];

    // Revisar colisiones con paredes
    if (
      newHead[0] < 0 ||
      newHead[0] >= canvasSize / cellSize ||
      newHead[1] < 0 ||
      newHead[1] >= canvasSize / cellSize
    ) {
      endGame();
      return;
    }

    // Revisar colisiones con sí mismo
    if (snake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
      endGame();
      return;
    }

    newSnake.push(newHead);

    // Revisar si ha comido
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setScore(prevScore => prevScore + 1);
      generateFood(newSnake);
      // Aumentar la velocidad cada 5 puntos
      if ((score + 1) % 5 === 0 && speed > 50) {
        setSpeed(prevSpeed => prevSpeed - 20);
      }
    } else {
      newSnake.shift(); // Quitar la cola
    }

    setSnake(newSnake);
  };

  // Función para generar nueva comida
  const generateFood = (currentSnake: [number, number][]) => {
    let newFood: [number, number];
    while (true) {
      newFood = [
        Math.floor(Math.random() * (canvasSize / cellSize)),
        Math.floor(Math.random() * (canvasSize / cellSize)),
      ];
      // Asegurarse de que la comida no esté en la serpiente
      if (!currentSnake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1])) {
        break;
      }
    }
    setFood(newFood);
  };

  // Función para terminar el juego
  const endGame = () => {
    setGameOver(true);
    clearInterval(intervalRef.current as NodeJS.Timeout);
    alert(`Juego Terminado! Tu puntuación: ${score}`);
    resetGame();
  };

  // Función para reiniciar el juego
  const resetGame = () => {
    setSnake([[10, 10]]);
    setDirection([0, -1]);
    setFood([15, 15]);
    setScore(0);
    setSpeed(initialSpeed);
    setGameOver(false);
  };

  return (
    <div style={styles.gameWrapper}>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={styles.canvas}
      ></canvas>
      <div style={styles.score}>
        <span>Puntuación: {score}</span>
      </div>
    </div>
  );
};

/**
 * Estilos en línea para el componente NotFound y el juego Snake
 */
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7fafc',
    padding: '20px',
  },
  content: {
    textAlign: 'center' as 'center',
    marginBottom: '40px',
  },
  icon: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '4rem',
    fontWeight: 'bold' as 'bold',
    color: '#2d3748',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#4a5568',
    marginBottom: '20px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4299e1',
    color: '#fff',
    fontWeight: '600' as '600',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  gameContainer: {
    marginTop: '40px',
  },
  gameWrapper: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
  },
  canvas: {
    border: '2px solid #4a5568',
    borderRadius: '8px',
    backgroundColor: '#edf2f7',
  },
  score: {
    marginTop: '10px',
    fontSize: '1.2rem',
    color: '#2d3748',
    fontWeight: '500' as '500',
  },
};

export default NotFound;
