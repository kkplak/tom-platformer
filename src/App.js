import { useEffect, useRef, useState } from "react";
import Game from "./Game";
import SpriteSheets from "./data/SpriteSheets";
import SpriteSheetManager from "./SpriteSheetManager";
import BackgroundMusic from "./BackgroundMusic";
import Logo from "./assets/logo.png";
import InfoIcon from "./assets/info2.png";

function App() {
  var canvasRef = useRef();
  var gameRef = useRef();

  const [isStarted, setIsStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [timer, setTimer] = useState(0);
  const [highScore, setHighScore] = useState(
    () => localStorage.getItem("highScore") || 0
  );
  const [canFly, setCanFly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [gameResult, setGameResult] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orbsCollected, setOrbsCollected] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    var ssm = new SpriteSheetManager();

    Object.keys(SpriteSheets).forEach((spriteSheetName) => {
      var data = SpriteSheets[spriteSheetName];
      ssm.addSpriteSheet(spriteSheetName, data.imgPath, data);
    });

    /**
     * @type {HTMLCanvasElement}
     */
    var canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    /**
     * @type {CanvasRenderingContext2D}
     */
    var ctx = canvas.getContext("2d");

    var last = performance.now();

    const game = new Game(canvas, ctx, ssm, handleGameEnd);
    gameRef.current = game;

    window.game = game;

    var cb = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      game.camera.updateAspectRatio();
    };
    cb();
    var active = true;
    game.active = true;

    // adding custom bg image
    var img = new Image();
    img.src = "";

    // variable to hold the pattern
    var pattern = null;

    img.onload = function () {
      pattern = ctx.createPattern(img, "repeat");
    };

    function update() {
      var now = performance.now();
      var delta = (now - last) / 1000;
      last = now;

      if (delta > 0.25) {
        delta = 0.25;
      }

      if (pattern) {
        ctx.fillStyle = pattern;
      } else {
        ctx.fillStyle = "#00011B";
      }

      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (game.active) {
        game.updateGame(delta);
        // Removed score increment here
      }

      game.renderGame(delta);

      active && requestAnimationFrame(update);
    }

    ssm.onLoaded = () => {
      Object.keys(ssm.spriteSheets).forEach((key) => {
        if (key.includes("player_")) {
          ssm.spriteSheets[key].getEffects(["flipHorizontally"]);
        }
      });

      // game.start();
      update();
    };

    window.addEventListener("resize", cb);

    return () => {
      cancelAnimationFrame(update);
      window.removeEventListener("resize", cb);

      active = false;

      game.end();
    };
  }, []);

  const handleGameEnd = (gameResult) => {
    setIsGameOver(true);
    setScore(gameResult.score);
    setHighScore(gameResult.highScore);
    setGameResult(gameResult);
    setSuccess(gameResult.collectedEnoughOrbs);
    setOrbsCollected(gameResult.orbsCollected);
    setIsNewHighScore(gameResult.isNewHighScore);
    gameRef.current.active = false;
  };

  useEffect(() => {
    if (countdown !== null) {
      if (countdown > 0) {
        setTimeout(() => setCountdown(countdown - 1), 1000);
      } else if (countdown === 0) {
        setTimeout(() => setCountdown("Go!"), 1000);
      } else if (countdown === "Go!") {
        setTimeout(() => {
          setIsStarted(true);
          setCountdown(null);
          startGame();
        }, 1000);
      }
    }
  }, [countdown]);

  const startGame = () => {
    setScore(0);
    setIsGameOver(false);
    setGameResult(null);
    setSuccess(false);
    setOrbsCollected(0);
    setIsNewHighScore(false);

    gameRef.current.active = true;
    gameRef.current.start();
    setTimer(0);
  };

  const handleStartButton = () => {
    setCountdown(3);
  };

  const handleLeftDown = (e) => {
    e.preventDefault();
    gameRef.current.inputManager.setKeyDown("ArrowLeft");
  };

  const handleLeftUp = (e) => {
    e.preventDefault();
    gameRef.current.inputManager.setKeyUp("ArrowLeft");
  };

  const handleRightDown = (e) => {
    e.preventDefault();
    gameRef.current.inputManager.setKeyDown("ArrowRight");
  };

  const handleFlyDown = (e) => {
    e.preventDefault();
    gameRef.current.inputManager.setKeyDown("fly");
  };

  const handleFlyUp = (e) => {
    e.preventDefault();
    gameRef.current.inputManager.setKeyUp("fly");
  };

  const handleRightUp = (e) => {
    e.preventDefault();
    gameRef.current.inputManager.setKeyUp("ArrowRight");
  };

  const handleJumpDown = (e) => {
    e.preventDefault();
    gameRef.current.inputManager.setKeyDown("ArrowUp");
  };

  const handleJumpUp = (e) => {
    e.preventDefault();
    gameRef.current.inputManager.setKeyUp("ArrowUp");
  };

  // const handleAttackDown = (e) => {
  //   e.preventDefault();
  //   gameRef.current.inputManager.setKeyDown("attack");
  // };

  // const handleAttackUp = (e) => {
  //   e.preventDefault();
  //   gameRef.current.inputManager.setKeyUp("attack");
  // };

  return (
    <div>
      <canvas ref={canvasRef} />

      <BackgroundMusic />

      {!isStarted && (
        <div className='start-screen'>
          <button className='info-button' onClick={openModal}>
            <img src={InfoIcon} alt='Info' />
          </button>

          {isModalOpen && (
            <div className='modal-overlay' onClick={closeModal}>
              <div
                className='modal-content'
                onClick={(e) => e.stopPropagation()}
              >
                <h1>How to Play</h1>
                <p>
                  Welcome to <strong>Galactic Jumpers</strong>! 🚀 Get ready for
                  an exciting intergalactic adventure! You've been teleported
                  into a high-tech arena in deep space where you have just 2
                  minutes to climb as high as you can. But there’s a challenge:
                  you need to collect at least 20 magic orbs along the way!
                </p>
                <p>
                  Use the <strong>left </strong>and <strong>right</strong> buttons to guide Jerry through space.
                  Press the <strong>jump</strong> button to make him leap over obstacles, or press it twice for <strong>double jump</strong>, to
                  reach new heights! 
                  </p> <p>Watch out for PowerUps—they’ll give you an
                  extra boost! 🌟 And don't forget to grab as many Orbs as you
                  can to boost your score. Good luck, Space Explorer!
                </p>

                <ul className='orb-list'>
                  <li>
                    <span className='blue-orb' aria-label='blue orb' role='img'>
                      🔵
                    </span>
                    &nbsp;The Blue Orb gives you &nbsp;<strong>5 points</strong>
                    !
                  </li>
                  <li>
                    <span
                      className='yellow-orb'
                      aria-label='yellow orb'
                      role='img'
                    >
                      🟡
                    </span>
                    &nbsp;The Yellow Orb gives you &nbsp;
                    <strong>10 points</strong>!
                  </li>
                  <li>
                    <span className='red-orb' aria-label='red orb' role='img'>
                      🔴
                    </span>
                    &nbsp;The Red Orb gives you &nbsp;<strong>15 points</strong>
                    !
                  </li>
                </ul>

                <button className='close-button' onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          )}

          <img src={Logo} alt='Game Logo' className='game-logo' />
          <h1>The Orbs of Power!</h1>
          <button className='start-button' onClick={handleStartButton}>
            Start Game
          </button>
        </div>
      )}

      {countdown !== null && (
        <div className='countdown-overlay'>
          <h1>{countdown}</h1>
        </div>
      )}

      {isGameOver && (
        <div className='end-screen'>
          <img src={Logo} alt='Game Logo' className='game-logo' />
          <div className='content'>
            {success ? (
              <>
                <h2>Good job!</h2>
                <div className='score-item'>
                  <span className='score-label'>Your score:</span>
                  <span className='score-number'>{score}</span>
                </div>
                <div className='score-item'>
                  <span className='score-label'>Orbs collected:</span>
                  <span className='score-number'>{orbsCollected}</span>
                </div>
                <div className='score-item'>
                  <span className='score-label'>Your best score:</span>
                  <span className='score-number'>{highScore}</span>
                </div>
              </>
            ) : (
              <>
                <h2>
                  I am sorry, you did not collect enough Orbs. Please play
                  again!
                </h2>
                <div className='score-item'>
                  <span className='score-label'>Orbs collected:</span>
                  <span className='score-number'>{orbsCollected}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {!isGameOver && isStarted && (
        <div id='gameUI' class='hidden'>
          <div class='game-hud'>
            <div class='hud-item'>
              <span class='hud-label'>Time Left: </span>
              <span class='hud-value' id='timeLeft'>
                120.00s
              </span>
            </div>
            <div class='hud-item'>
              <span class='hud-label'>Orbs Collected:&nbsp; </span>
              <span class='hud-value' id='orbsCollected'>
                0
              </span>
              <span class='hud-value'>/20</span>
            </div>
            <div class='hud-item'>
              <span class='hud-label'>Current Score: </span>
              <span class='hud-value' id='currentScore'>
                0
              </span>
            </div>
          </div>

          <div class='best-score' id='bestScore'>
            Best Score: 0
          </div>

          <div class='fuel-label hidden'>Fuel:</div>
          <div class='fuel-bar hidden'>
            <div class='fuel-fill' id='fuelFill'></div>
          </div>
        </div>
      )}

      <div className='controls'>
        <div className='left-right-buttons'>
          <div className='wrapper'>
            <button
              className='control-button left-button'
              onTouchStart={handleLeftDown}
              onTouchEnd={handleLeftUp}
              onMouseDown={handleLeftDown}
              onMouseUp={handleLeftUp}
              onContextMenu={(e) => e.preventDefault()}
            ></button>
            <button
              className='control-button right-button'
              onTouchStart={handleRightDown}
              onTouchEnd={handleRightUp}
              onMouseDown={handleRightDown}
              onMouseUp={handleRightUp}
              onContextMenu={(e) => e.preventDefault()}
            ></button>
          </div>
        </div>
        <div className='action-buttons'>
          <button
            className='control-button power-button hidden'
            onTouchStart={handleFlyDown}
            onTouchEnd={handleFlyUp}
            onMouseDown={handleFlyDown}
            onMouseUp={handleFlyUp}
            onContextMenu={(e) => e.preventDefault()}
          ></button>

          <button
            className='control-button jump-button'
            onTouchStart={handleJumpDown}
            onTouchEnd={handleJumpUp}
            onMouseDown={handleJumpDown}
            onMouseUp={handleJumpUp}
            onContextMenu={(e) => e.preventDefault()}
          ></button>
        </div>
      </div>
    </div>
  );
}

export default App;
