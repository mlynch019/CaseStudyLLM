import React, { useEffect, useRef, useState, useCallback } from 'react';
import farmerImageSrc from '../static/Jim_Sprite_3.png';
import hayBaleImageSrc from '../static/haybale.png';
import jumpSound from '../static/funny-spring-jump-140378.mp3';

const Game = () => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null); // Reference for the audio element
  const gameWidth = 1800;
  const gameHeight = 900;
  let gameSpeed = 7;
  let gravity = 0.6;
  let isJumping = false;
  let jumpStrength = 30;
  let obstacles = [];
  let obstacleInterval = 100;
  let obstacleTimer = 0;
  let farmerImage = new Image();
  let hayBaleImage = new Image();

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const farmer = {
    x: 50,
    y: gameHeight - 250,
    width: 350,
    height: 250,
    dy: 0,
  };

  const loadImages = useCallback(() => {
    return new Promise((resolve) => {
      let loadedCount = 0;
      const checkLoaded = () => {
        loadedCount++;
        if (loadedCount === 2) {
          resolve();
        }
      };

      farmerImage.src = farmerImageSrc;
      hayBaleImage.src = hayBaleImageSrc;

      farmerImage.onload = checkLoaded;
      hayBaleImage.onload = checkLoaded;
      farmerImage.onerror = () => {
        console.error('Failed to load farmer image');
      };
      hayBaleImage.onerror = () => {
        console.error('Failed to load hay bale image');
      };
    });
  }, []);

  const drawFarmer = useCallback((ctx) => {
    ctx.drawImage(farmerImage, farmer.x, farmer.y, farmer.width, farmer.height);
  }, [farmerImage, farmer.x, farmer.y, farmer.width, farmer.height]);

  const drawHayBale = useCallback((ctx, obstacle) => {
    ctx.drawImage(hayBaleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    if (obstacle.doubleStacked) {
      ctx.drawImage(hayBaleImage, obstacle.x, obstacle.y - obstacle.height, obstacle.width, obstacle.height);
    }
  }, [hayBaleImage]);

  const handleJump = useCallback(() => {
    if (!isJumping) {
      isJumping = true;
      farmer.dy = -jumpStrength;
      // Play jump sound
      audioRef.current.play();
    }
  }, [isJumping, jumpStrength]);

  const updateGame = useCallback(() => {
    if (isJumping) {
      farmer.dy += gravity;
      farmer.y += farmer.dy;
      if (farmer.y > gameHeight - farmer.height) {
        farmer.y = gameHeight - farmer.height;
        farmer.dy = 0;
        isJumping = false;
      }
    }

    obstacleTimer++;
    if (obstacleTimer > obstacleInterval) {
      const doubleStacked = Math.random() > 0.8; // 20% chance to be double stacked
      obstacles.push({
        x: gameWidth,
        y: gameHeight - 150,
        width: 150,
        height: 150,
        doubleStacked: doubleStacked,
      });
      obstacleTimer = 0;
    }

    obstacles.forEach((obstacle, index) => {
      obstacle.x -= gameSpeed;
      if (obstacle.x + obstacle.width < 0) {
        obstacles.splice(index, 1);
      }

      if (
        farmer.x + farmer.width - 50 > obstacle.x &&
        farmer.x < obstacle.x + obstacle.width - 50 &&
        farmer.y + farmer.height - 50 > obstacle.y - (obstacle.doubleStacked ? obstacle.height : 0) &&
        farmer.y < obstacle.y + obstacle.height - 50
      ) {
        setGameOver(true);
      }
    });
  }, [isJumping, gravity, gameHeight, farmer, gameSpeed, obstacles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    loadImages().then(() => {
      const gameLoop = () => {
        if (!gameOver) {
          ctx.clearRect(0, 0, gameWidth, gameHeight);
          ctx.fillStyle = '#90ee90'; // Light green background color
          ctx.fillRect(0, 0, gameWidth, gameHeight);

          drawFarmer(ctx);

          obstacles.forEach((obstacle) => {
            drawHayBale(ctx, obstacle);
          });

          updateGame();

          requestAnimationFrame(gameLoop);
        }
      };

      gameLoop();

      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
          handleJump();
        }
      });
    });

    return () => {
      window.removeEventListener('keydown', handleJump);
    };
  }, [loadImages, drawFarmer, drawHayBale, handleJump, updateGame, gameOver]);

  useEffect(() => {
    if (gameOver) {
      window.alert('Game Over! You should have purchased Country Horse Insurance!');
      window.location.assign('http://localhost:3000');
    }
  }, [gameOver]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh', backgroundColor: '#2e8b57' }}>
      {/* Audio element for jump sound */}
      <audio ref={audioRef} src={jumpSound} />
      <canvas
        ref={canvasRef}
        width={gameWidth}
        height={gameHeight}
        style={{ border: '2px solid #006400', borderRadius: '10px' }}
      />
    </div>
  );
};

export default Game;
