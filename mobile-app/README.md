# 📱 UniversalPlantAI Mobile App (React Native)

This directory contains the React Native application for potato and apple disease prediction. It allows users to take a photo of a potato or apple leaf using their camera or select one from their gallery, sending it to the FastAPI backend server to get predictions.

---

## 🛠️ Prerequisites

To run this mobile app, you need:
1. **Node.js** (v16+) and **Yarn** (recommended).
2. **Android Setup**:
   - Install **Android Studio**.
   - Install the **Android SDK** and platform tools.
   - Configure your environment variables (e.g., `ANDROID_HOME`).
   - Create and launch an **Android Emulator** or connect a physical Android device with **USB debugging** enabled.

---

## 🚀 Step-by-Step Guide

### 1. Install dependencies
From the `mobile-app/` directory, run:
```bash
yarn install
# or
npm install
```

### 2. Configure the API URL
Create a file named `.env` in the `mobile-app` directory:
```env
URL=http://<YOUR_API_IP_ADDRESS>:8000/predict
```
- **If using the Android Emulator**: Use `http://10.0.2.2:8000/predict` (this maps to your local machine's localhost).
- **If using a physical Android device**: Use your computer's local Wi-Fi IP address (e.g., `http://192.168.1.XX:8000/predict`). You can find this by running `ipconfig` on Windows or `ifconfig` on macOS/Linux.

### 3. Ensure the Backend Server is running
Make sure your FastAPI server in the `api/` directory is running and bound to `0.0.0.0` (which allows external devices on the same network to connect).

### 4. Start the Metro Bundler
Start the React Native package bundler:
```bash
yarn start
# or
npm start
```

### 5. Launch on Android
Open a new terminal window, navigate to `mobile-app/`, and run:
```bash
yarn android
# or
npm run android
```
This will compile the app and launch it on your running emulator or connected device.
