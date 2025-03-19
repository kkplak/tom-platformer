import Game from "./Game";

export default class Controller {
  constructor(game) {
    /**
     * @type {Game}
     */
    this.game = game;

    this.controlling = this.game.player;
  }

  update(delta) {
    const inputManager = this.game.inputManager;
    const player = this.controlling;

    var speed = (player.onGround ? 6 : 5.5) * delta;

    if (inputManager.isKeyDown("shift")) {
      speed /= 5;
    }

    if (player.crouch) {
      speed /= 5;
    }

    var left =
      inputManager.isKeyDown("a") || inputManager.isKeyDown("ArrowLeft");

    var right =
      inputManager.isKeyDown("d") || inputManager.isKeyDown("ArrowRight");

    var move = left ^ right && !player.animation.disableController;

    if (move) {
      if (left) {
        player.x -= speed;
        player.facing = 0;
      }

      if (right) {
        player.x += speed;
        player.facing = 1;
      }

      if (!player.running) {
        player.running = true;
      }
    } else {
      if (player.running) {
        player.running = false;
      }
    }

    var crouchValue = false;

    if (inputManager.isKeyDown("s") || inputManager.isKeyDown("ArrowDown")) {
      if (player.ledgeHang) {
        player.y += delta;
      } else {
        if (player.onGround) {
          if (move) {
            if (player.crouch) {
              crouchValue = true;
            } else {
              player.slide();
            }
          } else {
            crouchValue =
              player.animationName === "crouch" ||
              player.animationName === "crawl" ||
              player.animation.idle;
          }
        } else {
        }
      }
    }

    player.setCrouch(crouchValue);

    if (player.canFly && inputManager.isKeyDown(" ")) {
      player.isFlying = true;
    } else {
      player.isFlying = false;

      if (
        inputManager.isKeyPressed("w") ||
        inputManager.isKeyPressed(" ") ||
        inputManager.isKeyPressed("ArrowUp")
      ) {
        if (!player.animation.disableController) {
          player.jump();
        }
      }
    }

    if (!player.animation.disableController) {
      if (
        inputManager.isKeyPressed("attack") ||
        inputManager.isMousePressed("0")
      ) {
        if (player.onGround) {
          // player.attack();
        } else {
          player.groundSlam();
        }
      }
      if (inputManager.isKeyPressed("f")) {
        player.knockback();
      }

      if (inputManager.isKeyPressed("g")) {
        this.game.showInfo = !this.game.showInfo;
      }
    }

    if (inputManager.isKeyPressed("-")) {
      this.game.camera.scaleSize(1.1);
    }
    if (inputManager.isKeyPressed("=")) {
      this.game.camera.scaleSize(0.9);
    }

    if (player.x > this.game.levelWidth / 5) {
      var map = this.game.map;
      var rows = [];

      for (var i = 0; i < map.length; i++) {
        var [x, y] = this.game.convertIndexToCoordinates(i);
        var row = rows[y] || (rows[y] = []);

        row.push(map[i]);
      }

      var newMap = [];

      for (var i = 0; i < rows.length; i++) {
        newMap.push(...rows[i], ...rows[i]);
      }

      this.game.map = newMap;
      this.game.levelWidth *= 2;

      this.game.collisionMap = this.game.createCollisionMap();
    }
  }
}
