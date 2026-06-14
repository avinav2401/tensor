import React, {useState} from 'react';
import {
  SafeAreaView,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  Platform,
  Dimensions,
  useColorScheme,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import PermissionsService, {isIOS} from './Permissions';

export const {height, width} = Dimensions.get('window');

const imagePickerOptions = {
  mediaType: 'photo',
  quality: 1,
  includeBase64: false,
};

// Disease info dictionary
const diseaseDetails = {
  'Early Blight': {
    cause: 'Alternaria solani (Fungus)',
    symptoms: 'Dark spots with concentric rings ("target board" look) on older leaves first.',
    treatment: 'Apply copper-based fungicides. Remove infected lower leaves, rotate crops, and avoid overhead watering.',
    severity: 'moderate',
  },
  'Late Blight': {
    cause: 'Phytophthora infestans (Oomycete)',
    symptoms: 'Large, dark, water-soaked spots on leaves. White mold appears under leaves in humid weather.',
    treatment: 'Apply fungicide immediately. Destroy heavily infected plants. Ensure dry spacing and plant resistant varieties.',
    severity: 'critical',
  },
  'Healthy': {
    cause: 'N/A',
    symptoms: 'Vibrant green leaves with no signs of fungal spots or discolored patches.',
    treatment: 'Continue regular monitoring, crop rotation, and healthy soil care to maintain plant vigor.',
    severity: 'healthy',
  },
};

const App = () => {
  const [confidence, setConfidence] = useState(null);
  const [label, setLabel] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  const getPrediction = async params => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', params);

    const url = Config.URL || 'http://192.168.0.105:8000/predict';

    const response = await axios.post(url, bodyFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
      timeout: 20000,
    });
    return response;
  };

  const manageCamera = async type => {
    try {
      if (type === 'Camera') {
        const hasPermission = await PermissionsService.hasCameraPermission();
        if (!hasPermission) {
          return;
        }
        openCamera();
      } else {
        const hasPermission = await PermissionsService.hasPhotoPermission();
        if (!hasPermission) {
          return;
        }
        openLibrary();
      }
    } catch (err) {
      console.log('Camera/Gallery selection error:', err);
    }
  };

  const openCamera = () => {
    launchCamera(imagePickerOptions, response => {
      handleImageResponse(response);
    });
  };

  const openLibrary = () => {
    launchImageLibrary(imagePickerOptions, response => {
      handleImageResponse(response);
    });
  };

  const handleImageResponse = async response => {
    if (response.didCancel) {
      return;
    }
    if (response.errorCode) {
      setLabel('Error: ' + response.errorMessage);
      return;
    }
    if (!response.assets || response.assets.length === 0) {
      return;
    }

    const asset = response.assets[0];
    await getResult(asset.uri, asset);
  };

  const clearOutput = () => {
    setConfidence(null);
    setLabel('');
    setImage('');
  };

  const getResult = async (uri, asset) => {
    setImage(uri);
    setLoading(true);
    setLabel('');
    setConfidence(null);

    const params = {
      uri: uri,
      name: asset.fileName || 'photo.jpg',
      type: asset.type || 'image/jpeg',
    };

    try {
      const res = await getPrediction(params);
      if (res?.data?.class) {
        setLabel(res.data.class);
        setConfidence(res.data.confidence * 100);
      } else {
        setLabel('Unable to analyze image.');
      }
    } catch (error) {
      console.log('Backend request error:', error);
      const msg =
        error?.response?.data?.detail ||
        error?.message ||
        'Server unreachable. Check Wi-Fi & backend.';
      setLabel('Error: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = lbl => {
    if (!lbl) return 'rgba(255,255,255,0.4)';
    if (lbl.toLowerCase().includes('healthy')) return '#10b981'; // Green
    if (lbl.toLowerCase().includes('early')) return '#f59e0b'; // Orange/Yellow
    if (lbl.toLowerCase().includes('late')) return '#ef4444'; // Red
    return 'rgba(255,255,255,0.4)';
  };

  const activeDisease = diseaseDetails[label];

  return (
    <SafeAreaView style={styles.outer}>
      <StatusBar barStyle="light-content" backgroundColor="#0b0f19" />
      
      {/* Background gradients simulated via styled View overlays */}
      <View style={styles.glowTop} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>🥔 PotatoAI</Text>
          <Text style={styles.brandSubtitle}>Deep Learning Disease Recognition</Text>
        </View>

        {/* Image Card Container */}
        <View style={styles.cardContainer}>
          {image ? (
            <View style={styles.imageWrapper}>
              <Image source={{uri: image}} style={styles.imageStyle} />
              <TouchableOpacity onPress={clearOutput} style={styles.clearBtn} activeOpacity={0.8}>
                <Text style={styles.clearBtnText}>✕ Clear Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Text style={styles.placeholderIcon}>🌿</Text>
              <Text style={styles.placeholderText}>Upload or capture a potato plant leaf image</Text>
              <Text style={styles.placeholderSubText}>Supports JPEG/PNG</Text>
            </View>
          )}
        </View>

        {/* Diagnosis & Analysis Results */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Analyzing cell structures...</Text>
          </View>
        )}

        {!loading && label ? (
          <View style={styles.resultCard}>
            {label.startsWith('Error') ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{label}</Text>
              </View>
            ) : (
              <View style={styles.resultDetails}>
                <Text style={styles.resultHeader}>DIAGNOSIS REPORT</Text>
                <Text style={[styles.resultLabel, {color: getSeverityColor(label)}]}>
                  {label}
                </Text>
                
                {/* Confidence Bar */}
                {confidence !== null && (
                  <View style={styles.confidenceSection}>
                    <View style={styles.confidenceLabelRow}>
                      <Text style={styles.confidenceTitle}>Confidence Level</Text>
                      <Text style={[styles.confidenceValue, {color: getSeverityColor(label)}]}>
                        {confidence.toFixed(1)}%
                      </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View 
                        style={[
                          styles.progressBarFill, 
                          {width: `${confidence}%`, backgroundColor: getSeverityColor(label)}
                        ]} 
                      />
                    </View>
                  </View>
                )}

                {/* Additional Information Card */}
                {activeDisease && (
                  <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoHeading}>Cause:</Text>
                      <Text style={styles.infoValue}>{activeDisease.cause}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoHeading}>Symptoms:</Text>
                      <Text style={styles.infoValue}>{activeDisease.symptoms}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoHeading}>Action/Treatment:</Text>
                      <Text style={styles.infoValue}>{activeDisease.treatment}</Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        ) : null}

        {/* Buttons Section */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => manageCamera('Camera')}
            style={styles.actionButton}>
            <Text style={styles.btnIcon}>📸</Text>
            <Text style={styles.btnText}>Use Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => manageCamera('Photo')}
            style={styles.actionButton}>
            <Text style={styles.btnIcon}>📁</Text>
            <Text style={styles.btnText}>From Gallery</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#070b13', // Deep Premium dark background
  },
  glowTop: {
    position: 'absolute',
    top: -height * 0.1,
    left: -width * 0.2,
    width: width * 1.4,
    height: height * 0.45,
    backgroundColor: 'rgba(99, 102, 241, 0.08)', // Indigo light glow
    borderRadius: 500,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginVertical: 15,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 4,
  },
  cardContainer: {
    width: '100%',
    aspectRatio: 1.1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    padding: 30,
  },
  placeholderIcon: {
    fontSize: 50,
    marginBottom: 12,
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 22,
  },
  placeholderSubText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 12,
    marginTop: 6,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  clearBtn: {
    position: 'absolute',
    bottom: 15,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  clearBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 12,
    fontSize: 14,
  },
  resultCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
    marginBottom: 20,
  },
  resultHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
    marginBottom: 4,
  },
  resultLabel: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 16,
  },
  confidenceSection: {
    marginBottom: 18,
  },
  confidenceLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  confidenceTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  confidenceValue: {
    fontWeight: '700',
    fontSize: 14,
  },
  progressBarBg: {
    height: 6,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    padding: 14,
  },
  infoRow: {
    marginBottom: 10,
  },
  infoHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 10,
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  actionButton: {
    flex: 0.47,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
  },
  btnIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  btnText: {
    color: '#a5b4fc',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default App;
