import os
import shutil

NEW_DATASET_PATH = r"C:\Users\avina\.cache\kagglehub\datasets\rashikrahmanpritom\plant-disease-recognition-dataset\versions\1\Train\Train"
# We will pass the old dataset path when it finishes downloading
COMBINED_DATASET_PATH = r"C:\Users\avina\OneDrive\Desktop\tensor\combined_dataset"

def copy_images(src_dir, dest_dir):
    os.makedirs(dest_dir, exist_ok=True)
    if not os.path.exists(src_dir):
        print(f"Source dir does not exist: {src_dir}")
        return
    for img in os.listdir(src_dir):
        src_path = os.path.join(src_dir, img)
        dest_path = os.path.join(dest_dir, img)
        if os.path.isfile(src_path):
            if not os.path.exists(dest_path):
                shutil.copy2(src_path, dest_path)

def merge_datasets(old_dataset_path):
    print("Creating combined dataset at:", COMBINED_DATASET_PATH)
    
    # New Dataset Classes: Healthy, Powdery, Rust
    for cls in ["Healthy", "Powdery", "Rust"]:
        src = os.path.join(NEW_DATASET_PATH, cls)
        dest = os.path.join(COMBINED_DATASET_PATH, cls)
        copy_images(src, dest)
        
    # Old Dataset (PlantVillage)
    # Finding Potato classes
    plantvillage_classes = os.listdir(old_dataset_path)
    for p_class in plantvillage_classes:
        if "Potato" in p_class:
            src = os.path.join(old_dataset_path, p_class)
            # rename class nicely
            if "healthy" in p_class.lower():
                # Merge into the single Healthy class
                dest = os.path.join(COMBINED_DATASET_PATH, "Healthy")
            elif "early" in p_class.lower():
                dest = os.path.join(COMBINED_DATASET_PATH, "Potato_Early_Blight")
            elif "late" in p_class.lower():
                dest = os.path.join(COMBINED_DATASET_PATH, "Potato_Late_Blight")
            else:
                dest = os.path.join(COMBINED_DATASET_PATH, p_class)
                
            print(f"Merging {p_class} into {os.path.basename(dest)}")
            copy_images(src, dest)
            
    print("Merge complete! Classes:")
    print(os.listdir(COMBINED_DATASET_PATH))

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        merge_datasets(sys.argv[1])
    else:
        print("Please provide old dataset path")
