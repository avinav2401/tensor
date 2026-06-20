import kagglehub
import os
import shutil

# Download the PlantVillage dataset
print("Downloading PlantVillage dataset...")
try:
    pv_path = kagglehub.dataset_download("arjuntejaswi/plant-village")
    print("PlantVillage dataset downloaded to:", pv_path)
except Exception as e:
    print("Error downloading PlantVillage dataset:", e)
