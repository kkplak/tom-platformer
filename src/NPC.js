import Entity from "./Entity";

export default class NPC extends Entity {
  constructor(game, x, y, spriteSheet, moveDistance = 3) {
    super(game);
    this.x = x;
    this.y = y;

    this.speed = 1;
    this.direction = 1;
    this.w = 1;
    this.h = 1;

    this.initialX = x;

    this.moveDistance = moveDistance;
    this.spriteSheet = spriteSheet;
    this.currentFrame = 0;
    this.animationSpeed = 150;
    this.animationTimer = 0;

    this.frames = this.spriteSheet.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    this.adjustYPosition();
  }

  adjustYPosition() {
    const { collisionMap, levelWidth, levelHeight } = this.game;

    for (let row = Math.floor(this.y); row < levelHeight; row++) {
      const index = row * levelWidth + Math.floor(this.x);
      if (collisionMap[index] !== 0) {
        this.y = row - 1;
        break;
      }
    }
  }

  update(delta) {
    const { collisionMap, levelWidth } = this.game;

    // Compute proposed new position
    const proposedX = this.x + this.speed * this.direction * delta;

    // Determine the tile coordinates
    const tileX = Math.floor(proposedX);
    const tileY = Math.floor(this.y);

    // Calculate tile indices for collision detection
    const leftTileIndex = tileY * levelWidth + tileX - 1;
    const rightTileIndex = tileY * levelWidth + tileX + 1;

    // Collision detection
    let collision = false;
    if (this.direction === 1 && collisionMap[rightTileIndex] !== 0) {
      collision = true;
    } else if (this.direction === -1 && collisionMap[leftTileIndex] !== 0) {
      collision = true;
    }

    if (!collision) {
      // No collision, update position
      this.x = proposedX;
    } else {
      // Collision detected, reverse direction
      this.direction *= -1;
    }

    // Check movement bounds
    if (this.x > this.initialX + this.moveDistance) {
      this.x = this.initialX + this.moveDistance;
      this.direction = -1;
    } else if (this.x < this.initialX) {
      this.x = this.initialX;
      this.direction = 1;
    }

    // Animation code
    this.animationTimer += delta * 1000;
    if (this.animationTimer > this.animationSpeed) {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
      this.animationTimer = 0;
    }
  }

  render(delta) {
    const { ctx, camera, canvas } = this.game;
    const tilesInViewX = camera.endX - camera.startX;
    const tilesInViewY = camera.endY - camera.startY;
    const tileWidth = canvas.width / tilesInViewX;
    const tileHeight = canvas.height / tilesInViewY;

    const screenX = (this.x - camera.startX) * tileWidth;
    const screenY = (this.y - camera.startY) * tileHeight;

    const sprite = this.frames[this.currentFrame];

    ctx.save();

    if (this.direction === -1) {
      ctx.translate(screenX + this.w * tileWidth, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(
        sprite,
        0,
        screenY,
        this.w * tileWidth,
        this.h * tileHeight
      );
    } else {
      ctx.drawImage(
        sprite,
        screenX,
        screenY,
        this.w * tileWidth,
        this.h * tileHeight
      );
    }

    ctx.restore();
  }
}
