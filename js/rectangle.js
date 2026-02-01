class Rectangle {
  #startPoint = null;
  #size = null;

  setStartPoint(position) {
    this.#startPoint = position;
  }

  calculate(endPoint) {
    this.#size = {
      width: endPoint.x - this.#startPoint.x,
      height: endPoint.y - this.#startPoint.y,
    };
  }

  draw(ctx) {
    if (this.#startPoint && this.#size) {
      ctx.beginPath();
      ctx.strokeStyle = this.color || "black";
      ctx.lineWidth = this.lineWidth;
      ctx.rect(
        this.#startPoint.x,
        this.#startPoint.y,
        this.#size.width,
        this.#size.height
      );
      ctx.stroke();
    }
  }

  clear() {
    this.#startPoint = null;
    this.#size = null;
  }

  getStartPoint() {
    return this.#startPoint;
  }

  getSize() {
    return this.#size;
  }
}
