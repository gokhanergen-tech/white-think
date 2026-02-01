class TextCursor {
   text = ""
   position = {}
   font = "16px Arial"
   align = "start"
   cursorIndex=0;

   constructor(position) {
      this.position = position;
   }

   update(key) {
      if(key.length===1){
         this.text+=key;
         this.cursorIndex++;
      }
      
      if(key==="Backspace"&&this.text.length>0){
         this.text=this.text.slice(0,this.text.length-1)
         this.cursorIndex--;
      }
   }

   draw(ctx,color) {
      ctx.save();
      ctx.font = this.font;
      ctx.fillStyle = color;
      ctx.textAlign = this.align;
      ctx.fillText(this.text, this.position.x,this.position.y);
      ctx.restore();
   }
}