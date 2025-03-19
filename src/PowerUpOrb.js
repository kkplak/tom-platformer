// PowerUpOrb.js
export default class PowerUpOrb {
  constructor(game, x, y, soundManager) {
    console.log(`Creating PowerUpOrb at (${x}, ${y})`);
    this.game = game;
    this.x = x;
    this.y = y;
    this.collected = false;

    this.soundManager = soundManager;

    this.image = new Image();
    this.image.src = "https://cdn-icons-png.flaticon.com/512/779/779227.png";

    this.image.onload = () => {
      console.log(`PowerUpOrb image loaded at (${x}, ${y})`);
    };
    this.image.onerror = () => {
      console.error(`Failed to load PowerUpOrb image at (${x}, ${y})`);
    };
  }

  update(delta) {
    if (this.collected) return;

    const player = this.game.player;
    if (Math.floor(player.x) === this.x && Math.floor(player.y) === this.y) {
      this.collected = true;
      // this.game.orbsCollected += 1;
      this.soundManager.play("coin");
      console.log(`Orb collected at (${this.x}, ${this.y})`);
      this.game.addFloatingText(`Collected a JetPack!`, this.x, this.y);
      this.game.player.enableFlight();
      if (this.game.orbsCollected === this.game.totalOrbs) {
        this.game.endGame();
      }
    }
  }

  render(delta) {
    const { ctx, camera, canvas } = this.game;

    // calculate tile size
    const tilesInViewX = camera.endX - camera.startX;
    const tilesInViewY = camera.endY - camera.startY;
    const tileWidth = canvas.width / tilesInViewX;
    const tileHeight = canvas.height / tilesInViewY;

    // check if orb is within the camera view
    if (
      this.x >= camera.startX &&
      this.y >= camera.startY &&
      this.x <= camera.endX &&
      this.y <= camera.endY &&
      !this.collected
    ) {
      const screenX = (this.x - camera.startX) * tileWidth;
      const screenY = (this.y - camera.startY) * tileHeight;

      // Ddraw the orb image if it's loaded
      if (this.image.complete && this.image.naturalWidth !== 0) {
        ctx.drawImage(this.image, screenX, screenY, tileWidth, tileHeight);
      } else {
        // fallback to drawing a yellow circle if image is not loaded
        const radius = Math.min(tileWidth, tileHeight) / 4;
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(
          screenX + tileWidth / 2,
          screenY + tileHeight / 2,
          radius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  }
}
