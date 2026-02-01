const canvas = document.getElementById("whiteboard");
const root = canvas.parentElement;

if (canvas.getContext) {
  canvas.width = root.offsetWidth;
  canvas.height = root.offsetHeight;

  canvas.style.cursor = "none";
  const whiteBoard = new WhiteBoard(new Mouse(canvas), "white");

  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  const render = () => {
    ctx.save();
    whiteBoard.update();
    whiteBoard.draw(ctx);
    ctx.restore();
    window.requestAnimationFrame(render);
  };

  function askAI() {
    const dataURL = canvas.toDataURL("image/jpeg");

    const byteString = atob(dataURL.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: "image/jpeg" });

    // FormData oluştur
    const formData = new FormData();

    formData.append("file", blob); // Base64 verisini "image" adlı form verisi olarak ekleyin
    formData.append("question", document.getElementById("prompt").value);

    fetch("http://localhost:8085/img2img", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const base64Image = data.response;
        const img = new Image();
        img.src = base64Image;

        img.onload = function () {
          ctx.drawImage(img, 0, 0);
          whiteBoard.drawer.snapshot();
          whiteBoard.drawer.saveHistory();
        };
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  render();
}
