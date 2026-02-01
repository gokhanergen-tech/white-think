class Cursor {
  constructor(image) {
    this.image = image;
  }

  draw(ctx, mousePos) {
    ctx.save();
    ctx.shadowColor = "red";
    ctx.shadowBlur = 15;

    ctx.drawImage(this.image, mousePos.x, mousePos.y - 11, 11, 11)
    ctx.restore();
  }
}