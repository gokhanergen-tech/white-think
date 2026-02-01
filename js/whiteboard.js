const toolbarInit = {
  eraser: false,
  pencil: false,
  text: false,
  shapes: false,
};

class WhiteBoard {
  firstPos = null;
  lastPos = null;
  updatedColor = false;
  text = null;
  isCleared = false;

  clearCanvas() {
    this.isCleared = true;
  }

  updateToolbar(key, value) {
    let copiedToolbar = {
      ...toolbarInit,
    };

    copiedToolbar[key] = value;
    this.toolbar = copiedToolbar;
  }

  initDom() {
    const pencilSvg = getObjectByID("pencil");
    const eraserSvg = getObjectByID("eraser");
    const textMode = getObjectByID("textMode");
    const clearButton = getObjectByID("clearButton");
    const shapesButton = getObjectByID("shapes-wrapper");

    pencilSvg.classList.add("active-toolbar-button");

    const cursorNone = () => {
      this.mouse.canvas.style.cursor = "none";
    };

    eraserSvg.onclick = (e) => {
      if (pencilSvg.classList.contains("active-toolbar-button"))
        pencilSvg.classList.remove("active-toolbar-button");
      e.target.classList.add("active-toolbar-button");

      this.initializationText();
      cursorNone();
      this.updateToolbar("eraser", true);
    };

    pencilSvg.onclick = (e) => {
      if (eraserSvg.classList.contains("active-toolbar-button"))
        eraserSvg.classList.remove("active-toolbar-button");
      e.target.classList.add("active-toolbar-button");
      this.initializationText();
      cursorNone();
      this.updateToolbar("pencil", true);
    };

    textMode.onclick = (e) => {
      this.updateToolbar("text", true);
      this.mouse.canvas.style.cursor = "text";
    };

    shapesButton.onclick = (e) => {
      this.updateToolbar("shapes", true);
      this.initializationText();
      this.mouse.canvas.style.cursor = "crosshair";
    };

    clearButton.onclick = (e) => {
      this.isCleared = true;
    };
  }

  constructor(mouse, bgcolor) {
    this.initDom();
    this.mouse = mouse;

    this.mouse.initialize();

    this.bgcolor = bgcolor;
    this.updateToolbar("pencil", true);

    const icon = new Image();
    icon.src = "../assets/icons/pencil.svg";

    this.drawer = new Drawer(this.mouse);
    this.cursor = new Cursor(icon);
    this.eraser = new Eraser(this.bgcolor);
    this.keyboard = new Keyboard();

    this.shapes = new Shapes(mouse);
    this.mouse.onDragUp = () => {};
  }

  initializationText() {
    if (this.toolbar.text) {
      this.text = null;
      this.toolbar.text = false;
    }
  }

  update() {
    if (this.keyboard.ctrlZ) {
      this.drawer.undo();
      this.keyboard.ctrlZ = false;
    }

    if (this.keyboard.ctrlY) {
      this.drawer.redo();
      this.keyboard.ctrlY = false;
    }

    if (this.toolbar.shapes) {
      this.shapes.update(this.drawer.lineWidth, this.drawer.color);
    }
  }

  draw(ctx) {
    if (!this.drawer.currentPixels || this.isCleared) {
      this.isCleared = false;
      ctx.fillStyle = this.bgcolor;
      ctx.fillRect(0, 0, this.mouse.canvas.width, this.mouse.canvas.height);
      this.drawer.snapshot();
      this.drawer.saveHistory();
    }

    this.drawer.draw();
    if (this.updatedColor) {
      this.drawer.snapshot();
      this.updatedColor = false;
    }

    if (this.toolbar.pencil) {
      if (this.mouse.isDrag) {
        this.lastPos = { ...this.mouse.currentPos };

        if (!this.firstPos) {
          this.firstPos = { ...this.mouse.currentPos };
        }

        this.drawer.save(this.firstPos, {
          ...this.lastPos,
          lineWidth: this.drawer.lineWidth,
        });

        this.firstPos = { ...this.mouse.currentPos };
      } else {
        this.firstPos = null;
      }
      this.cursor.draw(ctx, this.mouse.currentPos);
    } else if (this.toolbar.eraser) {
      if (this.mouse.isDrag) {
        this.eraser.controlAndDelete(this.mouse.currentPos, ctx);
        this.drawer.snapshot();
      }
      this.eraser.draw(ctx, this.mouse.currentPos);
    } else if (this.toolbar.text) {
      if (this.mouse.click && !this.text) {
        this.mouse.click = false;
        this.mouse.canvas.style.cursor = "none";
        this.text = new TextCursor(this.mouse.currentPos);
      } else if (this.mouse.click) {
        this.mouse.click = false;
      }
      const key = this.keyboard.getCurrentKey();

      if (key) {
        this.keyboard.currentKey = null;

        if (key === "Escape") {
          this.initializationText();
          this.toolbar.pencil = true;
        }

        if (this.text) {
          this.drawer.snapshot();
          this.text.update(key);
        }
      }
      if (this.text) {
        this.text.draw(ctx, this.drawer.color);
        if (key === "Enter") {
          this.drawer.snapshot();
          this.drawer.saveHistory();
          this.initializationText();
          this.toolbar.pencil = true;
        }
      }
    } else if (this.toolbar.shapes) {
      this.shapes.draw(this.drawer);
    }

    if (this.mouse.click) {
      this.mouse.click = false;
      if (!this.toolbar.text) {
        this.drawer.saveHistory();
      }
    }
  }
}
