import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./index.css";

const DISEASE_INFO = {
  "Healthy": {
    displayName: "Healthy",
    emoji: "🌿",
    color: "healthy",
    infoClass: "",
    description: "Your plant is in excellent health! No signs of disease detected. Continue your current care routine — proper watering, sunlight, and nutrient management.",
  },
  "Potato_Early_Blight": {
    displayName: "Early Blight",
    emoji: "🟠",
    color: "disease",
    infoClass: "warn",
    description: "Early Blight (Alternaria solani) causes dark brown spots with concentric rings on lower leaves. Treat with copper-based fungicide and remove affected foliage promptly.",
  },
  "Potato_Late_Blight": {
    displayName: "Late Blight",
    emoji: "🔴",
    color: "late-blight",
    infoClass: "danger",
    description: "Late Blight (Phytophthora infestans) is a severe disease causing water-soaked grayish-green lesions. Immediate treatment with systemic fungicide is critical to prevent crop loss.",
  },
  "Powdery": {
    displayName: "Powdery Mildew",
    emoji: "🌫️",
    color: "powdery",
    infoClass: "warn",
    description: "Powdery Mildew appears as white, powdery fungal spots on leaves. Ensure good air circulation, avoid overhead watering, and apply sulfur-based fungicides if needed.",
  },
  "Rust": {
    displayName: "Rust",
    emoji: "🍂",
    color: "disease",
    infoClass: "danger",
    description: "Rust fungus forms orange or reddish-brown pustules on leaves. Remove infected parts immediately and treat with appropriate fungicides to stop spreading.",
  },
};

