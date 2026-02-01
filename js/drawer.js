class Drawer {

    lineWidth = 1*2;
    currentPixels = null;
    color = "black"

    stack = []
    stackMax = 21
    currentIndex = 0;

    constructor(mouse) {
        this.mouse = mouse;
        this.ctx = this.mouse.canvas.getContext("2d", { willReadFrequently: true })


        this.widthSelect = document.getElementById("width-select");
        let i = 1;
        for (; i < 101; i++) {
            const option = document.createElement("option")
            option.text=i;
            this.widthSelect.append(option)
        }

        this.widthSelect.onchange = (e) => {
            const value = parseInt(e.target.value);
            this.lineWidth = value*2
        }

        const textColor = getObjectByID("textColor");
        textColor.addEventListener("input", (e) => {
            this.color = e.target.value;
        })
    }

    createLineEquation(point1, point2) {

        let x0 = point1.x;
        let x1 = point2.x;
        let y0 = point1.y;
        let y1 = point2.y;


        var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
        var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
        var err = (dx > dy ? dx : -dy) / 2;
        while (true) {
            this.drawPoint({ x: x0, y: y0, lineWidth: this.lineWidth })
            if (x0 === x1 && y0 === y1) break;
            var e2 = err;
            if (e2 > -dx) { err -= dy; x0 += sx; }
            if (e2 < dy) { err += dx; y0 += sy; }
        }
    }

    save(point, point2) {
        if (point) {

            this.createLineEquation(point, point2)
            this.snapshot();
        }

    }

    snapshot() {
        this.currentPixels = this.ctx.getImageData(0, 0, this.mouse.canvas.width, this.mouse.canvas.height);
    }

    saveHistory() {


        let maxIndex = this.stack.length - 1;
        if (this.currentIndex < maxIndex) {
            this.stack.splice(this.currentIndex + 1)
        }
        this.stack.push(this.currentPixels)


        if (this.stack.length === this.stackMax) {
            this.stack.shift();
            this.currentIndex = this.stack.length - 1;
        } else {
            maxIndex = this.stack.length === 1 ? 1 : this.stack.length - 1;
            this.currentIndex = maxIndex;
        }
    }

    clearTracer() {
        this.tracer = []
    }

    draw() {
        this.ctx.putImageData(this.currentPixels, 0, 0);
    }

    undo() {

        if (this.currentIndex > 0 && this.stack.length >= this.currentIndex) {


            this.currentIndex -= 1;
            this.currentPixels = this.stack[this.currentIndex];
        }
    }

    redo() {
        if (this.currentIndex < this.stack.length - 1) {
            this.currentIndex += 1;
            this.currentPixels = this.stack[this.currentIndex];
        }
    }


    drawPoint(startPoint) {

        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;

        //Bak

        this.ctx.roundRect(startPoint.x-startPoint.lineWidth / 2, startPoint.y-startPoint.lineWidth / 2, startPoint.lineWidth, startPoint.lineWidth, startPoint.lineWidth / 2);

        this.ctx.fill()

    }



}