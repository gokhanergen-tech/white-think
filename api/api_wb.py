# fastapi_img2img.py
import base64
import datetime
from io import BytesIO
from fastapi import FastAPI, HTTPException,UploadFile, File, Form
from pydantic import BaseModel
from PIL import Image
import torch
from diffusers import StableDiffusionControlNetImg2ImgPipeline, ControlNetModel, UniPCMultistepScheduler

print("CUDA available:", torch.cuda.is_available())
print("CUDA device:", torch.cuda.get_device_name(0) if torch.cuda.is_available() else "None")

# Device ayarı
device = "cuda" if torch.cuda.is_available() else "cpu"

# ControlNet modeli
controlnet = ControlNetModel.from_pretrained(
    "lllyasviel/control_v11p_sd15_scribble",
    torch_dtype=torch.float16
)

# Ana model
pipe = StableDiffusionControlNetImg2ImgPipeline.from_pretrained(
    "sd-legacy/stable-diffusion-v1-5",
    controlnet=controlnet,
    torch_dtype=torch.float16
)
pipe.scheduler = UniPCMultistepScheduler.from_config(pipe.scheduler.config)
pipe = pipe.to(device)


# FastAPI app
app = FastAPI(title="img2img API")

# Request modeli
class Img2ImgRequest(BaseModel):
    base64_img: str
    prompt: str

# Endpoint
@app.post("/img2img")
def generate_img(  file: UploadFile = File(...),
    question: str = Form(...)):
    try:
        img = Image.open(file.file).convert("RGB")
        
        
        img.save(f"input.jpg")

        # Prompt
        prompt = f"{question}, using fine details, realistic, like only paper drawing, and artistic textures. No text, no signatures, no paper."
        
        print(f"Promt: {prompt}")
        print(file)

        # Pipeline çalıştır
        images = pipe(
            prompt=prompt,
            image=img,
            strength=0.4,
            guidance_scale=15,
            control_image=img,
            num_inference_steps=40
        ).images

        # Output base64
        buffered = BytesIO()
        images[0].save(buffered, format="JPEG")
        buffered.seek(0)
        img_base64 = base64.b64encode(buffered.read()).decode("utf-8")

        torch.cuda.empty_cache()
        
        images[0].save(f"input1.jpg")

        return {"response": f"data:image/jpeg;base64,{img_base64}"}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
