import sys
import torch
from PIL import Image
from io import BytesIO
import base64

from diffusers import StableDiffusionControlNetImg2ImgPipeline, ControlNetModel, UniPCMultistepScheduler

device = "cuda"

# ControlNet modeli: lineart veya scribble için kullanabileceğin hazır modellerden biri
controlnet = ControlNetModel.from_pretrained(
    "lllyasviel/control_v11p_sd15_scribble", torch_dtype=torch.float16
)

# Ana model: SD 2.1
pipe = StableDiffusionControlNetImg2ImgPipeline.from_pretrained(
    "sd-legacy/stable-diffusion-v1-5", 
    controlnet=controlnet,
  torch_dtype=torch.float16,
    safety_checker=None
)

pipe.scheduler = UniPCMultistepScheduler.from_config(pipe.scheduler.config)
pipe = pipe.to(device)

def img2img(base64_img, prompt_extra):
    # 1. Base64 string'ini bytes'a çevir
    img_data = base64.b64decode(base64_img)
    
    # 2. Bytes verisini PIL Image'a dönüştür
    img = Image.open(BytesIO(img_data)).convert("RGB")  # Siyah beyaz veya RGB hatası olmasın diye convert

    # 3. Prompt
    prompt = f"{prompt_extra}, using fine details, realistic, like only paper drawing, and artistic textures. No text, no signatures, no paper."
 
    images = pipe(
        prompt=prompt,
        image=img,   
       strength=0.15, guidance_scale=40,  
        control_image=img,   
        num_inference_steps=40
     ).images

    # 5. İşlenmiş görseli memory'de tutup base64'e çevir
    buffered = BytesIO()
    images[0].save(buffered, format="JPEG")
    buffered.seek(0)
    
    img_base64 = base64.b64encode(buffered.read()).decode("utf-8")
    
    torch.cuda.empty_cache()

    return img_base64

if __name__ == "__main__":
    fileName = sys.argv[1]
    question = sys.argv[2]
    
    with open(fileName) as f:
        output = img2img(f.read(), question)
    
    print(f"data:image/jpeg;base64,{output}")
