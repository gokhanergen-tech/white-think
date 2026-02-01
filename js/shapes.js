class Shapes {
  #shapeId = "1";

  constructor(mouse) {
    //Shapes
    this.line = new Line();
    this.rectangle = new Rectangle();

    this.shapes = getObjectByID("shapes");
    this.mouse = mouse;
    this.ctx = this.mouse.canvas.getContext("2d");

    this.shapes.addEventListener("change", this.shapeChange.bind(this));
  }

  shapeChange(e) {
    this.#shapeId = e.target.value;
  }

  update(lineWidth, color) {
    if (this.mouse.down) {
      switch (this.#shapeId) {
        case "4":
          this.line.lineWidth = lineWidth;
          this.line.color = color;
          if (!this.line.getStartPoint()) {
            this.line.setStartPoint(this.mouse.currentPos);
          } else {
            this.line.setEndPoint(this.mouse.currentPos);
          }
          break;
        case "2":
          this.rectangle.lineWidth = lineWidth;
          this.rectangle.color = color;
          if (!this.rectangle.getStartPoint()) {
            this.rectangle.setStartPoint(this.mouse.currentPos);
          } else {
            this.rectangle.calculate(this.mouse.currentPos);
          }
          break;
      }
    }
  }

  draw(drawer) {
    if (!this.mouse.click) {
      switch (this.#shapeId) {
        case "4":
          this.line.draw(this.ctx);
          break;
        case "2":
          this.rectangle.draw(this.ctx);
          break;
      }
    }

    if (this.mouse.click) {
      switch (this.#shapeId) {
        case "4":
          this.line.draw(this.ctx);
          drawer.snapshot();
          this.line.clear();
          break;
        case "2":
          this.rectangle.draw(this.ctx);
          drawer.snapshot();
          this.rectangle.clear();
          break;
      }
    }
  }
}
