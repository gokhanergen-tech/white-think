class Mouse{

    isDrag=false;
    currentPos={x:0,y:0}
   
    constructor(canvas,onDragUp){
        this.canvas=canvas;
        this.onDragUp=onDragUp;
    }

    mouseDown=(e)=>{
        this.isDrag=true;
        this.down=true;
    } 

    mouseMove=(e)=>{
        const pos=D(this.canvas,e);

        this.currentPos={
            x:pos.x<0||!pos.x?0:(pos.x>this.canvas.width?this.canvas.width:pos.x),
            y:pos.y<0||!pos.y?0:(pos.y>this.canvas.height?this.canvas.height:pos.y)
        };
    }

    mouseUp=(e)=>{
        this.isDrag=false;
        if(this.onDragUp && typeof this.onDragUp === "function")
         this.onDragUp();
        this.down=false;
    }

    mouseLeave=(e)=>{
        this.isDrag=false;
    }

    mouseClick=(e)=>{
        this.click=true;
    }

    initialize(){
        this.canvas.addEventListener("mousemove", this.mouseMove);
        this.canvas.addEventListener("mousedown", this.mouseDown);
        this.canvas.addEventListener("mouseup", this.mouseUp);
        this.canvas.addEventListener("mouseleave", this.mouseLeave);
        this.canvas.addEventListener("click", this.mouseClick);
        this.canvas.addEventListener("touchmove", this.mouseMove);
        this.canvas.addEventListener("touchstart", this.mouseDown);
        this.canvas.addEventListener("touchend", this.mouseUp);
    }

    clear(){
        this.canvas.removeEventListener("mousemove", this.mouseMove);
        this.canvas.removeEventListener("mouseup", this.mouseUp);
        this.canvas.removeEventListener("mousedown", this.mouseDown);
        this.canvas.removeEventListener("mouseleave", this.mouseLeave);
        this.canvas.removeEventListener("click", this.mouseClick);
        this.canvas.removeEventListener("touchmove", this.mouseMove);
        this.canvas.removeEventListener("touchstart", this.mouseDown);
        this.canvas.removeEventListener("touchend", this.mouseUp);
    }
}