function getConfidenceLevel(conf) {
  if (conf >= 85) return "high";
  if (conf >= 60) return "medium";
  return "low";
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [barWidth, setBarWidth] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const uploadRef = useRef(null);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Preview URL
  useEffect(() => {
    if (!selectedFile) { setPreview(null); return; }
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  // Auto-send on file select
  useEffect(() => {
    if (!preview || !selectedFile) return;
    setIsLoading(true);
    setData(null);
    setError(null);
    const formData = new FormData();
    formData.append("file", selectedFile);
    axios.post(process.env.REACT_APP_API_URL || "http://localhost:8000/predict", formData)
      .then(res => { if (res.status === 200) setData(res.data); })
      .catch(err => {
        console.error("Prediction failed:", err);
        setError("Cannot reach the API server. Make sure the backend is running on port 8000.");
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);

  // Animate confidence bar
  useEffect(() => {
    if (data) {
      const t = setTimeout(() => setBarWidth((parseFloat(data.confidence) * 100).toFixed(2)), 150);
      return () => clearTimeout(t);
    }
    setBarWidth(0);
  }, [data]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setSelectedFile(file);
    setData(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreview(null);
    setData(null);
    setIsLoading(false);
    setBarWidth(0);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const confidence = data ? parseFloat((parseFloat(data.confidence) * 100).toFixed(2)) : 0;
  const confLevel = getConfidenceLevel(confidence);
  const diseaseInfo = data ? DISEASE_INFO[data.class] || DISEASE_INFO["Healthy"] : null;

  return (
    <>
      {/* ─── NAVBAR ─── */}
      <nav className={`navbar ${navScrolled ? "scrolled" : ""}`}>
        <div className="navbar-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="navbar-icon">🥔</div>
          <span className="navbar-title">UniversalPlant<span>AI</span></span>
        </div>

        <div className="navbar-links">
          <span className="navbar-link" onClick={scrollToUpload}>Analyze</span>
          <a className="navbar-link" href="#how-it-works">How It Works</a>
          <a className="navbar-link" href="#diseases">Diseases</a>
          <a className="navbar-link" href="#tech">Tech Stack</a>
        </div>

        <div className="navbar-badge">Live Model</div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="hero-content">
          <div className="hero-tag">
            <span className="hero-tag-dot" />
            AI-Powered Plant Diagnostics
          </div>

          <h1 className="hero-headline">
            Detect Potato & Apple Diseases<br />
            <span className="highlight">Instantly with AI</span>
          </h1>

          <p className="hero-sub">
            Upload a photo of your potato or apple leaf and receive instant disease classification powered by a convolutional neural network trained on thousands of samples.
          </p>

          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-value">5</div>
              <div className="stat-label">Leaf Conditions</div>
              <div className="stat-sub">Healthy · Early Blight · Late Blight · Powdery · Rust</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">3</div>
              <div className="stat-label">Native Platforms</div>
              <div className="stat-sub">Web · Android · iOS</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">&lt;1s</div>
              <div className="stat-label">Live Inference</div>
              <div className="stat-sub">Real-time CNN pipeline</div>
            </div>
          </div>

          {/* ─── UPLOAD SECTION ─── */}
          <div className="upload-section" ref={uploadRef}>
            {!preview && !isLoading && (
              <div
                className={`upload-card ${dragOver ? "drag-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="upload-icon-wrap">🍃</div>
                <div className="upload-title">Drop your leaf image here</div>
                <p className="upload-sub">
                  Drag &amp; drop a clear photo of your potato or apple leaf,<br />
                  or click below to browse your files.
                </p>
                <button className="upload-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  📂 Browse Files
                </button>
                <p className="upload-hint">
                  Supports JPG, PNG, WEBP · Max 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="file-input-hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>
            )}

            {isLoading && (
              <div className="loading-card">
                <div className="spinner-container">
                  <div className="spinner-ring" />
                  <div className="spinner-ring-inner" />
                </div>
                <div className="loading-title">Analyzing Leaf...</div>
                <p className="loading-sub">Running AI inference<span className="loading-dots"></span></p>
              </div>
            )}

            {/* API Error */}
            {error && !isLoading && (
              <div className="upload-card" style={{borderColor: 'rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.04)', cursor: 'default'}}>
                <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>⚠️</div>
                <div className="upload-title" style={{color: '#f87171'}}>API Connection Failed</div>
                <p className="upload-sub">{error}</p>
                <button className="upload-btn" style={{background: 'linear-gradient(135deg,#ef4444,#b91c1c)'}} onClick={clearAll}>↩ Try Again</button>
              </div>
            )}

            {preview && data && !isLoading && (
              <div className="result-card">
                <div className="result-image-wrap">
                  <img src={preview} alt="Uploaded leaf" className="result-image" />
                  <div className="result-image-overlay" />
                  <div className="result-badge">Analysis Complete</div>
                </div>

                <div className="result-body">
                  <div className="result-label-row">
                    <div className={`result-class-name ${diseaseInfo?.color}`}>
                      {diseaseInfo?.emoji} {diseaseInfo?.displayName || data.class}
                    </div>
                    <div className="result-confidence-chip">
                      <span className={`confidence-dot ${confLevel === "high" ? "" : confLevel}`} />
                      {confidence}%
                    </div>
                  </div>

                  <div className="confidence-bar-wrap">
                    <div className="confidence-bar-label">
                      <span>Model Confidence</span>
                      <span>{confidence}%</span>
                    </div>
                    <div className="confidence-bar-track">
                      <div
                        className={`confidence-bar-fill ${confLevel === "high" ? "" : confLevel}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>

                  <div className={`disease-info ${diseaseInfo?.infoClass}`}>
                    <div className="disease-info-title">Diagnosis</div>
                    {diseaseInfo?.description}
                  </div>

                  <div className="btn-row">
                    <button className="btn-clear" onClick={clearAll}>✕ Clear</button>
                    <button className="btn-another" onClick={clearAll}>＋ Analyze Another</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <div className="section-sep" />
      <section className="section-container" id="how-it-works">
        <div className="section-header">
          <div className="section-tag">How It Works</div>
          <h2 className="section-title">Three Simple Steps</h2>
          <p className="section-sub">
            Our AI pipeline uses a convolutional neural network trained on plant pathology datasets to classify leaf images in under a second.
          </p>
        </div>

        <div className="steps-grid">
          {[
            { n: "01", icon: "📸", title: "Upload a Photo", desc: "Take or upload a clear photo of a plant leaf. We support JPG, PNG, and WEBP formats." },
            { n: "02", icon: "🧠", title: "AI Analysis", desc: "Our TensorFlow CNN model analyzes visual patterns, textures, and color distributions to identify disease markers." },
            { n: "03", icon: "📊", title: "Get Results", desc: "Receive an instant diagnosis with a confidence score and actionable treatment recommendations." },
          ].map(s => (
            <div className="step-card" key={s.n}>
              <div className="step-number">{s.n}</div>
              <div className="step-icon">{s.icon}</div>
              <div className="step-title">{s.title}</div>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── DISEASE CLASSES ─── */}
      <div className="section-sep" />
      <section className="section-container" id="diseases">
        <div className="section-header">
          <div className="section-tag">Disease Classes</div>
          <h2 className="section-title">What We Detect</h2>
          <p className="section-sub">
            Our model classifies plant leaves into five categories based on visual symptoms.
          </p>
        </div>

        <div className="diseases-grid">
          {[
            { cls: "healthy-card", emoji: "🌿", name: "Healthy", nc: "green", desc: "Vibrant green leaves with no spots, lesions, or discoloration. The plant is thriving and disease-free." },
            { cls: "early-card", emoji: "🍂", name: "Potato Early Blight", nc: "orange", desc: "Dark brown spots with concentric rings and yellow halos on lower leaves, caused by Alternaria solani fungus." },
            { cls: "late-card", emoji: "🍁", name: "Potato Late Blight", nc: "red", desc: "Water-soaked grayish-green lesions caused by Phytophthora infestans. Can devastate entire crops rapidly." },
            { cls: "powdery-card", emoji: "🌫️", name: "Powdery Mildew", nc: "orange", desc: "White, powdery fungal spots on leaves. Requires good air circulation and sulfur-based treatments." },
            { cls: "rust-card", emoji: "🍄", name: "Rust", nc: "red", desc: "Orange or reddish-brown pustules on leaves. Spreads easily and requires immediate fungicide application." },
          ].map(d => (
            <div className={`disease-card ${d.cls}`} key={d.name}>
              <div className="disease-emoji">{d.emoji}</div>
              <div className={`disease-name ${d.nc}`}>{d.name}</div>
              <p className="disease-desc">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TECH STACK ─── */}
      <div className="section-sep" />
      <section className="section-container" id="tech">
        <div className="section-header">
          <div className="section-tag">Tech Stack</div>
          <h2 className="section-title">Built with Modern Tools</h2>
          <p className="section-sub">
            A full-stack AI application leveraging the latest in machine learning and web technologies.
          </p>
        </div>

        <div className="tech-grid">
          {[
            { icon: "🧠", name: "TensorFlow", desc: "Deep learning model training & inference" },
            { icon: "⚡", name: "FastAPI", desc: "High-performance Python API backend" },
            { icon: "⚛️", name: "React", desc: "Interactive single-page frontend" },
            { icon: "☁️", name: "Vercel", desc: "Edge-optimized deployment" },
          ].map(t => (
            <div className="tech-card" key={t.name}>
              <div className="tech-icon">{t.icon}</div>
              <div className="tech-name">{t.name}</div>
              <p className="tech-desc">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <div className="section-sep" />
      <section className="cta-section">
        <div className="cta-card">
          <h2 className="cta-title">Ready to analyze your crop?</h2>
          <p className="cta-sub">
            Upload a photo of your plant leaf and get an instant AI-powered health report.
          </p>
          <button className="cta-btn" onClick={scrollToUpload}>
            🚀 Start Analyzing
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="footer">
        <div className="footer-copy">
          © {new Date().getFullYear()} <span>UniversalPlantAI</span> · AI-Powered Crop Health
        </div>
        <div className="footer-powered">
          Built with
          <span className="footer-tech">TensorFlow</span>
          <span className="footer-tech">FastAPI</span>
          <span className="footer-tech">React</span>
        </div>
      </footer>
    </>
  );
}
