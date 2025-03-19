import Camera from "./Camera";
import Controller from "./Controller";
import Entity from "./Entity";
import InputManager from "./InputManager";
import ParticleSystem from "./ParticleSystem";
import Player from "./Player";
import Render from "./Render";
import SpriteSheetManager from "./SpriteSheetManager";
import CollectibleOrb from "./CollectibleOrb";
import { v4 } from "uuid";
import { getRandomInteger } from "./random";
import SoundManager from "./SoundManager";
import PowerUpOrb from "./PowerUpOrb";
import bgImage from "./assets/BGGAME1.jpg";
import tile from "./assets/tile4.png";
import NPC from "./NPC";
import npc1 from "./assets/npc1.png";
import npc2 from "./assets/npc2.png";
import npc3 from "./assets/npc3.png";
import npc4 from "./assets/npc4.png";
import npc5 from "./assets/npc5.png";
import npc6 from "./assets/npc6.png";
import npc11 from "./assets/npc11.png";
import npc12 from "./assets/npc12.png";
import npc13 from "./assets/npc13.png";
import npc14 from "./assets/npc14.png";
import npc15 from "./assets/npc15.png";
import npc16 from "./assets/npc16.png";
import npc21 from "./assets/npc21.png";
import npc22 from "./assets/npc22.png";
import npc23 from "./assets/npc23.png";
import npc24 from "./assets/npc24.png";
import npc25 from "./assets/npc25.png";
import npc26 from "./assets/npc26.png";
import npc31 from "./assets/npc31.png";
import npc32 from "./assets/npc32.png";
import npc33 from "./assets/npc33.png";
import npc34 from "./assets/npc34.png";
import npc35 from "./assets/npc35.png";
import npc36 from "./assets/npc36.png";

