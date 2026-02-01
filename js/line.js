class Line {
  #startPoint = null;
  #endPoint = null;

  setStartPoint(startPoint) {
    this.#startPoint = startPoint;
  }

  setEndPoint(endPoint) {
    this.#endPoint = endPoint;
  }

  clear() {
    this.#endPoint = null;
    this.#startPoint = null;
  }

  draw(ctx) {
    if (this.#startPoint && this.#endPoint) {
      ctx.beginPath();
      ctx.lineWidth = this.lineWidth || 2;
      ctx.strokeStyle = this.color || "black";
      ctx.moveTo(this.#startPoint.x, this.#startPoint.y);
      ctx.lineTo(this.#endPoint.x, this.#endPoint.y);
      ctx.stroke();
    }
  }

  getStartPoint() {
    return this.#startPoint;
  }

  getEndPoint() {
    return this.#endPoint;
  }
}
