import blueOrbImage from "./assets/blue.webp";
import yellowOrbImage from "./assets/yellow.webp";
import redOrbImage from "./assets/red.webp";
import jerryImage from "./assets/jerryImage2.webp";

export default class CollectibleOrb {
  constructor(game, x, y, soundManager, type = "blue") {
    console.log(`Creating ${type} orb at (${x}, ${y})`);
    this.game = game;
    this.x = x;
    this.y = y;
    this.w = 0.5;
    this.h = 0.5;
    this.collected = false;
    this.soundManager = soundManager;
    this.type = type;

    this.image = new Image();

    switch (this.type) {
      case "blue":
        this.image.src = blueOrbImage;
        this.pointValue = 5;
        break;
      case "jerry":
        this.image.src = jerryImage;
        this.pointValue = 100;
        break;
      case "yellow":
        this.image.src = yellowOrbImage;
        this.pointValue = 10;
        break;
      case "red":
        this.image.src = redOrbImage;
        this.pointValue = 15;
        break;
      default:
        this.image.src = blueOrbImage;
        this.pointValue = 5;
        break;
    }

    this.image.onerror = () => {
      console.error(`Failed to load CollectibleOrb image at (${x}, ${y})`);
    };
  }

  update(delta) {
    if (this.collected) return;

    const player = this.game.player;

    const playerCenterX = player.x + player.w / 2;
    const playerCenterY = player.y + player.h / 2;
    const orbCenterX = this.x + this.w / 2;
    const orbCenterY = this.y + this.h / 2;

    const distance = Math.hypot(
      playerCenterX - orbCenterX,
      playerCenterY - orbCenterY
    );
    const collectionDistance = (player.w + this.w) / 2;

    if (distance <= collectionDistance) {
      this.collected = true;
      this.soundManager.play("coin");
      console.log(`CollectibleOrb collected at (${this.x}, ${this.y})`);

      this.game.orbPointsCollected += this.pointValue;
      this.game.orbsCollected += 1;

      this.game.addFloatingText(`+${this.pointValue} points!`, this.x, this.y);
    }
  }

  render(delta) {
    const { ctx, camera, canvas } = this.game;

    const tilesInViewX = camera.endX - camera.startX;
    const tilesInViewY = camera.endY - camera.startY;
    const tileWidth = canvas.width / tilesInViewX;
    const tileHeight = canvas.height / tilesInViewY;

    if (
      this.x + this.w >= camera.startX &&
      this.y + this.h >= camera.startY &&
      this.x <= camera.endX &&
      this.y <= camera.endY &&
      !this.collected
    ) {
      const orbScreenWidth = this.w * tileWidth;
      const orbScreenHeight = this.h * tileHeight;

      const screenX =
        (this.x - camera.startX) * tileWidth + (tileWidth - orbScreenWidth) / 2;
      const screenY =
        (this.y - camera.startY) * tileHeight +
        (tileHeight - orbScreenHeight) / 2;

      if (this.image.complete && this.image.naturalWidth !== 0) {
        ctx.drawImage(
          this.image,
          screenX,
          screenY,
          orbScreenWidth,
          orbScreenHeight
        );
      } else {
        const radius = Math.min(orbScreenWidth, orbScreenHeight) / 2;
        ctx.fillStyle =
          this.type === "blue"
            ? "blue"
            : this.type === "yellow"
              ? "yellow"
              : "red";
        ctx.beginPath();
        ctx.arc(
          screenX + orbScreenWidth / 2,
          screenY + orbScreenHeight / 2,
          radius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  }
}