export default class Game {
  constructor(canvas, ctx, ssm, onGameEnd) {
    /**
     * @type {HTMLCanvasElement}
     */
    this.canvas = canvas;

    /**
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = ctx;

    /**
     * @type {SpriteSheetManager}
     */
    this.ssm = ssm;

    this.render = new Render(this);
    this.camera = new Camera(this);

    this.soundManager = new SoundManager();
    this.player = new Player(this, this.soundManager);

    this.inputManager = new InputManager();
    this.particleSystem = new ParticleSystem(this);

    this.controller = new Controller(this);

    this.startTime = null;
    this.endTime = null;

    this.timeLimit = 120;

    this.maxHeightReached = null;
    this.orbPointsCollected = 0;

    this.bgImage = new Image();
    this.bgImage.src = bgImage;

    this.showDebugInfo = false;
    this.active = true;
    this.onGameEnd = onGameEnd;

    this.lastTickTime = null;

    /**
     * @type {Object.<string, Entity>}
     */
    this.entities = {};

    this.floatingTexts = [];

    //map
    const level = [
      //half kemi
      [5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5],
      [5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5], //1
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //10
      [5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5],
      [5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      //udit
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //10
      [5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5],
      [5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //10
      [5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5],
      [5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5], //40
      [5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 5, 5],
      [5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 5],
      [5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 5],
      [5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 5],
      [5, 5, 5, 5, 5, 0, 5, 0, 0, 0, 5, 5, 5, 0, 5],
      // original under
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //50
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 0, 0, 5, 5, 5, 5, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 5],
      [5, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5],
      [5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 5, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 5],
      [5, 5, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 5], //60
      [5, 5, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 5],
      [5, 5, 0, 5, 0, 5, 5, 0, 0, 0, 0, 5, 0, 0, 5],
      [5, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 0, 0, 5, 5, 5, 5, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 5],
      [5, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5],
      [5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 5, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 5], //70
      [5, 5, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 5],
      [5, 5, 0, 5, 0, 5, 5, 0, 0, 0, 0, 5, 0, 0, 5],
      [5, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 0, 0, 5, 5, 5, 5, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 5],
      [5, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5],
      [5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5],
      [5, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //80
      [5, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 5, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 5],
      [5, 5, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 5],
      [5, 5, 0, 5, 0, 5, 5, 0, 0, 0, 0, 5, 0, 0, 5],
      [5, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 0, 0, 5, 5, 5, 5, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 5],
      [5, 5, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 5],
      [5, 5, 0, 5, 0, 5, 5, 0, 0, 0, 0, 5, 0, 0, 5],
      [5, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 0, 5], //90
      [5, 5, 5, 5, 5, 5, 0, 0, 5, 5, 5, 5, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5],
      [5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5], //100
      //christine
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //110
      [5, 0, 5, 5, 5, 0, 0, 0, 0, 5, 5, 5, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5, 5, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 5, 5, 5, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5], //120
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 5, 5, 5, 5, 5],
      [5, 0, 0, 5, 5, 5, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 5], //130
      // mini kemi - bonus
      [5, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 5, 0, 5],
      [5, 0, 0, 0, 0, 5, 0, 0, 0, 0, 5, 5, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 5],
      [5, 0, 0, 0, 5, 5, 5, 5, 5, 0, 5, 5, 5, 0, 5],
      [5, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 5, 0, 5],
      [5, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 5],
      [5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 5], //140
      [5, 0, 0, 0, 0, 5, 5, 5, 0, 0, 5, 5, 0, 0, 5],
      [5, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 5],
      [5, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 5, 5, 5, 5, 0, 0, 0, 5, 5, 5, 0, 0, 5],
      [5, 0, 0, 5, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //150
      [5, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 5],
      [5, 0, 5, 5, 5, 0, 0, 5, 5, 5, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 5, 0, 0, 5, 0, 0, 0, 5],
      [5, 0, 5, 0, 5, 0, 0, 5, 5, 5, 5, 0, 0, 0, 5],
      [5, 0, 5, 5, 5, 0, 0, 5, 5, 5, 5, 0, 0, 0, 5],
      [5, 0, 0, 5, 5, 0, 0, 5, 5, 5, 5, 5, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //160

      //kemi
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 5, 0, 5],
      [5, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 5, 0, 5],
      [5, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 5, 0, 5],
      [5, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5],
      [5, 5, 5, 5, 5, 0, 0, 5, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 0, 0, 5, 0, 0, 0, 0, 0, 0, 5], //170
      [5, 5, 5, 5, 5, 0, 0, 5, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 0, 0, 5, 5, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //180
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5],
      [5, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5],
      [5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5], //190
      //kavia 2
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5],
      [5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5],
      [5, 5, 5, 0, 0, 0, 0, 5, 0, 0, 0, 0, 5, 5, 5],
      [5, 5, 5, 0, 0, 5, 5, 5, 0, 0, 0, 5, 5, 5, 5],
      [5, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 5], //200
      [5, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      [5, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      //kavia
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 5], //210
      [5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      [5, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      [5, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //220
      [5, 5, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 5, 5, 5],
      [5, 5, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 5, 5, 5],
      [5, 5, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 5, 5, 5],
      [5, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 5, 5, 5],
      [5, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 5, 5, 5],
      [5, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //230
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5],
      [5, 5, 5, 0, 0, 0, 0, 5, 0, 0, 0, 0, 5, 5, 5],
      [5, 5, 5, 0, 0, 0, 0, 5, 0, 0, 0, 0, 5, 5, 5],
      [5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 5, 5, 5, 5],
      //interval
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5],
      [5, 5, 5, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],

      //udit
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //240
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 5],
      [5, 0, 5, 5, 5, 5, 5, 5, 0, 0, 5, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 5, 0, 0, 5, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 5, 0, 0, 5, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 5, 0, 0, 5, 0, 0, 0, 5],
      [5, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //250
      [5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //260
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 5, 5],
      [5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 5],
      [5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 5],
      [5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 5],
      [5, 5, 5, 5, 5, 0, 5, 0, 0, 0, 5, 5, 5, 0, 5],
      //christine
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //270
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 5, 5, 5, 0, 0, 0, 0, 5, 5, 5, 0, 0, 5], //280
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5, 5, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 5, 5, 5, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5], //290
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 5, 5, 5, 5, 5],
      [5, 0, 0, 5, 5, 5, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 5],

      [5, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5], //300
      [5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5],
      [5, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 5],
      [5, 5, 5, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 5],
      [5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 0, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5],
      //end of space
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //310
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //320
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      //space above
      [5, 5, 5, 0, 5, 5, 5, 5, 5, 0, 5, 5, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 5, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5],
      [5, 0, 0, 5, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 5, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5], //330
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 5, 5, 5, 5, 5],
      [5, 0, 0, 5, 5, 5, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      //konrad
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 5], //340
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], //350
      [5, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 5], //360
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 5, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 5], //370
      [5, 5, 0, 5, 0, 5, 5, 0, 0, 0, 0, 5, 0, 0, 5],
      [5, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 0, 5],
      [5, 5, 5, 5, 5, 5, 0, 0, 5, 5, 5, 5, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 5],
      [5, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 0, 5],
      [5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 5, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 5],
      [5, 5, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 5, 5], //380
      [5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5],
      [5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [5, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 5],
      [5, 5, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 5, 5],
      [5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5],
      [5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5],
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], //399
    ];

    this.showInfo = false;
    this.map = level.flat(1);

    this.levelWidth = level[0].length;
    this.levelHeight = level.length;
    this.camera.endY = this.levelHeight - 7;
    this.camera.startY = this.levelHeight - 15;

    this.camera.maxY = this.levelHeight;
    this.camera.maxX = this.levelWidth;
    this.camera.minX = 0;
    this.camera.scaleSize(2.5);
    this.groundImage = new Image();
    this.groundImage.src = tile;

    this.player.y = this.levelHeight - 7;
    this.player.x = this.levelWidth - 8;

    this.spawnTick = 0;
    this.fpsTick = 0;
    this.fps = 0;

    this.loop = this.loop.bind(this);
    this.lastTime = performance.now();

    requestAnimationFrame(this.loop);

    this.manualOrbPositions = [
      { x: 7, y: 3, type: "jerry" },
      { x: 3, y: 4, type: "blue" },
      { x: 12, y: 7, type: "blue" },
      { x: 4, y: 10, type: "yellow" },
      { x: 7, y: 18, type: "yellow" },
      { x: 10, y: 27, type: "blue" },
      { x: 3, y: 33, type: "blue" },
      { x: 2, y: 42, type: "yellow" },
      { x: 4, y: 49, type: "yellow" },
      { x: 13, y: 45, type: "red" },
      { x: 13, y: 43, type: "red" },
      { x: 7, y: 53, type: "yellow" },
      { x: 2, y: 58, type: "yellow" },
      { x: 2, y: 61, type: "yellow" },
      { x: 13, y: 65, type: "red" },
      { x: 7, y: 61, type: "blue" },
      { x: 2, y: 71, type: "red" },
      { x: 8, y: 72, type: "blue" },
      { x: 7, y: 77, type: "blue" },
      { x: 4, y: 80, type: "blue" },
      { x: 2, y: 83, type: "blue" },
      { x: 13, y: 84, type: "blue" },
      { x: 12, y: 86, type: "red" },
      { x: 5, y: 88, type: "red" },
      { x: 3, y: 90, type: "yellow" },
      { x: 10, y: 95, type: "blue" },
      { x: 13, y: 98, type: "blue" },
      { x: 3, y: 103, type: "blue" },
      { x: 6, y: 108, type: "blue" },
      { x: 11, y: 116, type: "red" },
      { x: 11, y: 118, type: "red" },
      { x: 11, y: 121, type: "red" },
      { x: 11, y: 124, type: "red" },
      { x: 1, y: 132, type: "yellow" },
      { x: 5, y: 134, type: "yellow" },
      { x: 13, y: 138, type: "blue" },
      { x: 4, y: 141, type: "red" },
      { x: 12, y: 143, type: "yellow" },
      { x: 7, y: 145, type: "yellow" },
      { x: 1, y: 148, type: "red" },
      { x: 12, y: 149, type: "yellow" },
      { x: 11, y: 158, type: "yellow" },
      { x: 1, y: 151, type: "yellow" },
      { x: 5, y: 152, type: "yellow" },
      { x: 2, y: 1589, type: "yellow" },
      { x: 8, y: 171, type: "yellow" },
      { x: 2, y: 180, type: "blue" },
      { x: 5, y: 190, type: "yellow" },
      { x: 7, y: 194, type: "blue" },
      { x: 6, y: 202, type: "red" },
      { x: 6, y: 203, type: "red" },
      { x: 6, y: 204, type: "red" },
      { x: 12, y: 212, type: "blue" },
      { x: 11, y: 212, type: "blue" },
      { x: 10, y: 212, type: "blue" },
      { x: 9, y: 212, type: "blue" },
      { x: 8, y: 212, type: "blue" },
      { x: 12, y: 228, type: "blue" },
      { x: 2, y: 230, type: "blue" },
      { x: 1, y: 231, type: "blue" },
      { x: 4, y: 234, type: "yellow" },
      { x: 8, y: 246, type: "blue" },
      { x: 9, y: 246, type: "blue" },
      { x: 5, y: 246, type: "blue" },
      { x: 3, y: 252, type: "blue" },
      { x: 2, y: 259, type: "yellow" },
      { x: 2, y: 265, type: "red" },
      { x: 13, y: 267, type: "yellow" },
      { x: 13, y: 266, type: "red" },
      { x: 12, y: 277, type: "blue" },
      { x: 1, y: 280, type: "blue" },
      { x: 2, y: 293, type: "blue" },
      { x: 12, y: 286, type: "blue" },
      { x: 11, y: 286, type: "yellow" },
      { x: 10, y: 286, type: "blue" },
      { x: 12, y: 288, type: "blue" },
      { x: 11, y: 288, type: "yellow" },
      { x: 10, y: 288, type: "blue" },
      { x: 11, y: 292, type: "blue" },
      { x: 11, y: 297, type: "yellow" },
      { x: 12, y: 308, type: "blue" },
      { x: 2, y: 302, type: "blue" },
      { x: 2, y: 308, type: "blue" },
      { x: 7, y: 311, type: "blue" },
      { x: 11, y: 319, type: "blue" },
      { x: 1, y: 324, type: "red" },
      { x: 2, y: 332, type: "yellow" },
      { x: 11, y: 339, type: "yellow" },
      { x: 8, y: 350, type: "blue" },
      { x: 12, y: 354, type: "blue" },
      { x: 2, y: 371, type: "yellow" },
      { x: 13, y: 376, type: "red" },
      { x: 6, y: 388, type: "blue" },
    ];

    this.orbs = [];
    this.powerUpOrbs = [];
    this.totalOrbs = 0;
    this.orbsCollected = 0;

    if (this.map.length !== this.levelWidth * this.levelHeight) {
      throw new Error("Invalid map length: " + this.map.length);
    }

    /**
     * - 0 = No collision
     * - 1 = Left
     * - 2 = Right
     * - 4 = Top
     * - 8 = Bottom
     */
    this.collisionMap = this.createCollisionMap();

    this.placeOrbs();

    this.gameOver = false;
  }

  spawnNPC(x, y, spriteSheet, moveDistance = 3) {
    const npc = new NPC(this, x, y, spriteSheet, moveDistance);
    const npcId = v4();
    this.entities[npcId] = npc;
  }

  spawnMultipleNPCs() {
    const npcSprites1 = [npc1, npc2, npc3, npc4, npc5, npc6];
    const npcSprites2 = [npc11, npc12, npc13, npc14, npc15, npc16];
    const npcSprites3 = [npc21, npc22, npc23, npc24, npc25, npc26];
    const npcSprites4 = [npc31, npc32, npc33, npc34, npc35, npc36];

    this.spawnNPC(4, this.levelHeight - 386, npcSprites4, 2);
    this.spawnNPC(8, this.levelHeight - 386, npcSprites4, 2);
    this.spawnNPC(10, this.levelHeight - 95, npcSprites2, 3);
    this.spawnNPC(3, this.levelHeight - 291, npcSprites1, 3);
    this.spawnNPC(2, this.levelHeight - 199, npcSprites2, 4);
    this.spawnNPC(8, this.levelHeight - 185, npcSprites3, 4);
    this.spawnNPC(1, this.levelHeight - 112, npcSprites3, 9);
    this.spawnNPC(8, this.levelHeight - 331, npcSprites3, 3);
    this.spawnNPC(6, this.levelHeight - 351, npcSprites2, 4);
    this.spawnNPC(3, this.levelHeight - 276, npcSprites3, 3);
    this.spawnNPC(9, this.levelHeight - 276, npcSprites4, 4);
    this.spawnNPC(8, this.levelHeight - 308, npcSprites3, 3);
    this.spawnNPC(8, this.levelHeight - 316, npcSprites4, 2);
    this.spawnNPC(6, this.levelHeight - 128, npcSprites3, 4);
    this.spawnNPC(1, this.levelHeight - 162, npcSprites1, 5);
    this.spawnNPC(4, this.levelHeight - 68, npcSprites1, 4);
    this.spawnNPC(3, this.levelHeight - 25, npcSprites1);
    this.spawnNPC(1, this.levelHeight - 221, npcSprites4, 3);
    this.spawnNPC(4, this.levelHeight - 11, npcSprites2, 7);
    this.spawnNPC(2, this.levelHeight - 34, npcSprites3, 2);
    this.spawnNPC(5, this.levelHeight - 46, npcSprites4, 2);
    this.spawnNPC(3, this.levelHeight - 154, npcSprites2, 3);
  }

  addOrb(x, y, type = "blue") {
    const orb = new CollectibleOrb(this, x, y, this.soundManager, type);
    this.orbs.push(orb);
    console.log(`CollectibleOrb added at (${x}, ${y}) with type ${type}`);
  }

  end() {
    this.inputManager.end();
  }

  spawnEntity() {
    var id = v4();

    var entity = new Entity(this);
    this.entities[id] = entity;

    var direction = Math.random() > 0.5 ? -1 : 1;

    if (this.camera.startX <= 0) {
      direction = 1;
    }

    if (direction === -1) {
      entity.x = this.camera.endX + 2;
    } else {
      entity.x = this.camera.startX - 2;
    }

    entity.direction = direction;

    entity.y = this.player.y + getRandomInteger(-2, 2);
  }

  addFloatingText(message, x, y) {
    const canvasX =
      (x - this.camera.startX) *
      (this.canvas.width / (this.camera.endX - this.camera.startX));
    const canvasY =
      (y - this.camera.startY) *
      (this.canvas.height / (this.camera.endY - this.camera.startY));

    this.floatingTexts.push({
      message,
      x: canvasX,
      y: canvasY,
      startTime: performance.now(),
    });
  }

  createCollisionMap() {
    var collisionMap = [];

    for (var i = 0; i < this.map.length; i++) {
      var block = this.map[i];

      var flag = 0;

      if (block) {
        var [x, y] = this.convertIndexToCoordinates(i);
        var top = this.map[this.convertCoordinatesToIndex(x, y - 1)];
        var bottom = this.map[this.convertCoordinatesToIndex(x, y + 1)];

        var left = this.map[this.convertCoordinatesToIndex(x - 1, y)];
        var right = this.map[this.convertCoordinatesToIndex(x + 1, y)];

        if (x !== 0) {
          flag |= !left ? 1 : 0;
        }
        if (x !== this.levelWidth - 1) {
          flag |= !right ? 2 : 0;
        }
        if (y !== 0) {
          flag |= !top ? 4 : 0;
        }
        if (y !== this.levelHeight - 1) {
          flag |= !bottom ? 8 : 0;
        }
      }

      collisionMap.push(flag);
    }

    return collisionMap;
  }
  getCurrentScore() {
    const heightPoints = Math.floor(this.levelHeight - this.maxHeightReached);
    const orbPoints = this.orbPointsCollected;
    const score = heightPoints + orbPoints;
    return score;
  }
  getViewport() {
    return [this.canvas.width, this.canvas.height];
  }
  loop(currentTime) {
    const delta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.updateGame(delta);
    this.renderGame(delta);

    requestAnimationFrame(this.loop);
  }

  start() {
    document.getElementById("gameUI").classList.remove("hidden");

    this.spawnMultipleNPCs();

    this.startTime = performance.now();
    this.gameOver = false;
    this.orbsCollected = 0;
    this.maxHeightReached = this.player.y;

    this.player.fuel = this.player.maxFuel;
    this.camera.followingObject = this.player;

    this.inputManager.start();
  }
  convertIndexToCoordinates(i) {
    return [i % this.levelWidth, Math.floor(i / this.levelWidth)];
  }

  convertCoordinatesToIndex(x, y) {
    return y * this.levelWidth + x;
  }

  renderGame(delta) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
    // Draw the background image
    this.ctx.drawImage(
      this.bgImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  
    // Render the ground tiles
    const tilesInViewX = this.camera.endX - this.camera.startX;
    const tilesInViewY = this.camera.endY - this.camera.startY;
    const tileWidth = this.canvas.width / tilesInViewX;
    const tileHeight = this.canvas.height / tilesInViewY;
  
    for (let i = 0; i < this.map.length; i++) {
      const [x, y] = this.convertIndexToCoordinates(i);
      const block = this.map[i];
  
      const screenX = (x - this.camera.startX) * tileWidth;
      const screenY = (y - this.camera.startY) * tileHeight;
  
      // Draw ground tile if it's a block (5 in your map data)
      if (block === 5) {
        this.ctx.drawImage(
          this.groundImage,
          screenX,
          screenY,
          tileWidth,
          tileHeight
        );
      }
  
      // Debug information: Render the x, y coordinates on every tile
      if (this.showDebugInfo) {
        const debugY = this.levelHeight - y - 1; // Flip y-coordinate for debug text
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        this.ctx.font = "10px Arial";
        this.ctx.fillText(`(${x},${debugY})`, screenX + 5, screenY + 15);
      }
    }
  
    // Render orbs
    for (const orb of this.orbs) {
      orb.render(delta);
    }
  
    for (const orbP of this.powerUpOrbs) {
      orbP.render(delta);
    }
  
    // Render the player
    this.player.render(delta);
  
    // Render NPCs (entities)
    for (const entityUUID in this.entities) {
      const entity = this.entities[entityUUID];
      entity.render(delta); // Render all NPCs
    }
  
    // Render particles and floating texts
    this.particleSystem.render();
    this.renderFloatingTexts();
  
 
    if (this.startTime !== null && !this.gameOver) {
      const elapsedMilliseconds = performance.now() - this.startTime;
      const remainingTime = Math.max(
        0,
        this.timeLimit - Math.floor(elapsedMilliseconds / 1000)
      );
      const currentScore = this.getCurrentScore();
  
 
      if (remainingTime <= 10) {
        if (this.lastTickTime === null || this.lastTickTime !== remainingTime) {
          this.lastTickTime = remainingTime;
          this.soundManager.play("tick");
        }
      } else {
     
        this.lastTickTime = null;
      }
  
      // Update UI elements
      document.getElementById("timeLeft").innerText = `${remainingTime}s`;
      document.getElementById("orbsCollected").innerText = this.orbsCollected;
      document.getElementById("currentScore").innerText = currentScore;
  
      const fuelLevel = (this.player.fuel / this.player.maxFuel) * 100;
      document.getElementById("fuelFill").style.width = `${fuelLevel}%`;
  
      const highScore = localStorage.getItem("highScore") || 0;
      document.getElementById("bestScore").innerText = `Best Score: ${highScore}`;
  
      // **Change the color of the time left during the last 10 seconds**
      const timeLeftElement = document.getElementById("timeLeft");
      if (remainingTime <= 10) {
        timeLeftElement.style.color = "red";
      } else {
        timeLeftElement.style.color = ""; // Reset to default color
      }
    } else {
      // Reset lastTickTime when the game is over or hasn't started
      this.lastTickTime = null;
    }
  }
  

  /**

   * @param {number} x 
   * @param {number} y 
   */
  addPowerUpOrb(x, y) {
    const powerUpOrb = new PowerUpOrb(this, x, y, this.soundManager);
    this.powerUpOrbs.push(powerUpOrb);
    console.log(`PowerUpOrb added at (${x}, ${y})`);
  }
  renderFloatingTexts() {
    const currentTime = performance.now();
    this.floatingTexts = this.floatingTexts.filter(
      (ft) => currentTime - ft.startTime < 2000
    );

    this.floatingTexts.forEach((ft) => {
      const elapsed = currentTime - ft.startTime;
      const alpha = 1 - elapsed / 2000;
      this.ctx.globalAlpha = alpha;

      this.ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
      this.ctx.font = "22px Comic Sans MS";

      // Apply movement effect
      const offsetY = elapsed * 0.05;
      this.ctx.fillText(ft.message, ft.x, ft.y - offsetY);
      this.ctx.globalAlpha = 1.0;
    });
  }

  updateGame(delta) {
    if (this.startTime === null || this.gameOver) {
      return;
    }

    this.controller.update(delta);

    for (const orb of this.orbs) {
      orb.update(delta);

      if (orb.isCollected) {
        this.orbsCollected += 1;
        this.orbs = this.orbs.filter((o) => o !== orb);
        console.log(`Orb collected: ${this.orbsCollected} / ${this.totalOrbs}`);
      }
    }

    for (const orbP of this.powerUpOrbs) {
      orbP.update(delta);
    }

    var deleteUUIDs = [];

    for (var entityUUID in this.entities) {
      var entity = this.entities[entityUUID];

      entity.update(delta);

      if (entity.delete) {
        deleteUUIDs.push(entityUUID);
      }
    }

    for (var entityUUID of deleteUUIDs) {
      delete this.entities[entityUUID];
    }

    for (const entityUUID in this.entities) {
      const entity = this.entities[entityUUID];

      if (this.checkCollision(this.player, entity)) {
        this.player.knockback(); // Trigger knockback animation
        console.log("Player collided with NPC, triggering knockback!");
      }
    }

    this.player.update(delta);
    this.particleSystem.update(delta);
    this.camera.update(delta);

    if (this.player.y < this.maxHeightReached) {
      this.maxHeightReached = this.player.y;
    }

    const currentTime = (performance.now() - this.startTime) / 1000;
    if (currentTime >= this.timeLimit) {
      this.endGame();
      return;
    }
  }
  checkCollision(player, entity) {
    return (
      player.x < entity.x + entity.w &&
      player.x + player.w > entity.x &&
      player.y < entity.y + entity.h &&
      player.y + player.h > entity.y
    );
  }

  endGame() {
    this.gameOver = true;
    this.active = false; // Add this line
    this.endTime = performance.now();

    const heightPoints = Math.floor(this.levelHeight - this.maxHeightReached);
    const orbPoints = this.orbPointsCollected;
    const score = heightPoints + orbPoints;
    const collectedEnoughOrbs = this.orbsCollected >= 20;
    const highScore = localStorage.getItem("highScore") || 0;
    const isNewHighScore = !highScore || score > parseInt(highScore);

    if (isNewHighScore) {
      localStorage.setItem("highScore", score);
    }

    if (this.onGameEnd) {
      this.onGameEnd({
        score,
        heightPoints,
        orbPoints,
        orbsCollected: this.orbsCollected,
        collectedEnoughOrbs,
        isNewHighScore,
        highScore: parseInt(localStorage.getItem("highScore")) || 0,
      });
    }

    this.resetGame();
  }

  resetGame() {
    this.gameOver = false;

    this.player.x = this.levelWidth / 2;
    this.player.y = this.levelHeight - 12;

    this.orbs = [];
    this.orbsCollected = 0;
    this.placeOrbs();

    this.startTime = null;
    this.endTime = null;

    this.maxHeightReached = this.player.y;
  }

  placeOrbs() {
    console.log("placeOrbs() called");

    this.totalOrbs = 0;
    this.orbPointsCollected = 0;
    for (const pos of this.manualOrbPositions) {
      const { x, y, type } = pos;

      if (this.map[this.convertCoordinatesToIndex(x, y)] === 0) {
        this.addOrb(x, y, type);
        this.totalOrbs += 1;
      }
    }

    const powerUpX = 10;
    const powerUpY = 328;
    this.addPowerUpOrb(powerUpX, powerUpY);
  }
}
