# 🥔 PotatoAI — AI-Powered Potato Disease Detection

Detect potato plant diseases instantly by uploading a leaf photo. Powered by a **TensorFlow CNN** model with **99%+ accuracy**, a **FastAPI** backend, and a modern **React** frontend.

---

## ✨ Features

- **Instant Classification** — Upload a leaf image and get results in under 1 second
- **3 Disease Classes** — Healthy, Early Blight, Late Blight
- **Confidence Score** — Animated confidence bar with severity-based color coding
- **Drag & Drop** — Modern drag-and-drop upload with file browser fallback
- **Treatment Info** — Actionable diagnosis descriptions for each disease
- **Responsive** — Works on desktop, tablet, and mobile
- **Dark Mode UI** — Premium glassmorphism design with smooth animations

---

## 🏗️ Tech Stack

| Layer      | Technology                      |
| ---------- | ------------------------------- |
| ML Model   | TensorFlow / Keras (CNN)        |
| Backend    | FastAPI + Uvicorn               |
| Frontend   | React 17 + Vanilla CSS          |
| Deployment | Vercel (frontend) + GCP (model) |

---

## 📂 Project Structure

```
├── api/                    # FastAPI backend
│   ├── main.py             # Prediction endpoint
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── App.js          # Main application component
│   │   └── index.css       # Complete design system
│   └── package.json
├── training/               # Model training notebooks
├── saved_models/           # TensorFlow SavedModel format
├── tf-lite-models/         # TFLite for mobile
├── mobile-app/             # React Native mobile app
├── gcp/                    # Google Cloud Function deployment
├── potatoes.h5             # Trained Keras model
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ (v22 supported with `--openssl-legacy-provider`)
- **Python** 3.8+
- **pip** or **venv**

### 1. Start the backend

Navigate to the `api` folder, install the dependencies, and run the FastAPI server:

```bash
cd api
pip install -r requirements.txt
python main.py
```

The API server starts at `http://localhost:8000`.

### 2. Start the frontend

Navigate to the `frontend` folder, install the dependencies, and run the React development server:

```bash
cd frontend
npm install
npm start
```

> **Node.js v18+**: If you see an OpenSSL error, run:
> ```bash
> # Windows PowerShell
> $env:NODE_OPTIONS="--openssl-legacy-provider"; npm start
>
> # macOS/Linux
> NODE_OPTIONS=--openssl-legacy-provider npm start
> ```

The app opens at `http://localhost:3000`.

---

## 🌐 Deploy Frontend

You can deploy the `frontend/` folder to any static hosting service:

- **Vercel**: Connect your GitHub repo and set the root to `frontend/`
- **Netlify**: Drag and drop the `frontend/build/` folder after running `npm run build`
- **GitHub Pages**: Use the `gh-pages` npm package

Remember to set the `REACT_APP_API_URL` environment variable to your deployed API URL.

---

## ☁️ Deploy to Google Cloud Platform (Backend)

The repository contains a `gcp/` directory configured to deploy the model prediction API as a serverless **Google Cloud Function**:

1. **Upload Model to Google Cloud Storage (GCS)**:
   - Create a bucket on GCP.
   - Upload `potatoes.h5` to `models/potatoes.h5` in your bucket.
   - Update `BUCKET_NAME` in `gcp/main.py` with your bucket name.

2. **Deploy to GCP Cloud Functions**:
   Using the `gcloud` CLI, deploy the function from the `gcp` directory:
   ```bash
   cd gcp
   gcloud functions deploy predict \
     --runtime python37 \
     --trigger-http \
     --allow-unauthenticated \
     --memory 512MB
   ```

3. **Link Frontend to Cloud Function**:
   Once deployed, update the `REACT_APP_API_URL` env variable in the frontend `.env` to use the Cloud Function HTTP Trigger URL.

---

## 🧪 API Endpoints

| Method | Endpoint   | Description            |
| ------ | ---------- | ---------------------- |
| GET    | `/ping`    | Health check           |
| POST   | `/predict` | Upload image, get diagnosis |

### Example Request

```bash
curl -X POST http://localhost:8000/predict \
  -F "file=@leaf.jpg"
```

### Example Response

```json
{
  "class": "Early Blight",
  "confidence": 0.9847
}
```

---

---

## 📱 Mobile App (React Native)

The repository includes a React Native application inside `mobile-app/` for running PotatoAI on mobile devices.

### 🤖 Android Setup & Install

There are two ways to get/run the Android app:

#### Option A: Quick Install via Pre-built APK (No Setup Needed)
If you just want to install and test the app on a physical Android device:
1. Locate the prebuilt debug APK file on your computer at:
   `c:\Users\avina\OneDrive\Desktop\tensor\mobile-app\android\app\build\outputs\apk\debug\app-debug.apk`
2. Copy this `.apk` file to your Android device (via USB, email, Google Drive, etc.).
3. Open the `.apk` file on your device and install it (allow installation from unknown sources if prompted).

#### Option B: Build & Run from Source (Developer Setup)
1. Ensure you have **Android Studio** and **Android SDK** configured.
2. Navigate to the `mobile-app/` directory and install dependencies:
   ```bash
   cd mobile-app
   npm install
   ```
3. Create a `.env` file in `mobile-app/` and set your backend API URL:
   ```env
   URL=http://<YOUR_COMPUTER_IP>:8000/predict
   ```
   *Note: If using the Android Emulator, use `http://10.0.2.2:8000/predict`.*
4. Start Metro bundler:
   ```bash
   npm start
   ```
5. Run the app:
   ```bash
   npm run android
   ```

---

### 🍏 iOS Setup (macOS & Xcode Required)

Due to Apple security restrictions, iOS apps must be compiled locally using Xcode on macOS:
1. Install **CocoaPods** on your macOS machine.
2. Navigate to `mobile-app/` and install npm dependencies:
   ```bash
   npm install
   ```
3. Install iOS CocoaPods dependencies:
   ```bash
   cd ios && pod install && cd ..
   ```
4. Configure the API URL in `.env` (use your computer's local network IP address).
5. Open the workspace in Xcode:
   ```bash
   open ios/mlDemo.xcworkspace
   ```
6. Build and run the app from Xcode on a connected iOS device or the iOS Simulator, or run:
   ```bash
   npm run ios
   ```

---

## 🧠 Model Details

- **Architecture**: Convolutional Neural Network (CNN)
- **Framework**: TensorFlow / Keras
- **Input**: 256×256 RGB images
- **Output**: 3-class softmax (Healthy, Early Blight, Late Blight)
- **Training Data**: PlantVillage dataset

---

## 📄 License

This project is for educational purposes.
