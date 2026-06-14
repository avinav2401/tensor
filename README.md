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
├── potatoes.h5             # Trained Keras model
├── vercel.json             # Vercel deployment config
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

## 🌐 Deploy to Vercel (Frontend)

The project includes a `vercel.json` for one-click frontend deployment:

```bash
npm install -g vercel
cd frontend
vercel
```

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

The repository also includes a React Native mobile application for mobile testing. To run the app on Android or iOS:

1. Navigate to the `mobile-app` directory:
   ```bash
   cd mobile-app
   ```
2. Follow the detailed steps in the [Mobile App README](file:///c:/Users/avina/OneDrive/Desktop/tensor/mobile-app/README.md) to set up dependencies, configure your local API URL, and start the app on your emulator or device.

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
