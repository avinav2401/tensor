import os
import sys
from PIL import Image

def resize_and_save(image_path, base_res_path):
    try:
        img = Image.open(image_path).convert("RGBA")
        
        # Mipmap sizes for standard ic_launcher
        sizes = {
            'mipmap-mdpi': 48,
            'mipmap-hdpi': 72,
            'mipmap-xhdpi': 96,
            'mipmap-xxhdpi': 144,
            'mipmap-xxxhdpi': 192
        }
        
        for folder, size in sizes.items():
            folder_path = os.path.join(base_res_path, folder)
            os.makedirs(folder_path, exist_ok=True)
            
            # Resize image
            resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
            
            # Save square and round variants
            resized_img.save(os.path.join(folder_path, 'ic_launcher.png'))
            
            # For round icon, create a circular mask
            mask = Image.new('L', (size, size), 0)
            from PIL import ImageDraw
            draw = ImageDraw.Draw(mask)
            draw.ellipse((0, 0, size, size), fill=255)
            
            round_img = resized_img.copy()
            round_img.putalpha(mask)
            round_img.save(os.path.join(folder_path, 'ic_launcher_round.png'))
            
            print(f"Saved {size}x{size} to {folder}")
            
        print("Icons successfully updated!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    import glob
    # Find the newest generated icon
    brain_dir = r"C:\Users\avina\.gemini\antigravity-ide\brain\4335a11a-a969-4052-80e7-da93364fb608"
    icon_files = glob.glob(os.path.join(brain_dir, "potato_app_icon_*.png"))
    if not icon_files:
        print("Could not find the generated icon.")
        sys.exit(1)
        
    latest_icon = max(icon_files, key=os.path.getctime)
    
    res_path = os.path.join("mobile-app", "android", "app", "src", "main", "res")
    resize_and_save(latest_icon, res_path)
