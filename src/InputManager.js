export default class InputManager {
  constructor() {
    this.keyboard = Object.create(null);
    this.keypress = Object.create(null);
    this.mouse = Object.create(null);
    this.mousePress = Object.create(null);

    this.mousePos = [];
    this.mouseMoved = true;
    this.events = [];
  }

  addEventListener(eventName, cb) {
    window.addEventListener(eventName, cb);
    this.events.push([eventName, cb]);
  }

  start() {
    this.addEventListener("keydown", (e) => {
      this.handleKeyEvent(e.key, true);
    });

    this.addEventListener("keyup", (e) => {
      this.handleKeyEvent(e.key, false);
    });

    this.addEventListener("mousedown", (e) => {
      this.handleMouseEvent(e.button, true);
    });

    this.addEventListener("mouseup", (e) => {
      this.handleMouseEvent(e.button, false);
    });

    this.addEventListener("mousemove", (e) => {
      this.mousePos = [e.pageX, e.pageY];
      this.mouseMoved = true;
    });
  }

  end() {
    this.events.forEach((event) => {
      window.removeEventListener(event[0], event[1]);
    });

    this.events = [];
  }

  getMousePosition() {
    return this.mousePos;
  }

  mouseToButton(str) {
    if (str === "left") {
      return 0;
    }
    if (str === "right") {
      return 2;
    }

    return parseInt(str);
  }

  isMouseMove() {
    if (this.mouseMoved) {
      this.mouseMoved = false;
      return true;
    }

    return false;
  }

  isKeyDown(char) {
    var keyCode = char.toString().toLowerCase();

    return !!this.keyboard[keyCode];
  }

  isKeyPressed(char) {
    var keyCode = char.toString().toLowerCase();

    var output = this.keypress[keyCode];
    if (output) {
      this.keypress[keyCode] = false;
    }

    return output;
  }

  isMouseDown(str) {
    return this.mouse[this.mouseToButton(str)];
  }

  isMousePressed(str) {
    var button = this.mouseToButton(str);

    var output = this.mousePress[button];
    if (output) {
      this.mousePress[button] = false;
    }

    return output;
  }
  setKeyDown(key) {
    const keyCode = key.toString().toLowerCase();
    if (!this.keyboard[keyCode]) {
      this.keyboard[keyCode] = true;
      this.keypress[keyCode] = true;
    }
  }

  setKeyUp(key) {
    const keyCode = key.toString().toLowerCase();
    this.keyboard[keyCode] = false;
  }

  setMouseDown(button) {
    const btn = this.mouseToButton(button);
    if (!this.mouse[btn]) {
      this.mouse[btn] = true;
      this.mousePress[btn] = true;
    }
  }

  setMouseUp(button) {
    const btn = this.mouseToButton(button);
    this.mouse[btn] = false;
  }

  handleKeyEvent(char, state) {
    var keyCode = char.toString().toLowerCase();

    if (state && this.keyboard[keyCode]) {
      return;
    }
    this.keyboard[keyCode] = state;
    this.keypress[keyCode] = state;
  }

  handleMouseEvent(button, state) {
    this.mouse[button] = state;
    this.mousePress[button] = state;
  }
}
