class Eraser{
    r=1*5

    constructor(bgcolor){
        this.sizeSelect=document.getElementById("eraser-size-select");
        this.sizeSelect.onchange=(e)=>{
            const value=parseInt(e.target.value);
            this.r=(value)*5
        }
        this.bgcolor=bgcolor;
    }

    //Bak
    controlAndDelete(currentPos,ctx){
        ctx.beginPath();
        ctx.fillStyle=this.bgcolor;
        ctx.arc(currentPos.x,currentPos.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
      /* for (let index = 0; index < points.length; index++) {
        const tracer = points[index];
        points[index]=tracer.filter(trace=>{
            const dX=Math.abs(currentPos.x-trace.x);
            const dY=Math.abs(currentPos.y-trace.y);
         
            if((dX*dX)+(dY*dY)<Math.pow(this.r,2))
              return false;
            return true;
        })
       }*/
    }

    draw(ctx,mousePosition){
        ctx.save();
        ctx.beginPath();
        ctx.arc(mousePosition.x,mousePosition.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }
}